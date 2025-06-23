@extends('layouts.app')

@section('content')
    <h1>Create Event</h1>

    @if ($errors->any())
        <div style="color: red;">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('events.store') }}" method="POST">
        @csrf

        <label>Title:</label>
        <input type="text" name="title" required><br><br>

        <label>Image (URL or path):</label>
        <input type="text" name="image" required><br><br>

        <label>Manager ID (optional):</label>
        <input type="number" name="manager_id"><br><br>

        <label>Description:</label>
        <textarea name="description" required></textarea><br><br>

        <label>Country:</label>
        <input type="text" name="country" required><br><br>

        <label>City:</label>
        <input type="text" name="city" required><br><br>

        <label>Speaker Name:</label>
        <input type="text" name="speaker_name" required><br><br>

        <label>Speaker Image (URL or path):</label>
        <input type="text" name="speaker_image" required><br><br>

        <label>Start Date and Time:</label>
        <input type="datetime-local" name="start_datetime" required><br><br>

        <button type="submit">Create Event</button>
    </form>

    <br>
    <a href="{{ route('events.index') }}">← Back to Events</a>
@endsection
