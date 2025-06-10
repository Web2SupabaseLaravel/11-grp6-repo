<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class TicketController extends Controller
{
    /**
     * عرض جميع التذاكر
     */
    public function index(): JsonResponse
    {
        $tickets = Ticket::with(['user', 'event'])->get();
        return response()->json($tickets);
    }

    /**
     * إنشاء تذكرة جديدة
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ticket_id' => 'required|integer|unique:tickets,ticket_id',
            'event_id' => 'nullable|integer|exists:events,id',
            'user_id' => 'nullable|integer|exists:users,id',
            'title' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:100',
            'price' => 'nullable|numeric|min:0',
            'status' => 'nullable|string|in:pending,confirmed,cancelled',
        ]);

        $ticket = Ticket::create($validated);
        
        // تحميل العلاقات
        $ticket->load(['user', 'event']);
        
        return response()->json([
            'message' => 'Ticket created successfully',
            'data' => $ticket
        ], 201);
    }

    /**
     * عرض تذكرة محددة
     */
    public function show($id): JsonResponse
    {
        $ticket = Ticket::with(['user', 'event'])->findOrFail($id);
        return response()->json($ticket);
    }

    /**
     * تحديث تذكرة
     */
    public function update(Request $request, $id): JsonResponse
    {
        $ticket = Ticket::findOrFail($id);

        $validated = $request->validate([
            'event_id' => 'nullable|integer|exists:events,id',
            'user_id' => 'nullable|integer|exists:users,id',
            'title' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:100',
            'price' => 'nullable|numeric|min:0',
            'status' => 'nullable|string|in:pending,confirmed,cancelled',
        ]);

        $ticket->update($validated);
        $ticket->load(['user', 'event']);

        return response()->json([
            'message' => 'Ticket updated successfully',
            'data' => $ticket
        ]);
    }

    /**
     * حذف تذكرة
     */
    public function destroy($id): JsonResponse
    {
        $ticket = Ticket::findOrFail($id);
        $ticket->delete();

        return response()->json([
            'message' => 'Ticket deleted successfully'
        ], 204);
    }

    /**
     * الحصول على جميع التذاكر مع التفاصيل
     */
    public function getAllTicketsDetails(): JsonResponse
    {
        $tickets = Ticket::with(['user', 'event'])
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
                    'eventTitle' => $ticket->event ? $ticket->event->title : ($ticket->title ?? 'N/A'),
                    'price' => $ticket->price ? number_format($ticket->price, 2) : '0.00'
                ];
            });

        return response()->json($tickets);
    }

    /**
     * الحصول على تفاصيل تذكرة محددة بواسطة ticket_id
     */
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

    /**
     * الحصول على التذاكر حسب الحالة
     */
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

    /**
     * الحصول على التذاكر حسب الحدث
     */
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

    /**
     * حساب الوقت المنقضي
     */
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

    /**
     * البحث في التذاكر
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->get('q');
        
        if (!$query) {
            return response()->json([
                'message' => 'Search query is required',
                'data' => []
            ], 400);
        }

        $tickets = Ticket::with(['user', 'event'])
            ->where(function ($q) use ($query) {
                $q->where('ticket_id', 'LIKE', "%{$query}%")
                  ->orWhere('title', 'LIKE', "%{$query}%")
                  ->orWhere('type', 'LIKE', "%{$query}%")
                  ->orWhere('status', 'LIKE', "%{$query}%")
                  ->orWhereHas('user', function ($userQuery) use ($query) {
                      $userQuery->where('name', 'LIKE', "%{$query}%")
                               ->orWhere('email', 'LIKE', "%{$query}%");
                  })
                  ->orWhereHas('event', function ($eventQuery) use ($query) {
                      $eventQuery->where('title', 'LIKE', "%{$query}%");
                  });
            })
            ->get();

        return response()->json([
            'message' => 'Search completed',
            'data' => $tickets
        ]);
    }
}