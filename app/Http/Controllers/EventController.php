<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $events = Event::all();
        return view('events.index', compact('events'));
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('events.create');
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_id' => 'required|numeric|unique:event,event_id',
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


    /**
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        return view('events.show', compact('event'));
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Event $event)
    {
        return view('events.edit', compact('event'));
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title' => 'nullable',
            'country' => 'nullable',
        ]);

        $event->update($validated);

        return redirect()->route('events.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        $event->delete();
        return redirect()->route('events.index');
    }

}
