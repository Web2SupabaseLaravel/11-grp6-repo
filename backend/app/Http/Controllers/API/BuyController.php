<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Buy;
use Carbon\Carbon; // Make sure Carbon is imported

class BuyController extends Controller
{
    public function index()
    {
        // This is the correct way to return data structured with 'status' and 'data' keys
        $buys = Buy::with(['user', 'ticket.event'])->get();
        return response()->json(['status' => 'success', 'data' => $buys]);
    }

    public function store(Request $request)
    {
        // ... (your store method code) ...
        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'ticket_id' => 'required|integer|exists:ticket,ticket_id',
            'purchase_date' => 'nullable|date',
        ]);

        if (!isset($validated['purchase_date'])) {
            $validated['purchase_date'] = Carbon::now();
        }

        $existingBuy = Buy::where('user_id', $validated['user_id'])
                          ->where('ticket_id', $validated['ticket_id'])
                          ->first();

        if ($existingBuy) {
            return response()->json(['message' => 'User already has this ticket registered.'], 409);
        }

        $buy = Buy::create($validated);
        $buy->load(['user', 'ticket.event']);
        return response()->json(['status' => 'success', 'message' => 'Buy created successfully', 'data' => $buy], 201);
    }

    public function show($user_id, $ticket_id)
    {
        // ... (your show method code) ...
        $buy = Buy::where('user_id', $user_id)
                    ->where('ticket_id', $ticket_id)
                    ->with(['user', 'ticket.event'])
                    ->first();

        if (!$buy) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json($buy);
    }

    public function update(Request $request, $user_id, $ticket_id)
    {
        // ... (your update method code) ...
        $buy = Buy::where('user_id', $user_id)
                    ->where('ticket_id', $ticket_id)
                    ->first();

        if (!$buy) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $validated = $request->validate([
            'purchase_date' => 'nullable|date',
        ]);

        $buy->update($validated);
        $buy->load(['user', 'ticket.event']);
        return response()->json($buy);
    }

    public function destroy($user_id, $ticket_id)
    {
        // ... (your destroy method code) ...
        $buy = Buy::where('user_id', $user_id)
                    ->where('ticket_id', $ticket_id)
                    ->first();

        if (!$buy) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $buy->delete();
        return response()->json(['status' => 'success', 'message' => 'Deleted successfully']);
    }
}
