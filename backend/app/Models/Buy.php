<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Buy extends Model
{
    use HasFactory;

    protected $table = 'buys';

    protected $primaryKey = ['user_id', 'ticket_id'];
    public $incrementing = false;


    public $timestamps = false;
    protected $fillable = [
        'user_id',
        'ticket_id',
        'purchase_date',
    ];

    protected $casts = [
        'purchase_date' => 'datetime',
    ];

    public function getKeyName()
    {
        return ['user_id', 'ticket_id'];
    }

    public function getKey()
    {
        return [
            'user_id' => $this->getAttribute('user_id'),
            'ticket_id' => $this->getAttribute('ticket_id'),
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ticket()
    {
        return $this->belongsTo(Ticket::class, 'ticket_id', 'ticket_id');
    }
}
