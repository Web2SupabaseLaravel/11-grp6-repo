<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $table = 'notification';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = ['id', 'user_id', 'Title', 'Description', 'created_at'];
}
