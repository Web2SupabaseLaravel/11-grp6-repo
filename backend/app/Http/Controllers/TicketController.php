<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $table = 'ticket'; // Table name in database
    protected $primaryKey = 'ticket_id'; // Primary key field name
    public $incrementing = false; // Because ticket_id might be large or manually set
    protected $keyType = 'int'; // Data type of the primary key
    public $timestamps = false; // Disable timestamps if 'created_at' and 'updated_at' are not in the table

    protected $fillable = [
        'ticket_id',
        'event_id', // Make sure this column exists in your 'ticket' table
        'title',
        'type',
        'price',
    ];

    /**
     * Get the event that the ticket belongs to.
     * This defines the many-to-one relationship between Ticket and Event.
     */
    public function event() // <<< THIS IS THE MISSING METHOD
    {
        return $this->belongsTo(Event::class, 'event_id', 'event_id');
        // Explanation:
        // Event::class: The related model is the Event model.
        // 'event_id': The foreign key on the 'ticket' table (this model's table).
        // 'event_id': The primary key on the 'event' table (the related model's table).
        // Make sure your 'ticket' table has an 'event_id' column.
    }
}
