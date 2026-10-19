<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminAccount;
use App\Models\AppSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;

class SettingController extends Controller
{
    /**
     * Show campaign settings management view.
     */
    public function index(): View
    {
        $this->authorizeAdmin();

        $settings = [
            'quiz_questions' => AppSetting::getValue('quiz_questions', []),
            'quiz_results' => AppSetting::getValue('quiz_results', []),
            'testimonials' => AppSetting::getValue('testimonials', []),
            'why_first_capital' => AppSetting::getValue('why_first_capital', []),
            'investment_products' => AppSetting::getValue('investment_products', self::getDefaultInvestmentProducts()),
        ];

        return view('admin.settings.index', [
            'settings' => $settings,
            'allowedIps' => config('security.allowed_ips', []),
        ]);
    }

    /**
     * Update a campaign setting via visual form or raw JSON.
     */
    public function update(Request $request): RedirectResponse
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'setting_key' => ['required', 'string', 'in:' . implode(',', AppSetting::PUBLIC_KEYS)],
            'editor_mode' => ['nullable', 'string', 'in:visual,json'],
        ]);

        $key = $validated['setting_key'];
        if ($key === 'investment_options') {
            $key = 'investment_products';
        }
        $mode = $request->input('editor_mode', 'visual');

        if ($mode === 'visual') {
            $subAction = $request->input('sub_action');

            if ($key === 'quiz_questions') {
                if ($subAction === 'restore_defaults') {
                    $data = self::getDefaultQuestions();
                } elseif ($subAction === 'delete_question') {
                    $deleteId = (int)$request->input('delete_question_id');
                    $existing = AppSetting::getValue('quiz_questions', []);
                    $filtered = array_values(array_filter($existing, fn($q) => (int)($q['id'] ?? 0) !== $deleteId));
                    // Re-index questions 1..N
                    foreach ($filtered as $i => &$fq) {
                        $fq['id'] = $i + 1;
                    }
                    unset($fq);
                    $data = $filtered;
                } elseif ($subAction === 'save_single_question') {
                    $qId = (int)$request->input('question_id', 0);
                    $qPrompt = trim($request->input('question_prompt', ''));
                    $existing = AppSetting::getValue('quiz_questions', []);

                    $newOptions = [];
                    foreach (['A', 'B', 'C', 'D'] as $optKey) {
                        $newOptions[] = [
                            'key' => $optKey,
                            'label' => $optKey,
                            'text' => trim($request->input("option_{$optKey}_text", '')),
                            'weight' => strtoupper(trim($request->input("option_{$optKey}_weight", $optKey))),
                        ];
                    }

                    if ($qId > 0) {
                        // Update existing question
                        $found = false;
                        foreach ($existing as &$item) {
                            if ((int)($item['id'] ?? 0) === $qId) {
                                $item['question'] = $qPrompt;
                                $item['options'] = $newOptions;
                                $found = true;
                                break;
                            }
                        }
                        unset($item);
                        if (!$found) {
                            $existing[] = ['id' => $qId, 'question' => $qPrompt, 'options' => $newOptions];
                        }
                    } else {
                        // Append new question
                        $newId = count($existing) + 1;
                        $existing[] = ['id' => $newId, 'question' => $qPrompt, 'options' => $newOptions];
                    }
                    $data = array_values($existing);
                } else {
                    $rawQuestions = $request->input('questions', []);
                    $processed = [];
                    foreach ($rawQuestions as $idx => $qData) {
                        $id = (int)($qData['id'] ?? ($idx + 1));
                        $questionText = trim($qData['question'] ?? '');
                        if ($questionText === '') continue;

                        $options = [];
                        foreach (['A', 'B', 'C', 'D'] as $optKey) {
                            $optText = trim($qData['options'][$optKey]['text'] ?? '');
                            $optWeight = strtoupper(trim($qData['options'][$optKey]['weight'] ?? $optKey));
                            $options[] = [
                                'key' => $optKey,
                                'label' => $optKey,
                                'text' => $optText,
                                'weight' => $optWeight,
                            ];
                        }

                        $processed[] = [
                            'id' => $id,
                            'question' => $questionText,
                            'options' => $options,
                        ];
                    }
                    $data = $processed;
                }
            } elseif ($key === 'quiz_results') {
                $rawProfiles = $request->input('profiles', []);
                $processed = [];
                foreach (['A', 'B', 'C', 'D'] as $pKey) {
                    $pData = $rawProfiles[$pKey] ?? [];
                    if (empty($pData)) continue;

                    $processed[$pKey] = [
                        'key' => $pKey,
                        'number' => $pData['number'] ?? sprintf('%02d', ord($pKey) - 64),
                        'name' => trim($pData['name'] ?? ''),
                        'style' => trim($pData['style'] ?? ''),
                        'product' => trim($pData['product'] ?? ''),
                        'productShort' => trim($pData['productShort'] ?? ''),
                        'productOptionId' => trim($pData['productOptionId'] ?? 'unit-trust'),
                        'description' => trim($pData['description'] ?? ''),
                        'vibe' => trim($pData['vibe'] ?? ''),
                        'productDisclaimer' => trim($pData['productDisclaimer'] ?? ''),
                        'procedureGuide' => [
                            'label' => trim($pData['procedureGuide']['label'] ?? 'Procedure-Guide.pdf'),
                            'url' => trim($pData['procedureGuide']['url'] ?? ''),
                        ],
                    ];
                }
                $data = $processed;
            } elseif ($key === 'testimonials') {
                if ($subAction === 'delete_testimonial') {
                    $deleteId = trim($request->input('delete_testimonial_id', ''));
                    $existing = AppSetting::getValue('testimonials', []);
                    $data = array_values(array_filter($existing, fn($t) => ($t['id'] ?? '') !== $deleteId));
                } elseif ($subAction === 'toggle_testimonial_status') {
                    $tId = trim($request->input('testimonial_id', ''));
                    $existing = AppSetting::getValue('testimonials', []);
                    foreach ($existing as &$item) {
                        if (($item['id'] ?? '') === $tId) {
                            $isCurrentlyActive = ($item['status'] ?? 'Active') === 'Active' && (!isset($item['visible']) || $item['visible'] !== false);
                            $newStatus = $isCurrentlyActive ? 'Draft' : 'Active';
                            $item['status'] = $newStatus;
                            $item['visible'] = ($newStatus === 'Active');
                            break;
                        }
                    }
                    unset($item);
                    $data = array_values($existing);
                } elseif ($subAction === 'save_single_testimonial') {
                    $tId = trim($request->input('testimonial_id', '0'));
                    $name = trim($request->input('name', 'Investor'));
                    $role = trim($request->input('role', 'Client'));
                    $quote = trim($request->input('quote', ''));
                    $rating = max(1, min(5, (int)$request->input('rating', 5)));
                    $status = in_array($request->input('status'), ['Active', 'Draft'], true) ? $request->input('status') : 'Active';
                    $visible = ($status === 'Active');

                    $existing = AppSetting::getValue('testimonials', []);
                    $found = false;

                    if ($tId !== '' && $tId !== '0') {
                        foreach ($existing as &$item) {
                            if (($item['id'] ?? '') === $tId) {
                                $item['name'] = $name;
                                $item['role'] = $role;
                                $item['quote'] = $quote;
                                $item['rating'] = $rating;
                                $item['status'] = $status;
                                $item['visible'] = $visible;
                                if (!isset($item['createdAt'])) {
                                    $item['createdAt'] = now()->toIso8601String();
                                }
                                $found = true;
                                break;
                            }
                        }
                        unset($item);
                    }

                    if (!$found) {
                        $newId = ($tId !== '' && $tId !== '0') ? $tId : ('test-' . (count($existing) + 1));
                        $existing[] = [
                            'id' => $newId,
                            'name' => $name,
                            'role' => $role,
                            'quote' => $quote,
                            'rating' => $rating,
                            'status' => $status,
                            'visible' => $visible,
                            'createdAt' => now()->toIso8601String(),
                        ];
                    }

                    $data = array_values($existing);
                } else {
                    $rawTestimonials = $request->input('testimonials', []);
                    $processed = [];
                    foreach ($rawTestimonials as $idx => $tData) {
                        $quote = trim($tData['quote'] ?? '');
                        if ($quote === '') continue;
                        $status = in_array($tData['status'] ?? 'Active', ['Active', 'Draft'], true) ? $tData['status'] : 'Active';
                        $processed[] = [
                            'id' => $tData['id'] ?? ('test-' . ($idx + 1)),
                            'quote' => $quote,
                            'name' => trim($tData['name'] ?? 'Investor'),
                            'role' => trim($tData['role'] ?? 'Client'),
                            'rating' => max(1, min(5, (int)($tData['rating'] ?? 5))),
                            'status' => $status,
                            'visible' => ($status === 'Active'),
                            'createdAt' => $tData['createdAt'] ?? now()->toIso8601String(),
                        ];
                    }
                    $data = $processed;
                }
            } elseif ($key === 'why_first_capital') {
                $rawReasons = $request->input('reasons', []);
                $processed = [];
                foreach ($rawReasons as $idx => $rData) {
                    $title = trim($rData['title'] ?? '');
                    if ($title === '') continue;
                    $processed[] = [
                        'id' => $rData['id'] ?? ('reason-' . ($idx + 1)),
                        'icon' => trim($rData['icon'] ?? 'Sparkles'),
                        'title' => $title,
                        'copy' => trim($rData['copy'] ?? ''),
                        'visible' => !empty($rData['visible']),
                        'order' => (int)($rData['order'] ?? ($idx + 1)),
                    ];
                }
                $data = $processed;
            } elseif ($key === 'investment_products') {
                $rawProducts = $request->input('products', []);
                $existing = AppSetting::getValue('investment_products', self::getDefaultInvestmentProducts());
                $processed = [];
                foreach ($existing as $item) {
                    $pId = $item['id'];
                    $pData = $rawProducts[$pId] ?? [];
                    $processed[] = [
                        'id' => $pId,
                        'number' => $item['number'] ?? '01',
                        'title' => trim($pData['title'] ?? ($item['title'] ?? '')),
                        'shortCopy' => trim($pData['shortCopy'] ?? ($item['shortCopy'] ?? '')),
                        'tags' => isset($pData['tags']) 
                            ? (is_array($pData['tags']) ? $pData['tags'] : array_values(array_filter(array_map('trim', explode(',', (string)$pData['tags'])))))
                            : ($item['tags'] ?? []),
                        'video' => [
                            'title' => trim($pData['video']['title'] ?? ($item['video']['title'] ?? '')),
                            'url' => trim($pData['video']['url'] ?? ($item['video']['url'] ?? '')),
                            'platform' => trim($pData['video']['platform'] ?? ($item['video']['platform'] ?? 'YouTube')),
                        ],
                        'disclaimer' => trim($pData['disclaimer'] ?? ($item['disclaimer'] ?? '')),
                        'guideUrl' => trim($pData['guideUrl'] ?? ($item['guideUrl'] ?? '')),
                        'guideLabel' => trim($pData['guideLabel'] ?? ($item['guideLabel'] ?? '')),
                    ];
                }
                $data = $processed;
            } else {
                $data = $request->input('data', []);
            }
        } else {
            // Raw JSON mode
            $jsonStr = $request->input('setting_value', '');
            $data = json_decode($jsonStr, true);
            if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
                return back()->withInput()->with('error', 'Invalid JSON syntax in setting value: ' . json_last_error_msg());
            }
        }

        // Security check: ensure URL attributes do not contain javascript: schemes
        if (!$this->validateUrlsAreSafe($data)) {
            return back()->withInput()->with('error', 'Security Violation: URLs must begin with http:// or https://.');
        }

        AppSetting::setValue($key, $data);

        $activeTab = $request->input('active_tab', $key);
        return redirect()->route('admin.settings.index', ['tab' => $activeTab])
            ->with('success', "Campaign setting [{$key}] updated successfully.");
    }

    /**
     * System diagnostic dashboard for server, database, proxy, and IP health.
     */
    public function systemInfo(Request $request): View
    {
        $this->authorizeAdmin();

        $dbStatus = 'Connected';
        $dbDriver = config('database.default');
        try {
            DB::connection()->getPdo();
        } catch (\Throwable $e) {
            $dbStatus = 'Failed: ' . $e->getMessage();
        }

        $detectedIp = app(\App\Http\Middleware\RestrictIpAddress::class)->resolveClientIp($request);
        $incapHeader = $request->server('HTTP_INCAP_CLIENT_IP') ?: 'Not detected (Direct or non-Imperva request)';
        $cfHeader = $request->server('HTTP_CF_CONNECTING_IP') ?: 'Not detected';
        $forwardedHeader = $request->server('HTTP_X_FORWARDED_FOR') ?: 'Not detected';

        return view('admin.settings.system', [
            'phpVersion' => PHP_VERSION,
            'laravelVersion' => app()->version(),
            'dbStatus' => $dbStatus,
            'dbDriver' => $dbDriver,
            'detectedIp' => $detectedIp,
            'incapHeader' => $incapHeader,
            'cfHeader' => $cfHeader,
            'forwardedHeader' => $forwardedHeader,
            'allowedIps' => config('security.allowed_ips', []),
            'serverSoftware' => $request->server('SERVER_SOFTWARE', 'Unknown'),
        ]);
    }

    protected function authorizeAdmin(): void
    {
        $user = Auth::user();
        if (!$user instanceof AdminAccount || !$user->canEditSettings()) {
            abort(403, 'Super Admin privileges required to edit campaign settings.');
        }
    }

    protected function validateUrlsAreSafe(mixed $value, string $parentKey = ''): bool
    {
        if (is_array($value)) {
            foreach ($value as $k => $v) {
                if (!$this->validateUrlsAreSafe($v, is_string($k) ? $k : $parentKey)) {
                    return false;
                }
            }
            return true;
        }

        if (is_string($value) && preg_match('/(^url$|url$|^href$|^link$)/i', $parentKey) && trim($value) !== '') {
            return (bool)preg_match('#^https?://#i', trim($value));
        }

        return true;
    }

    public static function getDefaultQuestions(): array
    {
        return [
            [
                'id' => 1,
                'question' => "You have some extra money sitting in your account. What’s your first thought?",
                'options' => [
                    ['key' => 'A', 'label' => 'A', 'text' => "I’d keep it invested, but I want to be able to access it anytime", 'weight' => 'A'],
                    ['key' => 'B', 'label' => 'B', 'text' => "I’m happy to leave it invested for a few months if I can earn a return.", 'weight' => 'B'],
                    ['key' => 'C', 'label' => 'C', 'text' => "I’m comfortable leaving it invested for longer if there is a potential for long-term growth.", 'weight' => 'C'],
                    ['key' => 'D', 'label' => 'D', 'text' => "I’d rather invest for the potential of higher long-term growth", 'weight' => 'D']
                ]
            ],
            [
                'id' => 2,
                'question' => "How long can you comfortably leave your money invested?",
                'options' => [
                    ['key' => 'A', 'label' => 'A', 'text' => "1 - 6 months", 'weight' => 'A'],
                    ['key' => 'B', 'label' => 'B', 'text' => "6 months – 1 year", 'weight' => 'B'],
                    ['key' => 'C', 'label' => 'C', 'text' => "1–2 years", 'weight' => 'C'],
                    ['key' => 'D', 'label' => 'D', 'text' => "More than 2 years", 'weight' => 'D']
                ]
            ],
            [
                'id' => 3,
                'question' => "Interest rates in the market move up and down frequently. What is your reaction?",
                'options' => [
                    ['key' => 'A', 'label' => 'A', 'text' => "I’d probably want to take my money out.", 'weight' => 'A'],
                    ['key' => 'B', 'label' => 'B', 'text' => "A little movement is fine, but I prefer stability.", 'weight' => 'B'],
                    ['key' => 'C', 'label' => 'C', 'text' => "I can handle some ups and downs if I have a longer-term plan.", 'weight' => 'C'],
                    ['key' => 'D', 'label' => 'D', 'text' => "I’m comfortable with bigger ups and downs for the chance of higher growth.", 'weight' => 'D']
                ]
            ],
            [
                'id' => 4,
                'question' => "What is your priority for investing right now?",
                'options' => [
                    ['key' => 'A', 'label' => 'A', 'text' => "A financial safety net", 'weight' => 'A'],
                    ['key' => 'B', 'label' => 'B', 'text' => "A goal coming up in the next year or so", 'weight' => 'B'],
                    ['key' => 'C', 'label' => 'C', 'text' => "A bigger milestone in the next few years", 'weight' => 'C'],
                    ['key' => 'D', 'label' => 'D', 'text' => "Long-term wealth and financial freedom", 'weight' => 'D']
                ]
            ],
            [
                'id' => 5,
                'question' => "What would you say is your pattern for investing?",
                'options' => [
                    ['key' => 'A', 'label' => 'A', 'text' => "Setting aside an amount every month", 'weight' => 'A'],
                    ['key' => 'B', 'label' => 'B', 'text' => "Investing when I have some extra money", 'weight' => 'B'],
                    ['key' => 'C', 'label' => 'C', 'text' => "Investing a large amount at once and letting it work", 'weight' => 'C'],
                    ['key' => 'D', 'label' => 'D', 'text' => "Investing when I spot an opportunity I believe in", 'weight' => 'D']
                ]
            ],
            [
                'id' => 6,
                'question' => "Imagine you have LKR 500,000 ready to invest. Which sounds like you?",
                'options' => [
                    ['key' => 'A', 'label' => 'A', 'text' => "Keep it flexible and invest for the short term.", 'weight' => 'A'],
                    ['key' => 'B', 'label' => 'B', 'text' => "Aim for a relatively stable return while keeping access to my money.", 'weight' => 'B'],
                    ['key' => 'C', 'label' => 'C', 'text' => "Lock it into a longer-term government investment and earn regular interest.", 'weight' => 'C'],
                    ['key' => 'D', 'label' => 'D', 'text' => "Invest in shares and stay invested for long-term growth.", 'weight' => 'D']
                ]
            ],
            [
                'id' => 7,
                'question' => "Which statement sounds most like you?",
                'options' => [
                    ['key' => 'A', 'label' => 'A', 'text' => "“I like knowing my money is there when I need it.”", 'weight' => 'A'],
                    ['key' => 'B', 'label' => 'B', 'text' => "“I want my money to grow, without taking on too much risk.”", 'weight' => 'B'],
                    ['key' => 'C', 'label' => 'C', 'text' => "“I’m happy to wait if it means building my money for the potential of long-term growth.”", 'weight' => 'C'],
                    ['key' => 'D', 'label' => 'D', 'text' => "“I’m playing the long game when it comes to my wealth.”", 'weight' => 'D']
                ]
            ]
        ];
    }

    public static function getDefaultInvestmentProducts(): array
    {
        return [
            [
                'id' => 'unit-trust',
                'number' => '01',
                'title' => 'Unit Trust Funds',
                'shortCopy' => 'A Unit Trust Fund pools money from multiple investors into a single fund. This money is professionally managed and invested in a range of investments based on the fund’s investment objective. When you invest, you receive units in the fund based on the amount you invest. You can choose from three Unit Trust Funds.',
                'tags' => ['3 Fund Choices', 'From LKR 1,000', 'High Liquidity'],
                'video' => [
                    'title' => 'Learn more about Unit Trust Funds',
                    'url' => 'https://www.tiktok.com/@first.capital/video/7593165117668265223',
                    'platform' => 'TikTok',
                ],
                'disclaimer' => '*Disclaimers: Past performance is not an indicator of future performance | Investors are advised to read and understand the contents of Key Investor Information Document (KIID) | The fund is approved by the Securities and Exchange Commission of Sri Lanka (SEC)',
                'guideUrl' => 'https://firstcapital.lk/wp-content/uploads/2026/02/FCAM-UT-Procedure-Guide-to-Investors.pdf',
                'guideLabel' => 'FCAM-UT-Procedure-Guide-to-Investors.pdf',
            ],
            [
                'id' => 'gov-securities',
                'number' => '02',
                'title' => 'Government Securities',
                'shortCopy' => 'Government securities are instrument issued by the Government of Sri Lanka to raise money. When you invest, you lend your money to the government for a defined period. In return, you receive interest periodically, with the original investment paid back at maturity.',
                'tags' => ['Government-issued', 'Regular interest', 'Defined maturity', 'Risk-free instrument'],
                'video' => [
                    'title' => 'Government Securities explained',
                    'url' => 'https://www.youtube.com/watch?v=LZoAwRqGr9M&t=20s',
                    'platform' => 'YouTube',
                ],
                'disclaimer' => '*Disclaimer: Terms & Conditions apply | Please refer to the Procedure Guide related Treasuries/Government Securities to understand our internal procedures related to products and transactions.',
                'guideUrl' => 'https://firstcapital.lk/wp-content/uploads/2026/07/Information-Memorandum-FCT.pdf',
                'guideLabel' => 'Information-Memorandum-FCT.pdf',
            ],
            [
                'id' => 'equities',
                'number' => '03',
                'title' => 'Equities',
                'shortCopy' => 'It simply means investing in shares of listed companies. When you buy shares, you own a % of the company. The value of your investment can rise or fall based on the company’s performance and market conditions.',
                'tags' => ['Long-term growth potential', 'Own listed shares', 'Market participation'],
                'video' => [
                    'title' => 'How do equities work?',
                    'url' => 'https://www.youtube.com/shorts/HGL82Tv1wJE',
                    'platform' => 'YouTube',
                ],
                'disclaimer' => '*Disclaimer: Equity investments are subject to market risk | Please refer to the Procedure Guide related to Equities to understand our internal procedures related to products and transactions.',
                'guideUrl' => 'https://firstcapital.lk/wp-content/uploads/2026/09/FCE-procedure-guide_.pdf',
                'guideLabel' => 'FCE-procedure-guide_.pdf',
            ],
        ];
    }
}
