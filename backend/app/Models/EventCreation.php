<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventCreation extends Model
{
    public $timestamps = false; 
    protected $table = 'event_creation';

    protected $primaryKey = ['event_id', 'user_id'];
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = [
        'event_id',
        'user_id',
        'creation_date',
    ];

   
}