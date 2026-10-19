<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppSetting extends Model
{
    protected $table = 'app_settings';
    protected $primaryKey = 'setting_key';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'setting_key',
        'setting_value',
    ];

    public const PUBLIC_KEYS = [
        'quiz_questions',
        'quiz_results',
        'testimonials',
        'why_first_capital',
        'investment_products',
        'investment_options',
    ];

    public static function getValue(string $key, mixed $default = null): mixed
    {
        $lookupKey = ($key === 'investment_options') ? 'investment_products' : $key;
        $record = static::find($lookupKey) ?: static::find($key);
        if (!$record) {
            return $default;
        }

        $decoded = json_decode($record->setting_value, true);
        return (json_last_error() === JSON_ERROR_NONE) ? $decoded : $record->setting_value;
    }

    public static function setValue(string $key, mixed $value): static
    {
        $encoded = is_string($value) ? $value : json_encode($value, JSON_UNESCAPED_UNICODE);
        return static::updateOrCreate(
            ['setting_key' => $key],
            ['setting_value' => $encoded]
        );
    }

    public static function getPublicSettings(): array
    {
        $settings = [];
        $records = static::whereIn('setting_key', self::PUBLIC_KEYS)->get();
        foreach ($records as $record) {
            $decoded = json_decode($record->setting_value, true);
            $settings[$record->setting_key] = (json_last_error() === JSON_ERROR_NONE) ? $decoded : $record->setting_value;
        }
        return $settings;
    }
}
