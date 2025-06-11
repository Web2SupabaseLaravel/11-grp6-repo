@extends('layouts.app')

@section('content')
    <h1>Create Event</h1>

    @if ($errors->any())
        <div>
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('event_creation.store') }}" method="POST">
        @csrf
        <label>Event ID:</label>
        <input type="number" name="event_id" required><br>

        <label>User ID:</label>
        <input type="number" name="user_id" required><br>

        <label>Creation Date:</label>
        <input type="date" name="creation_date"><br>

        <button type="submit">Submit</button>
    </form>
@endsection