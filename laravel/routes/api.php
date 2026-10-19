<?php

use App\Http\Controllers\Api\PublicQuizController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API Routes (First Capital Investor Week)
|--------------------------------------------------------------------------
| 100% database-driven endpoints for questions, answer choices, testimonials,
| personality outcomes, and why-first-capital differentiators.
| Protected by Honeypot, dynamic sanitization, and IP rate limiting.
*/

// Public Quiz Content & Settings Endpoints (Direct Database Queries)
Route::get('/questions', [PublicQuizController::class, 'questions']);
Route::get('/quiz/questions', [PublicQuizController::class, 'questions']);
Route::get('/results', [PublicQuizController::class, 'results']);
Route::get('/quiz/results', [PublicQuizController::class, 'results']);
Route::get('/profiles', [PublicQuizController::class, 'results']);
Route::get('/testimonials', [PublicQuizController::class, 'testimonials']);
Route::get('/reasons', [PublicQuizController::class, 'whyReasons']);
Route::get('/why_first_capital', [PublicQuizController::class, 'whyReasons']);
Route::get('/settings', [PublicQuizController::class, 'settings']);
Route::get('/admin/settings', [PublicQuizController::class, 'settings']);
Route::get('/admin/status', [PublicQuizController::class, 'status']);

// Public Lead Capture & Universal API Compatibility (supports both GET DB settings & POST lead)
Route::match(['get', 'post'], '/leads.php', [PublicQuizController::class, 'handleLeadsPhp'])->middleware('throttle:quiz-submission');
Route::match(['get', 'post'], '/leads', [PublicQuizController::class, 'handleLeadsRoute'])->middleware('throttle:quiz-submission');
Route::match(['get', 'post'], '/begininvesting/api/leads.php', [PublicQuizController::class, 'handleLeadsPhp'])->middleware('throttle:quiz-submission');
Route::match(['get', 'post'], '/fc/api/leads.php', [PublicQuizController::class, 'handleLeadsPhp'])->middleware('throttle:quiz-submission');
