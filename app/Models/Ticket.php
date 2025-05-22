<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $table = 'ticket'; 
    protected $primaryKey = 'ticket_id'; 
    public $timestamps = false; 

    
    protected $fillable = [
        'ticket_id',
        'event_id',
        'title',
        'type',
        'price',
    ];
}
 