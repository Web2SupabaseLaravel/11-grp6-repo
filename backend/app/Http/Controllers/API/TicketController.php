<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index()
    {
        return Ticket::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ticket_id' => 'required|integer|unique:ticket,ticket_id',
            'event_id' => 'nullable|integer',
            'title' => 'nullable|string',
            'type' => 'nullable|string',
            'price' => 'nullable|integer',
        ]);

        $ticket = Ticket::create($validated);
        return response()->json($ticket, 201);
    }

    public function show($ticket_id)
    {
        $ticket = Ticket::findOrFail($ticket_id);
        return response()->json($ticket);
    }

    public function update(Request $request, $ticket_id)
    {
        $ticket = Ticket::findOrFail($ticket_id);

        $validated = $request->validate([
            'event_id' => 'nullable|integer',
            'title' => 'nullable|string',
            'type' => 'nullable|string',
            'price' => 'nullable|integer',
        ]);

        $ticket->update($validated);
        return response()->json($ticket);
    }

    public function destroy($ticket_id)
    {
        $ticket = Ticket::findOrFail($ticket_id);
        $ticket->delete();
        return response()->json(null, 204);
    }
}
