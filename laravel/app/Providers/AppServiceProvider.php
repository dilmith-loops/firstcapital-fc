<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('quiz-submission', function (Request $request) {
            return Limit::perHour(15)->by($request->ip());
        });

        RateLimiter::for('admin-login', function (Request $request) {
            return Limit::perMinutes(15, 6)->by($request->ip());
        });

        view()->composer('layouts.admin', function ($view) {
            $totalLeads = \Illuminate\Support\Facades\Schema::hasTable('quiz_leads') ? \App\Models\Lead::count() : 0;
            $questions = \Illuminate\Support\Facades\Schema::hasTable('app_settings') ? \App\Models\AppSetting::getValue('quiz_questions', []) : [];
            $testimonials = \Illuminate\Support\Facades\Schema::hasTable('app_settings') ? \App\Models\AppSetting::getValue('testimonials', []) : [];
            $reasons = \Illuminate\Support\Facades\Schema::hasTable('app_settings') ? \App\Models\AppSetting::getValue('why_first_capital', []) : [];
            $adminCount = \Illuminate\Support\Facades\Schema::hasTable('admin_accounts') ? \App\Models\AdminAccount::count() : 0;

            $view->with([
                'sidebarTotalLeads' => $totalLeads,
                'sidebarQuestionsCount' => is_array($questions) ? count($questions) : 7,
                'sidebarTestimonialsCount' => is_array($testimonials) ? count($testimonials) : 4,
                'sidebarReasonsCount' => is_array($reasons) ? count($reasons) : 4,
                'sidebarAdminCount' => $adminCount,
            ]);
        });
    }
}
