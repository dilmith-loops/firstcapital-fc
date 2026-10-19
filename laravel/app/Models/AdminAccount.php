<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;

class AdminAccount extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'admin_accounts';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password_hash',
        'role',
        'status',
        'last_login',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password_hash',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'last_login' => 'datetime',
        ];
    }

    /**
     * Tells Laravel to use password_hash column for authentication.
     */
    public function getAuthPasswordName(): string
    {
        return 'password_hash';
    }

    /**
     * Convenient mutator to set password.
     */
    public function setPasswordAttribute(string $value): void
    {
        $this->attributes['password_hash'] = Hash::needsRehash($value) ? Hash::make($value) : $value;
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'Super Admin';
    }

    public function isManager(): bool
    {
        return in_array($this->role, ['Super Admin', 'Manager'], true);
    }

    public function canManageLeads(): bool
    {
        return in_array($this->role, ['Super Admin', 'Manager', 'Wealth Advisor'], true);
    }

    public function canManageUsers(): bool
    {
        return $this->isSuperAdmin();
    }

    public function canEditSettings(): bool
    {
        return $this->isSuperAdmin();
    }

    public function isActive(): bool
    {
        return $this->status === 'Active';
    }
}
