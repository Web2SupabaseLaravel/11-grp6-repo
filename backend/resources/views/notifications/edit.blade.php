<!DOCTYPE html>
<html>
<head>
    <title>تعديل إشعار</title>
</head>
<body>
    <h1>تعديل الإشعار</h1>

    <form action="{{ route('notifications.update', $notification->id) }}" method="POST">
        @csrf
        @method('PUT')

        <label>العنوان:</label>
        <input type="text" name="Title" value="{{ $notification->Title }}"><br><br>

        <label>الوصف:</label>
        <textarea name="Description">{{ $notification->Description }}</textarea><br><br>

        <button type="submit">تحديث</button>
    </form>

    <a href="{{ route('notifications.index') }}">الرجوع للقائمة</a>
</body>
</html>
