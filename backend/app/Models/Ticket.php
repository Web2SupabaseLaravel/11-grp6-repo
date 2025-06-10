<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ticket extends Model
{
    use HasFactory;

    // الأهم: تأكد أن اسم الجدول هو 'ticket' (بصيغة المفرد) ليطابق قاعدة بياناتك
    protected $table = 'ticket';
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = true;

    protected $fillable = [
        'ticket_id',
        'event_id',
        'user_id',
        'title',
        'type',   // تأكد من وجود هذا الحقل في جدولك و في الـ fillable
        'price',
        'status', // تأكد من وجود هذا الحقل في جدولك و في الـ fillable
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'ticket_id' => 'integer',
        'event_id' => 'integer',
        'user_id' => 'integer',
    ];

    // العلاقات
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id', 'id');
    }

    // Scopes (تأكد من أنهم يتعاملون مع الحالات الصحيحة 'pending', 'confirmed', 'VIP')
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByEvent($query, $eventId)
    {
        return $query->where('event_id', $eventId);
    }
}
