<!DOCTYPE html>
<html>
<head>
    <title>كل الإشعارات</title>
</head>
<body>
    <h1>قائمة الإشعارات</h1>

    <a href="{{ route('notifications.create') }}">إضافة إشعار جديد</a>

    <table border="1">
        <tr>
            <th>ID</th>
            <th>العنوان</th>
            <th>الوصف</th>
            <th>تاريخ الإنشاء</th>
            <th>خيارات</th>
        </tr>
        @foreach ($notifications as $notification)
            <tr>
                <td>{{ $notification->id }}</td>
                <td>{{ $notification->title }}</td>
                <td>{{ $notification->message }}</td>
                <td>{{ $notification->created_at }}</td>
                <td>
                    <a href="{{ route('notifications.edit', $notification->id) }}">تعديل</a> |
                    <form action="{{ route('notifications.destroy', $notification->id) }}" method="POST" style="display:inline;">
                        @csrf
                        @method('DELETE')
                        <button type="submit" onclick="return confirm('هل أنت متأكد من الحذف؟')">حذف</button>
                    </form>
                </td>
            </tr>
        @endforeach
    </table>
</body>
</html>
