<?php

namespace App\Http\Controllers;

use App\Models\Buy;
use App\Models\User;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BuyController extends Controller
{
    /**
     * Display a listing of purchases
     */
    public function index()
    {
        $buys = Buy::with(['user', 'ticket'])->get();
        return view('buys.index', compact('buys'));
    }

    /**
     * Show the form for creating a new purchase
     */
    public function create()
    {
        $users = User::all();
        $tickets = Ticket::all();
        return view('buys.create', compact('users', 'tickets'));
    }

    /**
     * Store a newly created purchase
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'ticket_id' => 'required|exists:tickets,id',
            'purchase_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return redirect()->route('buys.create')
                ->withErrors($validator)
                ->withInput();
        }

        // Check for duplicate record
        $exists = Buy::where('user_id', $request->user_id)
            ->where('ticket_id', $request->ticket_id)
            ->exists();

        if ($exists) {
            return redirect()->route('buys.create')
                ->withErrors(['duplicate' => 'This user has already purchased this ticket'])
                ->withInput();
        }

        Buy::create([
            'user_id' => $request->user_id,
            'ticket_id' => $request->ticket_id,
            'purchase_date' => $request->purchase_date ?? now(),
        ]);

        return redirect()->route('buys.index')
            ->with('success', 'Purchase record created successfully');
    }

    /**
     * Show the form for editing the purchase
     */
    public function edit($user_id, $ticket_id)
    {
        $buy = Buy::where('user_id', $user_id)
            ->where('ticket_id', $ticket_id)
            ->firstOrFail();

        $users = User::all();
        $tickets = Ticket::all();

        return view('buys.edit', compact('buy', 'users', 'tickets'));
    }

    /**
     * Update the purchase
     */
    public function update(Request $request, $user_id, $ticket_id)
    {
        $validator = Validator::make($request->all(), [
            'purchase_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return redirect()->route('buys.edit', ['user_id' => $user_id, 'ticket_id' => $ticket_id])
                ->withErrors($validator)
                ->withInput();
        }

        $buy = Buy::where('user_id', $user_id)
            ->where('ticket_id', $ticket_id)
            ->firstOrFail();

        $buy->update([
            'purchase_date' => $request->purchase_date,
        ]);

        return redirect()->route('buys.index')
            ->with('success', 'Purchase record updated successfully');
    }

    /**
     * Remove the purchase
     */
    public function destroy($user_id, $ticket_id)
    {
        $buy = Buy::where('user_id', $user_id)
            ->where('ticket_id', $ticket_id)
            ->firstOrFail();

        $buy->delete();

        return redirect()->route('buys.index')
            ->with('success', 'Purchase record deleted successfully');
    }
}
