<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    // عرض جميع التذاكر
    public function index()
    {
        $tickets = Ticket::all(); // جلب جميع التذاكر
        return view('tickets.index', compact('tickets')); // تمرير البيانات للـ View
    }

    // عرض نموذج إضافة تذكرة جديدة
    public function create()
    {
        return view('tickets.create'); // عرض النموذج
    }

    // تخزين التذكرة الجديدة
    public function store(Request $request)
    {
        // التحقق من البيانات المدخلة
        $request->validate([
            'event_id' => 'nullable|integer',
            'title' => 'nullable|string',
            'type' => 'nullable|string',
            'price' => 'nullable|integer',
        ]);

        // حفظ التذكرة في قاعدة البيانات
        Ticket::create($request->all());
        return redirect()->route('tickets.index'); // إعادة التوجيه إلى قائمة التذاكر
    }

    // عرض تفاصيل التذكرة
    public function show($id)
    {
        $ticket = Ticket::findOrFail($id); // جلب التذكرة باستخدام الـ id
        return view('tickets.show', compact('ticket')); // عرض التفاصيل
    }

    // عرض نموذج تعديل التذكرة
    public function edit($id)
    {
        $ticket = Ticket::findOrFail($id); // جلب التذكرة
        return view('tickets.edit', compact('ticket')); // عرض نموذج التعديل
    }

    // تحديث التذكرة
    public function update(Request $request, $id)
    {
        // التحقق من البيانات المدخلة
        $request->validate([
            'event_id' => 'nullable|integer',
            'title' => 'nullable|string',
            'type' => 'nullable|string',
            'price' => 'nullable|integer',
        ]);

        $ticket = Ticket::findOrFail($id); // جلب التذكرة
        $ticket->update($request->all()); // تحديث البيانات
        return redirect()->route('tickets.index'); // إعادة التوجيه إلى قائمة التذاكر
    }

    // حذف التذكرة
    public function destroy($id)
    {
        $ticket = Ticket::findOrFail($id); // جلب التذكرة
        $ticket->delete(); // حذف التذكرة
        return redirect()->route('tickets.index'); // إعادة التوجيه إلى قائمة التذاكر
    }
}
