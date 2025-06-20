<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Buy;

class BuyController extends Controller
{
    public function index()
    {
        return response()->json(Buy::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|integer',
            'ticket_id' => 'required|integer',
            'purchase_date' => 'nullable|date',
        ]);

        $buy = Buy::create($validated);
        return response()->json($buy, 201);
    }

    public function show($user_id, $ticket_id)
    {
        $buy = Buy::where('user_id', $user_id)
                  ->where('ticket_id', $ticket_id)
                  ->first();

        if (!$buy) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return response()->json($buy);
    }

    public function destroy($user_id, $ticket_id)
    {
        $buy = Buy::where('user_id', $user_id)
                  ->where('ticket_id', $ticket_id)
                  ->first();

        if (!$buy) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $buy->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
