<!DOCTYPE html>
<html>
<head>
    <title>إضافة إشعار</title>
</head>
<body>
    <h1>إضافة إشعار جديد</h1>

    <form action="{{ route('notifications.store') }}" method="POST">
        @csrf
        <label>العنوان:</label>
        <input type="text" name="Title"><br><br>

        <label>الوصف:</label>
        <textarea name="Description"></textarea><br><br>

        <button type="submit">حفظ</button>
    </form>

    <a href="{{ route('notifications.index') }}">الرجوع للقائمة</a>
</body>
</html>
