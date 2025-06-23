// في BuyAPIController.php

use App\Http\Resources\BuyResource;

// تعديل دالة index()
public function index()
{
    $buys = Buy::with(['user', 'ticket'])->get();

    return BuyResource::collection($buys);
}

// تعديل دالة show()
public function show($user_id, $ticket_id)
{
    $buy = Buy::with(['user', 'ticket'])
        ->where('user_id', $user_id)
        ->where('ticket_id', $ticket_id)
        ->first();

    if (!$buy) {
        return response()->json([
            'status' => false,
            'message' => 'Purchase record not found'
        ], 404);
    }

    return new BuyResource($buy);
}
