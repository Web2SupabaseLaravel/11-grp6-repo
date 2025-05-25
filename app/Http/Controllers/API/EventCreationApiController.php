<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EventCreation;

class EventCreationApiController extends Controller
{
    public function index()
    {
        $events = EventCreation::all();
        return response()->json($events);
    }
    public function show($event_id, $user_id)
    {
        $event = EventCreation::where('event_id', $event_id)
                            ->where('user_id', $user_id)
                            ->first();

        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        return response()->json($event);
    }
    public function update(Request $request, $event_id, $user_id)
    {
        $event = EventCreation::where('event_id', $event_id)
                            ->where('user_id', $user_id)
                            ->first();

        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        $validated = $request->validate([
            'creation_date' => 'nullable|date',
        ]);

        $event->update($validated);

        return response()->json(['message' => 'Event Updated Successfully', 'event' => $event]);
    }



    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_id' => 'required|integer',
            'user_id' => 'required|integer',
            'creation_date' => 'nullable|date',
        ]);

        $event = EventCreation::create($validated);

        return response()->json(['message' => 'Event Created Successfully', 'event' => $event], 201);
    }

    public function destroy($event_id, $user_id)
    {
        $deleted = EventCreation::where('event_id', $event_id)
                                ->where('user_id', $user_id)
                                ->delete();

        if ($deleted) {
            return response()->json(['message' => 'Event Deleted Successfully']);
        }

        return response()->json(['message' => 'Event Not Found'], 404);
    }
}
