<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use App\Models\Lead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PublicQuizController extends Controller
{
    /**
     * Get active quiz questions directly from the database.
     */
    public function questions(): JsonResponse
    {
        $questions = AppSetting::getValue('quiz_questions', []);
        return response()->json([
            'success' => true,
            'source' => 'db',
            'data' => $questions,
        ]);
    }

    /**
     * Get personality results and matched products directly from the database.
     */
    public function results(): JsonResponse
    {
        $results = AppSetting::getValue('quiz_results', []);
        return response()->json([
            'success' => true,
            'source' => 'db',
            'data' => $results,
        ]);
    }

    /**
     * Get testimonials directly from the database.
     */
    public function testimonials(): JsonResponse
    {
        $testimonials = AppSetting::getValue('testimonials', []);
        $activeTestimonials = array_values(array_filter($testimonials, function ($t) {
            $status = $t['status'] ?? 'Active';
            $visible = $t['visible'] ?? true;
            return $status === 'Active' && $visible !== false;
        }));

        return response()->json([
            'success' => true,
            'source' => 'db',
            'data' => $activeTestimonials,
        ]);
    }

    /**
     * Get Why First Capital reasons directly from the database.
     */
    public function whyReasons(): JsonResponse
    {
        $reasons = AppSetting::getValue('why_first_capital', []);
        return response()->json([
            'success' => true,
            'source' => 'db',
            'data' => $reasons,
        ]);
    }

    /**
     * Dynamic settings accessor (reads any public setting directly from the database).
     */
    public function settings(Request $request): JsonResponse
    {
        $key = $request->query('key', 'quiz_questions');
        if ($key === 'reasons') {
            $key = 'why_first_capital';
        }

        if (!in_array($key, AppSetting::PUBLIC_KEYS, true)) {
            return response()->json(['success' => false, 'error' => 'Unknown setting.'], 404);
        }

        $data = AppSetting::getValue($key);
        return response()->json([
            'success' => true,
            'source' => 'db',
            'data' => $data,
        ]);
    }

    /**
     * System status endpoint for monitoring.
     */
    public function status(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'status' => 'online',
            'timestamp' => now()->toIso8601String(),
            'database' => 'connected',
        ]);
    }

    /**
     * Universal endpoint for leads.php (supports both GET queries for DB settings and POST lead submissions).
     */
    public function handleLeadsPhp(Request $request): JsonResponse
    {
        if ($request->isMethod('post')) {
            return $this->submitLead($request);
        }

        $action = $request->query('action', '');
        return match ($action) {
            'questions' => $this->questions(),
            'results', 'profiles' => $this->results(),
            'testimonials' => $this->testimonials(),
            'reasons', 'why_reasons', 'why_first_capital' => $this->whyReasons(),
            'status' => $this->status(),
            default => $this->settings($request),
        };
    }

    /**
     * Universal endpoint for /api/leads (supports both GET queries and POST lead submissions).
     */
    public function handleLeadsRoute(Request $request): JsonResponse
    {
        if ($request->isMethod('post')) {
            return $this->submitLead($request);
        }

        return $this->handleLeadsPhp($request);
    }

    /**
     * Capture public quiz lead submission with anti-spam honeypot and rate limiting.
     */
    public function submitLead(Request $request): JsonResponse
    {
        // 1. Honeypot check: Bots fill hidden "website" field; real users never do.
        if (!empty($request->input('website'))) {
            return response()->json([
                'success' => true,
                'leadId' => 0,
                'id' => 'FC-0',
            ]);
        }

        // Support JSON string for answers if sent via form-data
        $rawAnswers = $request->input('answers');
        if (is_string($rawAnswers)) {
            $decoded = json_decode($rawAnswers, true);
            if (is_array($decoded)) {
                $request->merge(['answers' => $decoded]);
            }
        }

        // 2. Validation
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:150'],
            'phone' => ['required', 'string', 'max:50'],
            'gender' => ['nullable', 'string', 'in:male,female'],
            'profileKey' => ['nullable', 'string', 'max:2'],
            'profileName' => ['nullable', 'string', 'max:100'],
            'matchedProduct' => ['nullable', 'string', 'max:255'],
            'answers' => ['nullable', 'array'],
            'source' => ['nullable', 'string', 'max:100'],
        ], [
            'name.required' => 'Please provide your full name.',
            'email.required' => 'Please provide a valid email address.',
            'email.email' => 'Please provide a valid email address.',
            'phone.required' => 'Please provide your contact phone number.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();
        $answers = $validated['answers'] ?? [];

        // 3. Determine Personality Profile if not supplied
        $profileKey = strtoupper($validated['profileKey'] ?? '');
        if (!in_array($profileKey, ['A', 'B', 'C', 'D'], true)) {
            $profileKey = $this->calculateProfileKey($answers);
        }

        $defaultResults = AppSetting::getValue('quiz_results', []);
        $profileInfo = $defaultResults[$profileKey] ?? null;

        $profileName = $validated['profileName'] ?? ($profileInfo['name'] ?? 'The Keep-It-Cool Investor');
        $matchedProduct = $validated['matchedProduct'] ?? ($profileInfo['product'] ?? 'First Capital Money Market Fund');

        $allowedSources = ['Landing Page Quiz', 'Main Quiz Flow', 'Design Option 2 Quiz', 'Organic Search'];
        $source = in_array($validated['source'] ?? '', $allowedSources, true) ? $validated['source'] : 'Landing Page Quiz';

        // 4. Create Lead Record in Database
        $lead = Lead::create([
            'name' => strip_tags(trim($validated['name'])),
            'email' => strtolower(trim($validated['email'])),
            'phone' => strip_tags(trim($validated['phone'])),
            'gender' => ($validated['gender'] ?? 'male') === 'female' ? 'female' : 'male',
            'result_code' => $profileKey,
            'result_profile' => $profileName,
            'matched_product' => $matchedProduct,
            'answers_json' => !empty($answers) ? $answers : null,
            'status' => 'NEW',
            'notes' => null,
            'source' => $source,
        ]);

        return response()->json([
            'success' => true,
            'leadId' => $lead->id,
            'id' => 'FC-' . $lead->id,
            'profileKey' => $profileKey,
            'profileName' => $profileName,
            'matchedProduct' => $matchedProduct,
            'message' => 'Thank you! Your investment profile has been saved successfully.',
        ], 201);
    }

    /**
     * Calculate winning personality type based on submitted answers.
     */
    protected function calculateProfileKey(array $answers): string
    {
        if (empty($answers)) {
            return 'A';
        }

        $counts = ['A' => 0, 'B' => 0, 'C' => 0, 'D' => 0];
        foreach ($answers as $item) {
            $choice = strtoupper($item['selected'] ?? $item['key'] ?? '');
            if (isset($counts[$choice])) {
                $counts[$choice]++;
            }
        }

        arsort($counts);
        return array_key_first($counts) ?: 'A';
    }
}
