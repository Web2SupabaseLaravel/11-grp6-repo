<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    // تأكد أن اسم الجدول هو 'users' (بالجمع) ليطابق قاعدة بياناتك
    protected $table = 'users'; 

    protected $fillable = [
        'name',
        'email',
        'email_verified_at',
        'password',
        'phone',
        'address',
        'city',
        'country',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // العلاقات
    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'user_id', 'id');
    }
    
    // Scopes
    public function scopeVerified($query)
    {
        return $query->whereNotNull('email_verified_at');
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
