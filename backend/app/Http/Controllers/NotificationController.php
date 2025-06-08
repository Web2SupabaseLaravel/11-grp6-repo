<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    // عرض جميع الإشعارات
    public function index()
    {
        $notifications = Notification::all();
        return view('notifications.index', compact('notifications'));
    }

    // عرض نموذج إنشاء إشعار جديد
    public function create()
    {
        return view('notifications.create');
    }

    // تخزين الإشعار الجديد في قاعدة البيانات
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        notification::create([
            'title' => $request->title,
            'message' => $request->message,
        ]);

        return redirect()->route('notification.index')->with('success', 'تم إنشاء الإشعار بنجاح.');
    }

    // عرض نموذج تعديل الإشعار
    public function edit($id)
    {
        $notification = notification::findOrFail($id);
        return view('notifications.edit', compact('notification'));
    }

    // تحديث الإشعار بعد التعديل
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $notification = notification::findOrFail($id);
        $notification->update([
            'title' => $request->title,
            'message' => $request->message,
        ]);

        return redirect()->route('notification.index')->with('success', 'تم تعديل الإشعار بنجاح.');
    }

    // حذف إشعار معين
    public function destroy($id)
    {
        $notification = notification::findOrFail($id);
        $notification->delete();

        return redirect()->route('notification.index')->with('success', 'تم حذف الإشعار.');
    }
}
