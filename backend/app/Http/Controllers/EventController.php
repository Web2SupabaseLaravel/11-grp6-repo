<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;

class EventController extends Controller
{

    public function index()
    {
        $events = Event::all();
        return view('events.index', compact('events'));
    }

    public function create()
    {
        return view('events.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'image' => 'nullable|string',
            'manager_id' => 'nullable|numeric|exists:users,id',
            'description' => 'nullable|string',
            'country' => 'nullable|string',
            'city' => 'nullable|string',
            'speaker_name' => 'nullable|string',
            'speaker_image' => 'nullable|string',
            'start_datetime' => 'nullable|date',
            
        ]);

        Event::create($validated);

        return redirect()->route('events.index');
    }
    public function show(Event $event)
    {
        return view('events.show', compact('event'));
    }

    public function edit(Event $event)
    {
        return view('events.edit', compact('event'));
    }

    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'image' => 'nullable|string',
            'manager_id' => 'nullable|numeric|exists:users,id',
            'description' => 'nullable|string',
            'country' => 'nullable|string',
            'city' => 'nullable|string',
            'speaker_name' => 'nullable|string',
            'speaker_image' => 'nullable|string',
            'start_datetime' => 'nullable|date',
        ]);

        $event->update($validated);

        return redirect()->route('events.index');
    }

    public function destroy(Event $event)
    {
        $event->delete();
        return redirect()->route('events.index');
    }
}
