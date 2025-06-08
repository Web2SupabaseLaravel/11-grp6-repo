<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Buy extends Model
{
    use HasFactory;

    // Define the table
    protected $table = 'buys';

    // Disable timestamps
    public $timestamps = false;

    // Composite primary key
    protected $primaryKey = ['user_id', 'ticket_id'];

    // Define non-incrementing key
    public $incrementing = false;

    // Mass assignable fields
    protected $fillable = [
        'user_id',
        'ticket_id',
        'purchase_date'
    ];

    // Data type casting
    protected $casts = [
        'purchase_date' => 'date',
    ];

    // User relationship
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Ticket relationship (assuming Ticket model exists)
    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }
}
