@extends('layouts.app')

@section('content')
    <h1>Edit Event</h1>

    @if ($errors->any())
        <div style="color: red;">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif
    

    <form action="{{ route('events.update', $event->event_id) }}" method="POST">
        @csrf
        @method('PUT')

        <label>Title:</label>
        <input type="text" name="title" value="{{ old('title', $event->title) }}"><br><br>

        <label>Image (URL or path):</label>
        <input type="text" name="image" value="{{ old('image', $event->image) }}"><br><br>

        <label>Manager ID (optional):</label>
        <input type="number" name="manager_id" value="{{ old('manager_id', $event->manager_id) }}"><br><br>

        <label>Description:</label>
        <textarea name="description">{{ old('description', $event->description) }}</textarea><br><br>

        <label>Country:</label>
        <input type="text" name="country" value="{{ old('country', $event->country) }}"><br><br>

        <label>City:</label>
        <input type="text" name="city" value="{{ old('city', $event->city) }}"><br><br>

        <label>Speaker Name:</label>
        <input type="text" name="speaker_name" value="{{ old('speaker_name', $event->speaker_name) }}"><br><br>

        <label>Speaker Image (URL or path):</label>
        <input type="text" name="speaker_image" value="{{ old('speaker_image', $event->speaker_image) }}"><br><br>

        <label>Start Date and Time:</label>
        <input type="datetime-local" name="start_datetime" 
               value="{{ old('start_datetime', \Carbon\Carbon::parse($event->start_datetime)->format('Y-m-d\TH:i')) }}"><br><br>

        <button type="submit">Update Event</button>
    </form>

    <br>
    <a href="{{ route('events.index') }}">← Back to Events</a>
@endsection
