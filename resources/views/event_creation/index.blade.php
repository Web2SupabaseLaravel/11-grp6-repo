@extends('layouts.app')

@section('content')
    <h1>Event Creation List</h1>

    @if(session('success'))
        <div>{{ session('success') }}</div>
    @endif

    <a href="{{ route('event_creation.create') }}">Create New Event</a>

    <table border="1">
        <tr>
            <th>Event ID</th>
            <th>User ID</th>
            <th>Creation Date</th>
            <th>Actions</th>
        </tr>
        @foreach($events as $event)
        <tr>
            <td>{{ $event->event_id }}</td>
            <td>{{ $event->user_id }}</td>
            <td>{{ $event->creation_date }}</td>
            <td>
                <form action="{{ route('event_creation.destroy', [$event->event_id, $event->user_id]) }}" method="POST">
                    @csrf
                    @method('DELETE')
                    <button type="submit">Delete</button>
                </form>
            </td>
        </tr>
        @endforeach
    </table>
@endsection