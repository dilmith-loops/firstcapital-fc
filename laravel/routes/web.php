<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\LeadController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes (First Capital Investor Week)
|--------------------------------------------------------------------------
| Target deployment: https://firstcapital.lk/begininvesting
|
| 1. Public Campaign Pages: 100% accessible to anyone (0.0.0.0/0).
| 2. Admin Portal (/admin): Fully protected by RestrictIpAddress middleware,
|    server-rendered Blade templates, session authentication, and CSRF tokens.
*/

// =========================================================================
// 1. PUBLIC CAMPAIGN ROUTES
// =========================================================================

Route::get('/', function () {
    $indexPath = public_path('index.html');
    if (File::exists($indexPath)) {
        return response()->file($indexPath, [
            'Content-Type' => 'text/html; charset=utf-8',
            'X-Frame-Options' => 'SAMEORIGIN',
        ]);
    }
    return view('welcome');
})->name('campaign.home');

Route::get('/design-option-2', function () {
    $path = public_path('design-option-2/index.html');
    if (File::exists($path)) {
        return response()->file($path, [
            'Content-Type' => 'text/html; charset=utf-8',
            'X-Frame-Options' => 'SAMEORIGIN',
        ]);
    }
    abort(404);
})->name('campaign.option2');

// Personality Share Pages
Route::get('/{card}.html', function (string $card) {
    $allowedCards = [
        'keep-it-cool', 'keep-it-cool-male', 'keep-it-cool-female',
        'smooth-operator', 'smooth-operator-male', 'smooth-operator-female',
        'patient-player', 'patient-player-male', 'patient-player-female',
        'opportunity-hunter', 'opportunity-hunter-male', 'opportunity-hunter-female',
    ];

    if (in_array($card, $allowedCards, true)) {
        $path = public_path("{$card}.html");
        if (File::exists($path)) {
            return response()->file($path, ['Content-Type' => 'text/html; charset=utf-8']);
        }
    }
    abort(404);
})->where('card', '[a-zA-Z0-9\-_]+');

Route::get('/{card}', function (string $card) {
    $allowedCards = [
        'keep-it-cool', 'keep-it-cool-male', 'keep-it-cool-female',
        'smooth-operator', 'smooth-operator-male', 'smooth-operator-female',
        'patient-player', 'patient-player-male', 'patient-player-female',
        'opportunity-hunter', 'opportunity-hunter-male', 'opportunity-hunter-female',
    ];

    if (in_array($card, $allowedCards, true)) {
        $path = public_path("{$card}.html");
        if (File::exists($path)) {
            return response()->file($path, ['Content-Type' => 'text/html; charset=utf-8']);
        }
    }
    abort(404);
})->where('card', 'keep-it-cool.*|smooth-operator.*|patient-player.*|opportunity-hunter.*');

Route::get('/begininvesting/{path}', function (string $path) {
    if (str_starts_with($path, 'api/')) {
        return app()->make(\App\Http\Controllers\Api\PublicQuizController::class)->handleLeadsPhp(request());
    }
    $filePath = public_path($path);
    if (File::exists($filePath)) {
        return response()->file($filePath);
    }
    abort(404);
})->where('path', '.*');

// Web aliases for DB-backed API endpoints
Route::match(['get', 'post'], '/api/leads.php', [\App\Http\Controllers\Api\PublicQuizController::class, 'handleLeadsPhp']);
Route::match(['get', 'post'], '/begininvesting/api/leads.php', [\App\Http\Controllers\Api\PublicQuizController::class, 'handleLeadsPhp']);
Route::match(['get', 'post'], '/fc/api/leads.php', [\App\Http\Controllers\Api\PublicQuizController::class, 'handleLeadsPhp']);
Route::get('/api/questions', [\App\Http\Controllers\Api\PublicQuizController::class, 'questions']);
Route::get('/api/testimonials', [\App\Http\Controllers\Api\PublicQuizController::class, 'testimonials']);
Route::get('/api/reasons', [\App\Http\Controllers\Api\PublicQuizController::class, 'whyReasons']);
Route::get('/api/results', [\App\Http\Controllers\Api\PublicQuizController::class, 'results']);
Route::get('/api/settings', [\App\Http\Controllers\Api\PublicQuizController::class, 'settings']);
Route::get('/api/admin/settings', [\App\Http\Controllers\Api\PublicQuizController::class, 'settings']);


Route::redirect('/login', '/admin/login')->name('login');

// =========================================================================
// 2. ADMIN PORTAL (Guarded by IP Whitelist Middleware)
// =========================================================================

Route::prefix('admin')->middleware(['web', 'restrict.ip'])->name('admin.')->group(function () {
    // Guest Admin Authentication
    Route::middleware('guest:admin')->group(function () {
        Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
        Route::post('/login', [AuthController::class, 'login'])
            ->middleware('throttle:admin-login')
            ->name('login.submit');

        Route::get('/setup', [AuthController::class, 'showSetup'])->name('setup');
        Route::post('/setup', [AuthController::class, 'setup'])->name('setup.submit');
    });

    // Authenticated Admin Operations
    Route::middleware('auth:admin')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

        // Dashboard & Leads Management
        Route::get('/', function () {
            return redirect()->route('admin.leads.index');
        });
        Route::get('/leads', [LeadController::class, 'index'])->name('leads.index');
        Route::post('/leads', [LeadController::class, 'store'])->name('leads.store');
        Route::get('/leads/{lead}', [LeadController::class, 'show'])->name('leads.show');
        Route::post('/leads/{lead}', [LeadController::class, 'update'])->name('leads.update');
        Route::delete('/leads/{lead}', [LeadController::class, 'destroy'])->name('leads.destroy');
        Route::get('/export/csv', [LeadController::class, 'exportCsv'])->name('leads.export');

        // User Accounts Management (Super Admin only)
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

        // Campaign Settings & System Diagnostics (Super Admin only)
        Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
        Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');
        Route::get('/system', [SettingController::class, 'systemInfo'])->name('settings.system');

        // Profile Management (Accessible to any authenticated admin)
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile');
        Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    });
});
