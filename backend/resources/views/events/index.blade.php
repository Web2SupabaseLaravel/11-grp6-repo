<h1>All Events</h1>
<a href="{{ route('events.create') }}">Create Event</a>

<ul>
    @foreach($events as $event)
        <li>
            {{ $event->title }} |
            <a href="{{ route('events.show', $event->event_id) }}">Show</a> |
            <a href="{{ route('events.edit', $event->event_id) }}">Edit</a>
        </li>
    @endforeach
</ul>
