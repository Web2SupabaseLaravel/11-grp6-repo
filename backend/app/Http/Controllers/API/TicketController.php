<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;
use Log; // استيراد كلاس Log لتسجيل الأخطاء

class TicketController extends Controller
{
    public function index(): JsonResponse
    {
        $tickets = Ticket::with(['user', 'event'])->get();
        return response()->json($tickets);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ticket_id' => 'required|integer|unique:ticket,ticket_id', // تم تعديل 'tickets' إلى 'ticket'
            'event_id' => 'nullable|integer|exists:events,id',
            'user_id' => 'nullable|integer|exists:users,id',
            'title' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:100',
            'price' => 'nullable|numeric|min:0',
            'status' => 'nullable|string|in:pending,confirmed,cancelled',
        ]);

        $ticket = Ticket::create($validated);
        $ticket->load(['user', 'event']);
        
        return response()->json([
            'message' => 'Ticket created successfully',
            'data' => $ticket
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $ticket = Ticket::with(['user', 'event'])->findOrFail($id);
        return response()->json($ticket);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $ticket = Ticket::findOrFail($id);

        $validated = $request->validate([
            'event_id' => 'nullable|integer|exists:events,id',
            'user_id' => 'nullable|integer|exists:users,id',
            'title' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:100',
            'price' => 'nullable|numeric|min:0',
            'status' => 'nullable|string|in:pending,confirmed,cancelled,VIP', // تأكد من وجود VIP هنا إذا كان حالة
        ]);

        $ticket->update($validated);
        $ticket->load(['user', 'event']);

        return response()->json([
            'message' => 'Ticket updated successfully',
            'data' => $ticket
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $ticket = Ticket::findOrFail($id);
        $ticket->delete();

        return response()->json([
            'message' => 'Ticket deleted successfully'
        ], 204);
    }

    public function getAllTicketsDetails(Request $request): JsonResponse
    {
        try {
            $query = Ticket::with(['user', 'event']);

            // 1. تطبيق فلتر البحث (searchTerm)
            if ($request->has('search') && !empty($request->input('search'))) {
                $searchTerm = $request->input('search');
                $query->where(function ($q) use ($searchTerm) {
                    $q->whereHas('user', function ($userQuery) use ($searchTerm) {
                        $userQuery->where('name', 'like', '%' . $searchTerm . '%')
                                  ->orWhere('email', 'like', '%' . $searchTerm . '%');
                    })
                    ->orWhere('title', 'like', '%' . $searchTerm . '%');
                });
            }

            // 2. تطبيق فلتر الحالة (statusFilter)
            if ($request->has('status') && $request->input('status') !== 'all attendees') {
                $status = $request->input('status');
                if ($status === 'checked in') {
                    $status = 'confirmed';
                }
                // إذا كانت 'VIP' حالة وليست نوع تذكرة، استخدمها هنا
                // تأكد أن قيم الحالة في الـ frontend تتطابق مع قيم الـ backend بعد التحويل
                $query->where('status', $status);
            }

            // 3. تطبيق فلتر نوع التذكرة (ticketTypeFilter)
            if ($request->has('type') && $request->input('type') !== 'ticket type') {
                $ticketType = $request->input('type');
                $query->where('type', $ticketType);
            }

            $tickets = $query->get()
                ->map(function ($ticket) {
                    return [
                        'id' => $ticket->id,
                        'ticket_id' => $ticket->ticket_id,
                        'name' => $ticket->user ? $ticket->user->name : 'N/A',
                        'email' => $ticket->user ? $ticket->user->email : 'N/A',
                        // تحويل الحالة من الـ backend ('confirmed', 'pending') إلى الـ frontend ('Checked in', 'Pending')
                        'status' => $ticket->status === 'confirmed' ? 'Checked in' : ($ticket->status === 'pending' ? 'Pending' : $ticket->status),
                        'registered' => $this->getTimeAgo($ticket->created_at),
                        'ticketType' => $ticket->type ?? 'Regular',
                        'eventTitle' => $ticket->event ? $ticket->event->title : ($ticket->title ?? 'N/A'),
                        'price' => $ticket->price ? number_format($ticket->price, 2) : '0.00'
                    ];
                });

            return response()->json($tickets);

        } catch (\Exception $e) {
            // تسجيل الخطأ في سجلات Laravel
            Log::error("Error in getAllTicketsDetails: " . $e->getMessage() . " at " . $e->getFile() . ":" . $e->getLine());

            // إرجاع رسالة خطأ مفصلة للواجهة الأمامية
            return response()->json([
                'status' => 'error',
                'message' => 'Internal Server Error: ' . $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                // 'trace' => $e->getTraceAsString(), // لا تقم بتضمين trace في الإنتاج لأسباب أمنية
            ], 500);
        }
    }

    public function getTicketDetails($ticket_id): JsonResponse
    {
        $ticket = Ticket::with(['user', 'event'])
            ->where('ticket_id', $ticket_id)
            ->firstOrFail();

        $ticketDetails = [
            'id' => $ticket->id,
            'ticket_id' => $ticket->ticket_id,
            'name' => $ticket->user ? $ticket->user->name : 'N/A',
            'email' => $ticket->user ? $ticket->user->email : 'N/A',
            'status' => $ticket->status ?? 'pending',
            'registered' => $this->getTimeAgo($ticket->created_at),
            'ticketType' => $ticket->type ?? 'Regular',
            'eventTitle' => $ticket->event ? $ticket->event->title : ($ticket->title ?? 'N/A'),
            'eventCity' => $ticket->event ? $ticket->event->city : 'N/A',
            'eventCountry' => $ticket->event ? $ticket->event->country : 'N/A',
            'speakerName' => $ticket->event ? $ticket->event->speaker_name : 'N/A',
            'startDateTime' => $ticket->event ? $ticket->event->start_datetime : 'N/A',
            'price' => $ticket->price ? number_format($ticket->price, 2) : '0.00'
        ];

        return response()->json($ticketDetails);
    }

    public function getTicketsByStatus($status): JsonResponse
    {
        $tickets = Ticket::with(['user', 'event'])
            ->byStatus($status)
            ->get()
            ->map(function ($ticket) {
                return [
                    'id' => $ticket->id,
                    'ticket_id' => $ticket->ticket_id,
                    'name' => $ticket->user ? $ticket->user->name : 'N/A',
                    'email' => $ticket->user ? $ticket->user->email : 'N/A',
                    'status' => $ticket->status,
                    'registered' => $this->getTimeAgo($ticket->created_at),
                    'ticketType' => $ticket->type ?? 'Regular',
                    'eventTitle' => $ticket->event ? $ticket->event->title : ($ticket->title ?? 'N/A'),
                    'price' => $ticket->price ? number_format($ticket->price, 2) : '0.00'
                ];
            });

        return response()->json($tickets);
    }

    public function getTicketsByEvent($event_id): JsonResponse
    {
        $tickets = Ticket::with(['user', 'event'])
            ->byEvent($event_id)
            ->get()
            ->map(function ($ticket) {
                return [
                    'id' => $ticket->id,
                    'ticket_id' => $ticket->ticket_id,
                    'name' => $ticket->user ? $ticket->user->name : 'N/A',
                    'email' => $ticket->user ? $ticket->user->email : 'N/A',
                    'status' => $ticket->status ?? 'pending',
                    'registered' => $this->getTimeAgo($ticket->created_at),
                    'ticketType' => $ticket->type ?? 'Regular',
                    'eventTitle' => $ticket->event ? $ticket->event->title : 'N/A',
                    'price' => $ticket->price ? number_format($ticket->price, 2) : '0.00'
                ];
            });

        return response()->json($tickets);
    }

    private function getTimeAgo($date): string
    {
        if (!$date) return 'N/A';
        
        try {
            $carbon = Carbon::parse($date);
            return $carbon->diffForHumans();
        } catch (\Exception $e) {
            return 'N/A';
        }
    }
}