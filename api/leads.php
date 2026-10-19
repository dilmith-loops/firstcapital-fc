<?php
// Quiz leads + site content API.
//
// Public:  GET settings for PUBLIC_SETTING_KEYS (questions, results, testimonials, reasons, products)
//          POST a quiz lead (honeypot + per-IP rate limit; admin-only fields ignored)
// Admin:   everything else (lead list/update/delete/manual create, settings writes, status)
//          requires a server-side admin session from api/auth.php.

require_once __DIR__ . '/security.php';

sendSecurityHeaders();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Auto-detect action from REQUEST_URI if rewritten
$uri = $_SERVER['REQUEST_URI'] ?? '';
if (strpos($uri, '/api/admin/status') !== false) {
    $action = 'status';
} elseif (strpos($uri, '/api/admin/settings') !== false || strpos($uri, '/api/settings') !== false) {
    $action = 'settings';
} elseif (strpos($uri, '/api/questions') !== false || strpos($uri, '/api/quiz/questions') !== false) {
    $action = 'questions';
} elseif (strpos($uri, '/api/testimonials') !== false) {
    $action = 'testimonials';
} elseif (strpos($uri, '/api/results') !== false || strpos($uri, '/api/quiz/results') !== false || strpos($uri, '/api/profiles') !== false) {
    $action = 'results';
} elseif (strpos($uri, '/api/admin/leads/update') !== false) {
    $action = 'update';
} elseif (strpos($uri, '/api/admin/leads/delete') !== false) {
    $action = 'delete';
} elseif (strpos($uri, '/api/admin/leads/create') !== false) {
    $action = 'admin_create';
} elseif (strpos($uri, '/api/admin/leads') !== false && $method === 'GET') {
    $action = 'leads';
}

function cleanString($str, $maxLen = 255) {
    if (!is_string($str)) return '';
    $clean = strip_tags(trim($str));
    return mb_substr($clean, 0, $maxLen, 'UTF-8');
}

function parseLeadId($val) {
    if (is_numeric($val)) {
        return (int)$val;
    }
    if (is_string($val)) {
        $digits = preg_replace('/[^0-9]/', '', $val);
        if ($digits !== '') {
            return (int)$digits;
        }
    }
    return 0;
}

function getDefaultQuizQuestions() {
    return [
        [
            'id' => 1,
            'question' => "You have some extra money sitting in your account. What’s your first thought?",
            'options' => [
                ['key' => 'A', 'label' => 'A', 'text' => "I’d keep it somewhere safe, but I want to be able to access it anytime."],
                ['key' => 'B', 'label' => 'B', 'text' => "I’m happy to leave it invested for a few months if I can earn a return."],
                ['key' => 'C', 'label' => 'C', 'text' => "I’m comfortable leaving it invested for longer if it can grow steadily."],
                ['key' => 'D', 'label' => 'D', 'text' => "I’d rather invest for the potential of higher long-term growth"]
            ]
        ],
        [
            'id' => 2,
            'question' => "How long can you comfortably leave your money invested?",
            'options' => [
                ['key' => 'A', 'label' => 'A', 'text' => "1 - 6 months"],
                ['key' => 'B', 'label' => 'B', 'text' => "6 months – 1 year"],
                ['key' => 'C', 'label' => 'C', 'text' => "1–2 years"],
                ['key' => 'D', 'label' => 'D', 'text' => "More than 2 years"]
            ]
        ],
        [
            'id' => 3,
            'question' => "Interest rates in the market move up and down frequently. What is your reaction?",
            'options' => [
                ['key' => 'A', 'label' => 'A', 'text' => "I’d probably want to take my money out."],
                ['key' => 'B', 'label' => 'B', 'text' => "A little movement is fine, but I prefer stability."],
                ['key' => 'C', 'label' => 'C', 'text' => "I can handle some ups and downs if I have a longer-term plan."],
                ['key' => 'D', 'label' => 'D', 'text' => "I’m comfortable with bigger ups and downs for the chance of higher growth."]
            ]
        ],
        [
            'id' => 4,
            'question' => "What is your priority for investing right now?",
            'options' => [
                ['key' => 'A', 'label' => 'A', 'text' => "A financial safety net"],
                ['key' => 'B', 'label' => 'B', 'text' => "A goal coming up in the next year or so"],
                ['key' => 'C', 'label' => 'C', 'text' => "A bigger milestone in the next few years"],
                ['key' => 'D', 'label' => 'D', 'text' => "Long-term wealth and financial freedom"]
            ]
        ],
        [
            'id' => 5,
            'question' => "What would you say is your pattern for investing?",
            'options' => [
                ['key' => 'A', 'label' => 'A', 'text' => "Setting aside an amount every month"],
                ['key' => 'B', 'label' => 'B', 'text' => "Investing when I have some extra money"],
                ['key' => 'C', 'label' => 'C', 'text' => "Investing a large amount at once and letting it work"],
                ['key' => 'D', 'label' => 'D', 'text' => "Investing when I spot an opportunity I believe in"]
            ]
        ],
        [
            'id' => 6,
            'question' => "Imagine you have LKR 500,000 ready to invest. Which sounds like you?",
            'options' => [
                ['key' => 'A', 'label' => 'A', 'text' => "Keep it flexible and invest for the short term."],
                ['key' => 'B', 'label' => 'B', 'text' => "Aim for a relatively stable return while keeping access to my money."],
                ['key' => 'C', 'label' => 'C', 'text' => "Lock it into a longer-term government investment and earn regular interest."],
                ['key' => 'D', 'label' => 'D', 'text' => "Invest in shares and stay invested for long-term growth."]
            ]
        ],
        [
            'id' => 7,
            'question' => "Which statement sounds most like you?",
            'options' => [
                ['key' => 'A', 'label' => 'A', 'text' => "“I like knowing my money is there when I need it.”"],
                ['key' => 'B', 'label' => 'B', 'text' => "“I want my money to grow, without taking on too much risk.”"],
                ['key' => 'C', 'label' => 'C', 'text' => "“I’m happy to wait if it means building my money for the potential of long-term growth.”"],
                ['key' => 'D', 'label' => 'D', 'text' => "“I’m playing the long game when it comes to my wealth.”"]
            ]
        ]
    ];
}

function getDefaultTestimonials() {
    return [
        [
            'id' => 'test-1',
            'quote' => 'I started with just LKR 1,000, mostly to see what would happen. A year later, investing is simply part of my monthly routine.',
            'name' => 'Dinuka P.',
            'role' => 'First-time investor',
            'rating' => 5,
            'status' => 'Active',
            'createdAt' => date('c')
        ],
        [
            'id' => 'test-2',
            'quote' => 'Everything was explained in plain language. I never felt like I needed a finance degree to take the first step.',
            'name' => 'Shanika F.',
            'role' => 'Young professional',
            'rating' => 5,
            'status' => 'Active',
            'createdAt' => date('c')
        ],
        [
            'id' => 'test-3',
            'quote' => 'Knowing I can get to my money when I need it made starting far less intimidating. That flexibility is why I began at all.',
            'name' => 'Aravinda P.',
            'role' => 'Saver turned investor',
            'rating' => 5,
            'status' => 'Active',
            'createdAt' => date('c')
        ],
        [
            'id' => 'test-4',
            'quote' => 'It helps knowing the people managing your money have been doing this for over forty years. I just stay consistent and let it grow.',
            'name' => 'Malsha S.',
            'role' => 'Long-term investor',
            'rating' => 5,
            'status' => 'Active',
            'createdAt' => date('c')
        ]
    ];
}

function getDefaultQuizResults() {
    return [
        'A' => [
            'key' => 'A',
            'number' => '01',
            'name' => 'The Keep-It-Cool Investor',
            'style' => 'Flexible & Agile',
            'product' => 'First Capital Money Market Fund (FCMMF)*',
            'productShort' => 'First Capital Money Market Fund (FCMMF)*',
            'productOptionId' => 'unit-trust',
            'description' => 'You like keeping things simple, flexible and within your comfort zone. You want your money to work, but you also like knowing you can access it when you need it.',
            'vibe' => 'Keep calm. Keep flexible.',
            'productDisclaimer' => '* Disclaimers: Past performance is not an indicator of future performance | Investors are advised to read and understand the contents of Key Investor Information Document (KIID) | The fund is approved by the Securities and Exchange Commission of Sri Lanka (SEC) | Please refer to the Procedure Guide related to Unit Trust to understand our internal procedures related to products and transactions: ',
            'procedureGuide' => [
                'label' => 'firstcapital.lk/wp-content/uploads/2026/02/FCAM-UT-Procedure-Guide-to-Investors.pdf',
                'url' => 'https://firstcapital.lk/wp-content/uploads/2026/02/FCAM-UT-Procedure-Guide-to-Investors.pdf'
            ]
        ],
        'B' => [
            'key' => 'B',
            'number' => '02',
            'name' => 'The Smooth Operator',
            'style' => 'Income-Focused & Flexible',
            'product' => 'First Capital Fixed Income Fund (FCFIF)*',
            'productShort' => 'First Capital Fixed Income Fund (FCFIF)*',
            'productOptionId' => 'unit-trust',
            'description' => 'You’re looking for the sweet spot between earning a return and keeping your money accessible. You’re not chasing every opportunity - you prefer a more measured approach.',
            'vibe' => 'Thoughtful choices. Smarter Investing.',
            'productDisclaimer' => '* Disclaimers: Past performance is not an indicator of future performance | Investors are advised to read and understand the contents of Key Investor Information Document (KIID) | The fund is approved by the Securities and Exchange Commission of Sri Lanka (SEC) | Please refer to the Procedure Guide related to Unit Trust to understand our internal procedures related to products and transactions: ',
            'procedureGuide' => [
                'label' => 'firstcapital.lk/wp-content/uploads/2026/02/FCAM-UT-Procedure-Guide-to-Investors.pdf',
                'url' => 'https://firstcapital.lk/wp-content/uploads/2026/02/FCAM-UT-Procedure-Guide-to-Investors.pdf'
            ]
        ],
        'C' => [
            'key' => 'C',
            'number' => '03',
            'name' => 'The Patient Player',
            'style' => 'Long-term & income-focused',
            'product' => 'Treasury Bonds*',
            'productShort' => 'Treasury Bonds*',
            'productOptionId' => 'gov-securities',
            'description' => 'You’re comfortable giving your money time to work. You prefer a defined investment period and regular return as you build towards your bigger financial goals.',
            'vibe' => 'Play the long game.',
            'productDisclaimer' => '*Disclaimer: Terms & Conditions apply | Please refer to the Procedure Guide related Treasuries/Government Securities to understand our internal procedures related to products and transactions: ',
            'procedureGuide' => [
                'label' => 'firstcapital.lk/wp-content/uploads/2026/07/Information-Memorandum-FCT.pdf',
                'url' => 'https://firstcapital.lk/wp-content/uploads/2026/07/Information-Memorandum-FCT.pdf'
            ]
        ],
        'D' => [
            'key' => 'D',
            'number' => '04',
            'name' => 'The Opportunity Hunter',
            'style' => 'Growth-focused',
            'product' => 'Equities*',
            'productShort' => 'Equities*',
            'productOptionId' => 'equities',
            'description' => 'You’re thinking beyond the short term. You’re comfortable with market ups and downs and are focused on growing your wealth over the long run.',
            'vibe' => 'Spot the opportunity. Think long term.',
            'productDisclaimer' => '*Disclaimer: Investments are subject to market risks | Please refer to the Procedure Guide related to Stockbrokering/Equities to understand our internal procedures related to products and transactions: ',
            'procedureGuide' => [
                'label' => 'firstcapital.lk/wp-content/uploads/2026/09/FCE-procedure-guide_.pdf',
                'url' => 'https://firstcapital.lk/wp-content/uploads/2026/09/FCE-procedure-guide_.pdf'
            ]
        ]
    ];
}

function getDefaultWhyReasons() {
    return [
        [
            'id' => 'reason-1',
            'icon' => 'Users',
            'title' => 'Professional Management',
            'copy' => "With the premier Unit Trust company in Sri Lanka, there’s no need to pick assets; specialists track the market for you.",
            'visible' => true,
            'order' => 1
        ],
        [
            'id' => 'reason-2',
            'icon' => 'BarChart3',
            'title' => 'Diversification',
            'copy' => "Your risk spreads across multiple investments, not one big bet.",
            'visible' => true,
            'order' => 2
        ],
        [
            'id' => 'reason-3',
            'icon' => 'Sparkles',
            'title' => 'Start Small',
            'copy' => "Begin with only LKR 1,000.",
            'visible' => true,
            'order' => 3
        ],
        [
            'id' => 'reason-4',
            'icon' => 'RefreshCw',
            'title' => 'Easy Entry and Exit',
            'copy' => "Buy or sell units with flexibility, because you deserve the power to control your assets.",
            'visible' => true,
            'order' => 4
        ],
        [
            'id' => 'reason-5',
            'icon' => 'Landmark',
            'title' => '40+ Years of Investment Expertise',
            'copy' => "Over four decades of experience in Sri Lanka’s capital markets.",
            'visible' => true,
            'order' => 5
        ],
        [
            'id' => 'reason-6',
            'icon' => 'CircleDollarSign',
            'title' => 'Investment Options for Different Goals',
            'copy' => "Investments in different asset classes to suit different goals and time horizons.",
            'visible' => true,
            'order' => 6
        ],
        [
            'id' => 'reason-7',
            'icon' => 'Building2',
            'title' => 'Backed by Janashakthi Group',
            'copy' => "Part of one of Sri Lanka’s established financial conglomerates.",
            'visible' => true,
            'order' => 7
        ],
        [
            'id' => 'reason-8',
            'icon' => 'BookOpen',
            'title' => 'Gain Research Insights and Education',
            'copy' => "Access market insights, research and educational content to invest with confidence.",
            'visible' => true,
            'order' => 8
        ]
    ];
}

function ensureTablesExist($pdo) {
    if (!$pdo) return;
    $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
    try {
        if ($driver === 'sqlite') {
            $pdo->exec("CREATE TABLE IF NOT EXISTS app_settings (
                setting_key TEXT PRIMARY KEY,
                setting_value TEXT NOT NULL,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );");

            $pdo->exec("CREATE TABLE IF NOT EXISTS quiz_leads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT NOT NULL,
                gender TEXT DEFAULT 'male',
                result_code TEXT DEFAULT 'A',
                result_profile TEXT DEFAULT NULL,
                matched_product TEXT DEFAULT NULL,
                answers_json TEXT DEFAULT NULL,
                status TEXT DEFAULT 'NEW',
                notes TEXT DEFAULT NULL,
                source TEXT DEFAULT 'Landing Page Quiz'
            );");
        } else {
            $pdo->exec("CREATE TABLE IF NOT EXISTS `app_settings` (
                `setting_key` VARCHAR(100) PRIMARY KEY,
                `setting_value` LONGTEXT NOT NULL,
                `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

            $pdo->exec("CREATE TABLE IF NOT EXISTS `quiz_leads` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                `name` VARCHAR(100) NOT NULL,
                `email` VARCHAR(150) NOT NULL,
                `phone` VARCHAR(50) NOT NULL,
                `gender` VARCHAR(20) DEFAULT 'male',
                `result_code` CHAR(2) DEFAULT 'A',
                `result_profile` VARCHAR(100) DEFAULT NULL,
                `matched_product` VARCHAR(255) DEFAULT NULL,
                `answers_json` LONGTEXT DEFAULT NULL,
                `status` VARCHAR(20) DEFAULT 'NEW',
                `notes` TEXT DEFAULT NULL,
                `source` VARCHAR(100) DEFAULT 'Landing Page Quiz'
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
        }
    } catch (Throwable $e) {
        error_log("ensureTablesExist error: " . $e->getMessage());
    }
}

$pdo = getDbConnection();
if (!$pdo) {
    jsonResponse(503, ['success' => false, 'error' => 'Service temporarily unavailable. Please try again shortly.']);
}
ensureTablesExist($pdo);
ensureSecurityTables($pdo);

if ($method !== 'GET') {
    requireSameOrigin();
}

// ----------------------------------------------------
// 1. HEALTH / STATUS CHECK (admin only)
// ----------------------------------------------------
if ($action === 'status') {
    requireAdmin($pdo);
    try {
        $totalLeads = (int)$pdo->query("SELECT COUNT(*) FROM quiz_leads")->fetchColumn();
        $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
        jsonResponse(200, [
            'success' => true,
            'connected' => true,
            'driver' => $driver,
            'host' => $driver === 'sqlite' ? 'local-sqlite' : (defined('DB_HOST') ? DB_HOST : 'localhost'),
            'database' => $driver === 'sqlite' ? 'database.sqlite' : (defined('DB_NAME') ? DB_NAME : 'firstcapital_investor'),
            'totalLeads' => $totalLeads,
            'timestamp' => date('c'),
        ]);
    } catch (Throwable $e) {
        jsonResponse(200, ['success' => false, 'connected' => false, 'error' => 'Database query failed.']);
    }
}

// ----------------------------------------------------
// 2. APP SETTINGS (Questions, Results, Testimonials, Reasons, Products)
// ----------------------------------------------------
if (in_array($action, ['questions', 'testimonials', 'results', 'quiz_results', 'reasons', 'why_first_capital', 'settings'], true)) {
    $aliases = [
        'questions' => 'quiz_questions',
        'testimonials' => 'testimonials',
        'results' => 'quiz_results',
        'quiz_results' => 'quiz_results',
        'reasons' => 'why_first_capital',
        'why_first_capital' => 'why_first_capital',
    ];
    $defaults = [
        'quiz_questions' => 'getDefaultQuizQuestions',
        'testimonials' => 'getDefaultTestimonials',
        'quiz_results' => 'getDefaultQuizResults',
        'why_first_capital' => 'getDefaultWhyReasons',
    ];

    if ($method === 'GET') {
        $key = $aliases[$action] ?? cleanString($_GET['key'] ?? 'quiz_questions', 100);
        if ($key === 'reasons') $key = 'why_first_capital';
        if (!in_array($key, PUBLIC_SETTING_KEYS, true)) {
            jsonResponse(404, ['success' => false, 'error' => 'Unknown setting.']);
        }
        try {
            $stmt = $pdo->prepare("SELECT setting_value FROM app_settings WHERE setting_key = :k");
            $stmt->execute([':k' => $key]);
            $row = $stmt->fetch();
            if ($row && !empty($row['setting_value'])) {
                $decoded = json_decode($row['setting_value'], true);
                if ($key === 'testimonials' && is_array($decoded)) {
                    $decoded = array_values(array_filter($decoded, function($t) {
                        return ($t['status'] ?? 'Active') === 'Active' && (!isset($t['visible']) || $t['visible'] !== false);
                    }));
                }
                jsonResponse(200, ['success' => true, 'source' => 'db', 'data' => $decoded !== null ? $decoded : $row['setting_value']]);
            }
        } catch (Throwable $e) {}

        // Not stored yet: return the built-in defaults and seed them
        if (isset($defaults[$key])) {
            $defaultData = call_user_func($defaults[$key]);
            $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
            try {
                if ($driver === 'sqlite') {
                    $ins = $pdo->prepare("INSERT INTO app_settings (setting_key, setting_value) VALUES (:k, :v) ON CONFLICT(setting_key) DO NOTHING");
                } else {
                    $ins = $pdo->prepare("INSERT INTO app_settings (setting_key, setting_value) VALUES (:k, :v) ON DUPLICATE KEY UPDATE setting_value = setting_value");
                }
                $ins->execute([':k' => $key, ':v' => json_encode($defaultData, JSON_UNESCAPED_UNICODE)]);
            } catch (Throwable $e) {}
            jsonResponse(200, ['success' => true, 'source' => 'default_seeded', 'data' => $defaultData]);
        }
        jsonResponse(200, ['success' => true, 'data' => null]);
    }

    if ($method === 'POST') {
        requireAdmin($pdo);
        $body = readJsonBody();
        $key = cleanString($body['key'] ?? ($_GET['key'] ?? ''), 100);
        if (!in_array($key, PUBLIC_SETTING_KEYS, true) || !array_key_exists('value', $body)) {
            jsonResponse(400, ['success' => false, 'error' => 'Unknown setting.']);
        }
        if (!settingsUrlsAreSafe($body['value'])) {
            jsonResponse(400, ['success' => false, 'error' => 'Links must start with http:// or https://.']);
        }
        $val = is_string($body['value']) ? $body['value'] : json_encode($body['value'], JSON_UNESCAPED_UNICODE);
        if (strlen($val) > MAX_SETTING_BYTES) {
            jsonResponse(413, ['success' => false, 'error' => 'Setting is too large.']);
        }
        $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
        try {
            if ($driver === 'sqlite') {
                $stmt = $pdo->prepare("INSERT INTO app_settings (setting_key, setting_value) VALUES (:k, :v) ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value");
            } else {
                $stmt = $pdo->prepare("INSERT INTO app_settings (setting_key, setting_value) VALUES (:k, :v) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
            }
            $stmt->execute([':k' => $key, ':v' => $val]);
            jsonResponse(200, ['success' => true]);
        } catch (Throwable $e) {
            jsonResponse(500, ['success' => false, 'error' => 'Could not save setting.']);
        }
    }

    jsonResponse(405, ['success' => false, 'error' => 'Method not allowed.']);
}

// ----------------------------------------------------
// 3. GET LEADS (admin only)
// ----------------------------------------------------
if ($method === 'GET') {
    requireAdmin($pdo);
    try {
        $stmt = $pdo->query("SELECT * FROM quiz_leads ORDER BY created_at DESC LIMIT 500");
        $rows = $stmt->fetchAll();
        $formatted = array_map(function($r) {
            $answers = [];
            if (!empty($r['answers_json'])) {
                $decoded = json_decode($r['answers_json'], true);
                if (is_array($decoded)) $answers = $decoded;
            }
            return [
                'id' => 'FC-' . ($r['id'] ?? '000'),
                'dbId' => (int)$r['id'],
                'createdAt' => $r['created_at'] ?? date('c'),
                'name' => $r['name'] ?? 'Anonymous',
                'email' => $r['email'] ?? '',
                'phone' => $r['phone'] ?? '',
                'gender' => $r['gender'] ?? 'male',
                'profileKey' => $r['result_code'] ?? 'A',
                'profileName' => $r['result_profile'] ?? '',
                'matchedProduct' => $r['matched_product'] ?? '',
                'investmentAmount' => $r['investment_amount'] ?? '',
                'preferredContact' => $r['preferred_contact'] ?? 'phone',
                'answers' => $answers,
                'status' => $r['status'] ?? 'NEW',
                'notes' => $r['notes'] ?? '',
                'source' => $r['source'] ?? 'Landing Page'
            ];
        }, $rows);
        jsonResponse(200, ['success' => true, 'leads' => $formatted, 'count' => count($formatted)]);
    } catch (Throwable $e) {
        jsonResponse(500, ['success' => false, 'error' => 'Could not load leads.']);
    }
}

// ----------------------------------------------------
// 4. POST / UPDATE / DELETE
// ----------------------------------------------------
$data = readJsonBody();

// Delete lead (admin only)
if ($action === 'delete' || (isset($data['action']) && $data['action'] === 'delete') || $method === 'DELETE') {
    requireAdmin($pdo);
    $leadId = parseLeadId($data['dbId'] ?? $data['id'] ?? $_GET['id'] ?? 0);
    $deleted = false;
    if ($leadId > 0) {
        try {
            $stmt = $pdo->prepare("DELETE FROM quiz_leads WHERE id = :id");
            $stmt->execute([':id' => $leadId]);
            $deleted = ($stmt->rowCount() > 0);
        } catch (Throwable $e) {}
    }
    jsonResponse(200, ['success' => true, 'deletedId' => $leadId, 'dbDeleted' => $deleted]);
}

// Update existing lead status / notes (admin only)
if ($action === 'update' || (isset($data['action']) && $data['action'] === 'update') || (isset($data['dbId']) && $data['dbId'] > 0 && !isset($data['email']))) {
    requireAdmin($pdo);
    $leadId = parseLeadId($data['dbId'] ?? $data['id'] ?? $_GET['id'] ?? 0);
    $status = strtoupper(cleanString($data['status'] ?? 'NEW', 20));
    $notes = cleanString($data['notes'] ?? '', 1000);
    if ($leadId <= 0) {
        jsonResponse(400, ['success' => false, 'error' => 'Missing lead id.']);
    }
    try {
        $stmt = $pdo->prepare("UPDATE quiz_leads SET status = :status, notes = :notes WHERE id = :id");
        $stmt->execute([':status' => $status, ':notes' => $notes, ':id' => $leadId]);
        jsonResponse(200, ['success' => true, 'updatedId' => $leadId]);
    } catch (Throwable $e) {
        jsonResponse(500, ['success' => false, 'error' => 'Could not update lead.']);
    }
}

if ($method !== 'POST') {
    jsonResponse(405, ['success' => false, 'error' => 'Method not allowed.']);
}

// Create a lead: public quiz submission, or a manual entry from the admin portal
$isAdminEntry = ($action === 'admin_create');
if ($isAdminEntry) {
    requireAdmin($pdo);
} else {
    // Honeypot: real visitors never fill the hidden "website" field
    if (!empty($data['website'])) {
        jsonResponse(200, ['success' => true, 'leadId' => 0, 'id' => 'FC-0']);
    }
    if (!rateLimit($pdo, 'lead', 8, 3600)) {
        jsonResponse(429, ['success' => false, 'error' => 'Too many submissions. Please try again later.']);
    }
}

$name = cleanString($data['name'] ?? '', 100);
$email = cleanString($data['email'] ?? '', 150);
$phone = cleanString($data['phone'] ?? '', 50);
if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $phone === '') {
    jsonResponse(400, ['success' => false, 'error' => 'Please provide your name, a valid email and phone number.']);
}
$gender = strtolower(cleanString($data['gender'] ?? 'male', 20)) === 'female' ? 'female' : 'male';
$profileKey = strtoupper(cleanString($data['profileKey'] ?? $data['resultCode'] ?? $data['profile'] ?? 'A', 2));
if (!in_array($profileKey, ['A', 'B', 'C', 'D'], true)) $profileKey = 'A';

$profileMap = [
    'A' => 'The Keep-It-Cool Investor',
    'B' => 'The Smooth Operator',
    'C' => 'The Patient Player',
    'D' => 'The Opportunity Hunter'
];
$profileName = cleanString($data['profileName'] ?? $data['resultProfile'] ?? '', 100) ?: $profileMap[$profileKey];
$matchedProduct = cleanString($data['matchedProduct'] ?? $data['product'] ?? '', 255);
$answers = (isset($data['answers']) && is_array($data['answers'])) ? json_encode($data['answers'], JSON_UNESCAPED_UNICODE) : null;
if ($answers !== null && strlen($answers) > 10000) $answers = null;

if ($isAdminEntry) {
    $status = strtoupper(cleanString($data['status'] ?? 'NEW', 20));
    $notes = cleanString($data['notes'] ?? '', 1000);
    $source = cleanString($data['source'] ?? 'Admin Manual Entry', 100);
} else {
    // Public submissions cannot set admin-managed fields
    $status = 'NEW';
    $notes = '';
    $allowedSources = ['Landing Page Quiz', 'Main Quiz Flow', 'Design Option 2 Quiz'];
    $source = in_array($data['source'] ?? '', $allowedSources, true) ? $data['source'] : 'Landing Page Quiz';
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO quiz_leads (name, email, phone, gender, result_code, result_profile, matched_product, answers_json, status, notes, source, created_at)
        VALUES (:name, :email, :phone, :gender, :code, :resultProfile, :product, :answers, :status, :notes, :source, :now)
    ");
    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':phone' => $phone,
        ':gender' => $gender,
        ':code' => $profileKey,
        ':resultProfile' => $profileName,
        ':product' => $matchedProduct,
        ':answers' => $answers,
        ':status' => $status,
        ':notes' => $notes,
        ':source' => $source,
        ':now' => date('Y-m-d H:i:s'),
    ]);
    $id = (int)$pdo->lastInsertId();
    jsonResponse(200, ['success' => true, 'leadId' => $id, 'id' => 'FC-' . $id, 'storage' => 'database']);
} catch (Throwable $e) {
    jsonResponse(500, ['success' => false, 'error' => 'Could not save your details. Please try again.']);
}
