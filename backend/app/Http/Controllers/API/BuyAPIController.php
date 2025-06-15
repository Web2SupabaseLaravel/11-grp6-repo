<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Buy;
use App\Models\User;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BuyAPIController extends Controller
{
    /**
     * Display a listing of purchases
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $buys = Buy::with(['user', 'ticket'])->get();

        return response()->json([
            'status' => 'success',
            'data' => $buys
        ], 200);
    }

    /**
     * Get data for creating a new purchase
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function create()
    {
        $users = User::all();
        $tickets = Ticket::all();

        return response()->json([
            'status' => 'success',
            'users' => $users,
            'tickets' => $tickets
        ], 200);
    }

    /**
     * Store a newly created purchase
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'ticket_id' => 'required|exists:tickets,id',
            'purchase_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check for duplicate record
        $exists = Buy::where('user_id', $request->user_id)
            ->where('ticket_id', $request->ticket_id)
            ->exists();

        if ($exists) {
            return response()->json([
                'status' => 'error',
                'message' => 'This user has already purchased this ticket'
            ], 422);
        }

        $buy = Buy::create([
            'user_id' => $request->user_id,
            'ticket_id' => $request->ticket_id,
            'purchase_date' => $request->purchase_date ?? now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Purchase record created successfully',
            'data' => $buy
        ], 201);
    }

    /**
     * Get data for editing a purchase
     *
     * @param  int  $user_id
     * @param  int  $ticket_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function edit($user_id, $ticket_id)
    {
        $buy = Buy::where('user_id', $user_id)
            ->where('ticket_id', $ticket_id)
            ->first();

        if (!$buy) {
            return response()->json([
                'status' => 'error',
                'message' => 'Purchase record not found'
            ], 404);
        }

        $users = User::all();
        $tickets = Ticket::all();

        return response()->json([
            'status' => 'success',
            'buy' => $buy,
            'users' => $users,
            'tickets' => $tickets
        ], 200);
    }

    /**
     * Update the purchase
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $user_id
     * @param  int  $ticket_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $user_id, $ticket_id)
    {
        $validator = Validator::make($request->all(), [
            'purchase_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $buy = Buy::where('user_id', $user_id)
            ->where('ticket_id', $ticket_id)
            ->first();

        if (!$buy) {
            return response()->json([
                'status' => 'error',
                'message' => 'Purchase record not found'
            ], 404);
        }

        $buy->update([
            'purchase_date' => $request->purchase_date,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Purchase record updated successfully',
            'data' => $buy
        ], 200);
    }

    /**
     * Remove the purchase
     *
     * @param  int  $user_id
     * @param  int  $ticket_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($user_id, $ticket_id)
    {
        $buy = Buy::where('user_id', $user_id)
            ->where('ticket_id', $ticket_id)
            ->first();

        if (!$buy) {
            return response()->json([
                'status' => 'error',
                'message' => 'Purchase record not found'
            ], 404);
        }

        $buy->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Purchase record deleted successfully'
        ], 200);
    }
}
