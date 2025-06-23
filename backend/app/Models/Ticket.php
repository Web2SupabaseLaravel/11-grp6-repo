<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $table = 'ticket';
    protected $primaryKey = 'ticket_id';
    public $incrementing = false;
    protected $keyType = 'int';
    public $timestamps = false;

    protected $fillable = [
        'ticket_id',
        'event_id',
        'title',
        'type',
        'price',
    ];

    /**
     * Get the event that the ticket belongs to.
     */
    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id', 'event_id');
    }
}