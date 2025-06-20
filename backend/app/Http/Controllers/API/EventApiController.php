<?php

namespace App\Http\Controllers\API;

use App\Models\Event;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class EventApiController extends Controller
{
    public function index()
    {
        return response()->json(Event::all(), 200);
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

        $event = Event::create($validated);

        return response()->json($event, 201);
    }

    public function show($id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        return response()->json($event, 200);
    }

    public function update(Request $request, $id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'country' => 'nullable|string',
            'city' => 'nullable|string',
            'speaker_name' => 'nullable|string',
            'job_title' => 'nullable|string', 
            'ticket_type' => 'nullable|string', 
            'capacity' => 'nullable|integer',
            'start_datetime' => 'nullable|date',
            'image' => 'nullable|string', 
        ]);

        $event->update($validated);

        return response()->json($event, 200);
    }

    public function destroy($id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        $event->delete();

        return response()->json(['message' => 'Event deleted'], 200);
    }
}
