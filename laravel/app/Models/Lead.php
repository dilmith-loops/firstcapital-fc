<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use HasFactory;

    protected $table = 'quiz_leads';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'gender',
        'result_code',
        'result_profile',
        'matched_product',
        'answers_json',
        'status',
        'notes',
        'source',
    ];

    protected function casts(): array
    {
        return [
            'answers_json' => 'array',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    public const STATUSES = [
        'NEW' => 'New Lead',
        'CONTACTED' => 'Contacted',
        'QUALIFIED' => 'Qualified',
        'CONVERTED' => 'Converted',
        'CLOSED' => 'Closed / Disqualified',
    ];

    public function scopeSearch(Builder $query, ?string $term): Builder
    {
        if (empty($term)) {
            return $query;
        }

        $clean = trim($term);
        return $query->where(function (Builder $q) use ($clean) {
            $q->where('name', 'like', "%{$clean}%")
              ->orWhere('email', 'like', "%{$clean}%")
              ->orWhere('phone', 'like', "%{$clean}%")
              ->orWhere('matched_product', 'like', "%{$clean}%")
              ->orWhere('result_profile', 'like', "%{$clean}%");
        });
    }

    public function scopeFilterStatus(Builder $query, ?string $status): Builder
    {
        if (!empty($status) && $status !== 'all') {
            return $query->where('status', strtoupper($status));
        }
        return $query;
    }

    public function scopeFilterProfile(Builder $query, ?string $code): Builder
    {
        if (!empty($code) && $code !== 'all') {
            return $query->where('result_code', strtoupper($code));
        }
        return $query;
    }

    public function getStatusBadgeClassAttribute(): string
    {
        return match (strtoupper($this->status ?? 'NEW')) {
            'NEW' => 'bg-amber-100 text-amber-800 border-amber-300',
            'CONTACTED' => 'bg-blue-100 text-blue-800 border-blue-300',
            'QUALIFIED' => 'bg-purple-100 text-purple-800 border-purple-300',
            'CONVERTED' => 'bg-emerald-100 text-emerald-800 border-emerald-300',
            'CLOSED' => 'bg-slate-100 text-slate-700 border-slate-300',
            default => 'bg-slate-100 text-slate-800 border-slate-200',
        };
    }
}
