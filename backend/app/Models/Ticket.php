<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $table = 'ticket';  // اسم الجدول

    protected $primaryKey = 'ticket_id'; // المفتاح الأساسي غير افتراضي

    public $incrementing = false; // لأن ticket_id كبير وممكن نحدد قيمته بنفسنا

    protected $keyType = 'int';

    public $timestamps = false; // إذا ما في created_at و updated_at في الجدول

    protected $fillable = [
        'ticket_id',
        'event_id',
        'title',
        'type',
        'price',
    ];
}
