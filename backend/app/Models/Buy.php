<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Buy extends Model
{
    protected $table = 'buys';
    public $timestamps = false;

    // No auto-incrementing primary key
    public $incrementing = false;

    // Composite key type is not just int
    protected $keyType = 'array';

    protected $fillable = [
        'user_id',
        'ticket_id',
        'purchase_date',
    ];
}
