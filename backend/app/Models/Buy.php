<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Buy extends Model
{
    use HasFactory;

    // Set the table name explicitly (if different from 'buys')
    protected $table = 'buys';

    // Set primary keys
    protected $primaryKey = ['user_id', 'ticket_id'];
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'ticket_id',
        'purchase_date',
    ];

    protected $casts = [
        'purchase_date' => 'datetime',
    ];

    /**
     * Override the getKeyName method to work with composite keys
     */
    public function getKeyName()
    {
        return ['user_id', 'ticket_id'];
    }

    /**
     * Override the getKey method to work with composite keys
     */
    public function getKey()
    {
        return [
            'user_id' => $this->getAttribute('user_id'),
            'ticket_id' => $this->getAttribute('ticket_id'),
        ];
    }

    /**
     * Get the user that owns the purchase
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the ticket that is purchased
     */
    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }
}
