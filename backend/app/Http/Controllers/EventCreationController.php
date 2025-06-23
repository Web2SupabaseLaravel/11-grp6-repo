<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EventCreation;

class EventCreationController extends Controller
{
    public function index()
    {
        $events = EventCreation::all();
        return view('event_creation.index', compact('events'));
    }

    public function create()
    {
        return view('event_creation.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required|integer',
            'user_id' => 'required|integer',
            'creation_date' => 'nullable|date',
        ]);

        EventCreation::create($request->all());

        return redirect()->route('event_creation.index')->with('success', 'Event Created Successfully');
    }

    public function destroy($event_id, $user_id)
    {
        EventCreation::where('event_id', $event_id)
                     ->where('user_id', $user_id)
                     ->delete();

        return redirect()->route('event_creation.index')->with('success', 'Event Deleted Successfully');
    }
}