<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class CheckInAPIController extends Controller
{
    public function manualCheckIn(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string'
        ]);

        $user = User::where('email', $request->identifier)
                    ->orWhere('id', $request->identifier)
                    ->first();

        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'User not found'], 404);
        }

        return response()->json(['status' => 'success', 'message' => 'User checked in successfully'], 200);
    }
}
