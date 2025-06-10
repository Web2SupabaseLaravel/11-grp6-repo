<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Event extends Model
{
    use HasFactory;
    
    // تأكد أن اسم الجدول هو 'events' (بالجمع) ليطابق قاعدة بياناتك
    protected $table = 'events'; 
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = true;
    
    protected $fillable = [
        'title',
        'description',
        'city',
        'country',
        'speaker_name',
        'start_datetime',
        'date',
        'location',
        'price',
        'status',
    ];
    
    protected $casts = [
        'date' => 'datetime',
        'start_datetime' => 'datetime',
        'price' => 'decimal:2',
    ];
    
    // العلاقات
    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'event_id', 'id');
    }
    
    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
    
    public function scopeByLocation($query, $city, $country = null)
    {
        $query = $query->where('city', $city);
        if ($country) {
            $query = $query->where('country', $country);
        }
        return $query;
    }
}
