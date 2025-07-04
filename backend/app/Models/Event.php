<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    public $timestamps = false;
    protected $table = 'event'; 

    protected $primaryKey = 'event_id'; 
    public $incrementing = true;

    protected $fillable = [
        'title',
        'image',
        'manager_id',
        'description',
        'country',
        'city',
        'speaker_name',
        'speaker_image',
        'start_datetime',
    ];

    
}
