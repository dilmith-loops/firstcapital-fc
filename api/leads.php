<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/smtp.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Auto-detect action from PATH_INFO or REQUEST_URI if rewritten
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
} elseif (strpos($uri, '/api/admin/test_smtp') !== false || strpos($uri, '/api/test_smtp') !== false || strpos($uri, '/api/test_email') !== false) {
    $action = 'test_smtp';
} elseif (strpos($uri, '/api/admin/leads/update') !== false) {
    $action = 'update';
} elseif (strpos($uri, '/api/admin/leads/delete') !== false) {
    $action = 'delete';
} elseif (strpos($uri, '/api/admin/leads') !== false && $method === 'GET') {
    $action = 'leads';
}

// Diagnostic SMTP test endpoint (accessible by admin to verify .env credentials)
if ($action === 'test_smtp' || $action === 'test_email') {
    $mailer = new FirstCapitalMailer();
    $isConfigured = $mailer->isConfigured();
    $adminEmail = trim((string)(getenv('ADMIN_EMAIL') ?: (defined('ADMIN_EMAIL') ? ADMIN_EMAIL : (getenv('SMTP_TO_EMAIL') ?: ''))));
    $host = trim((string)(getenv('SMTP_HOST') ?: (defined('SMTP_HOST') ? SMTP_HOST : '')));
    $port = (int)(getenv('SMTP_PORT') ?: (defined('SMTP_PORT') ? SMTP_PORT : 465));
    $user = trim((string)(getenv('SMTP_USER') ?: (defined('SMTP_USER') ? SMTP_USER : '')));
    
    if (!$isConfigured) {
        http_response_code(200);
        echo json_encode([
            'success' => false,
            'configured' => false,
            'message' => 'SMTP is not fully configured in .env. Please set SMTP_HOST, SMTP_USER, SMTP_PASS, and ADMIN_EMAIL in your .env file.',
            'settings' => [
                'SMTP_HOST' => $host ?: '(not set)',
                'SMTP_PORT' => $port,
                'SMTP_USER' => $user ?: '(not set)',
                'ADMIN_EMAIL' => $adminEmail ?: '(not set)'
            ]
        ]);
        exit;
    }
    
    $testResult = $mailer->send(
        $adminEmail,
        "✅ First Capital SMTP Test Notification",
        "<div style='font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;padding:24px;background:#f8fafc;border-radius:12px;max-width:550px;margin:0 auto;border:1px solid #e2e8f0;'><h2 style='color:#1a214c;margin-top:0;'>First Capital SMTP Configuration Test</h2><p style='color:#334155;'>This is a test notification confirming that your SMTP settings in <strong>.env</strong> are working correctly!</p><div style='background:#ffffff;padding:12px 16px;border-radius:8px;border:1px solid #e2e8f0;font-size:13px;color:#1e293b;'><strong>Host:</strong> {$host}:{$port}<br><strong>User:</strong> {$user}<br><strong>Admin Recipient:</strong> {$adminEmail}</div><p style='font-size:12px;color:#64748b;margin-bottom:0;margin-top:16px;'>Sent at " . date('Y-m-d H:i:s T') . "</p></div>",
        "First Capital SMTP Configuration Test\nThis test confirms that your SMTP settings in .env are working correctly.\nHost: {$host}:{$port}\nRecipient: {$adminEmail}"
    );
    
    http_response_code(200);
    echo json_encode([
        'success' => $testResult['success'] ?? false,
        'configured' => true,
        'result' => $testResult,
        'settings' => [
            'SMTP_HOST' => $host,
            'SMTP_PORT' => $port,
            'SMTP_USER' => $user,
            'ADMIN_EMAIL' => $adminEmail
        ]
    ]);
    exit;
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
    try {
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
    } catch (Throwable $e) {}
}

$pdo = getDbConnection();
ensureTablesExist($pdo);

// ----------------------------------------------------
// 1. HEALTH / STATUS CHECK
// ----------------------------------------------------
if ($action === 'status') {
    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM quiz_leads");
            $row = $stmt->fetch();
            $totalLeads = (int)($row['count'] ?? 0);

            $tblStmt = $pdo->query("SHOW TABLES");
            $tables = $tblStmt->fetchAll(PDO::FETCH_COLUMN);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'connected' => true,
                'host' => DB_HOST,
                'database' => DB_NAME,
                'port' => 3306,
                'totalLeads' => $totalLeads,
                'tables' => $tables,
                'timestamp' => date('c'),
                'serverTime' => date('Y-m-d H:i:s')
            ]);
            exit;
        } catch (Throwable $e) {
            http_response_code(200);
            echo json_encode([
                'success' => false,
                'connected' => false,
                'host' => DB_HOST,
                'database' => DB_NAME,
                'error' => $e->getMessage()
            ]);
            exit;
        }
    } else {
        http_response_code(200);
        echo json_encode([
            'success' => false,
            'connected' => false,
            'host' => DB_HOST,
            'database' => DB_NAME,
            'error' => 'Could not connect to MySQL with provided credentials.'
        ]);
        exit;
    }
}

// ----------------------------------------------------
// 2. APP SETTINGS (Questions, Products, Testimonials, Admins)
// ----------------------------------------------------
if ($action === 'questions' || $action === 'testimonials' || $action === 'results' || $action === 'quiz_results' || $action === 'reasons' || $action === 'why_first_capital' || $action === 'settings') {
    if ($action === 'questions') {
        $_GET['key'] = 'quiz_questions';
    }
    if ($action === 'testimonials') {
        $_GET['key'] = 'testimonials';
    }
    if ($action === 'results' || $action === 'quiz_results') {
        $_GET['key'] = 'quiz_results';
    }
    if ($action === 'reasons' || $action === 'why_first_capital') {
        $_GET['key'] = 'why_first_capital';
    }
    if ($method === 'GET') {
        $key = cleanString($_GET['key'] ?? 'quiz_questions', 100);
        if ($pdo) {
            try {
                $stmt = $pdo->prepare("SELECT setting_value FROM app_settings WHERE setting_key = :k");
                $stmt->execute([':k' => $key]);
                $row = $stmt->fetch();
                if ($row && isset($row['setting_value']) && !empty($row['setting_value'])) {
                    $decoded = json_decode($row['setting_value'], true);
                    http_response_code(200);
                    echo json_encode([
                        'success' => true,
                        'source' => 'db',
                        'data' => $decoded !== null ? $decoded : $row['setting_value']
                    ]);
                    exit;
                }
            } catch (Throwable $e) {}
        }

        // If requesting quiz_questions and not found in DB: return default questions and seed to DB
        if ($key === 'quiz_questions') {
            $defaultQuestions = getDefaultQuizQuestions();
            if ($pdo) {
                try {
                    $valJson = json_encode($defaultQuestions, JSON_UNESCAPED_UNICODE);
                    $ins = $pdo->prepare("INSERT INTO app_settings (setting_key, setting_value) VALUES ('quiz_questions', :v) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
                    $ins->execute([':v' => $valJson]);
                } catch (Throwable $e) {}
            }
            http_response_code(200);
            echo json_encode(['success' => true, 'source' => 'default_seeded', 'data' => $defaultQuestions]);
            exit;
        }

        // If requesting testimonials and not found in DB: return default testimonials and seed to DB
        if ($key === 'testimonials') {
            $defaultTestimonials = getDefaultTestimonials();
            if ($pdo) {
                try {
                    $valJson = json_encode($defaultTestimonials, JSON_UNESCAPED_UNICODE);
                    $ins = $pdo->prepare("INSERT INTO app_settings (setting_key, setting_value) VALUES ('testimonials', :v) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
                    $ins->execute([':v' => $valJson]);
                } catch (Throwable $e) {}
            }
            http_response_code(200);
            echo json_encode(['success' => true, 'source' => 'default_seeded', 'data' => $defaultTestimonials]);
            exit;
        }

        // If requesting quiz_results and not found in DB: return default quiz results and seed to DB
        if ($key === 'quiz_results') {
            $defaultResults = getDefaultQuizResults();
            if ($pdo) {
                try {
                    $valJson = json_encode($defaultResults, JSON_UNESCAPED_UNICODE);
                    $ins = $pdo->prepare("INSERT INTO app_settings (setting_key, setting_value) VALUES ('quiz_results', :v) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
                    $ins->execute([':v' => $valJson]);
                } catch (Throwable $e) {}
            }
            http_response_code(200);
            echo json_encode(['success' => true, 'source' => 'default_seeded', 'data' => $defaultResults]);
            exit;
        }

        // If requesting why_first_capital and not found in DB: return default reasons and seed to DB
        if ($key === 'why_first_capital' || $key === 'reasons') {
            $defaultReasons = getDefaultWhyReasons();
            if ($pdo) {
                try {
                    $valJson = json_encode($defaultReasons, JSON_UNESCAPED_UNICODE);
                    $ins = $pdo->prepare("INSERT INTO app_settings (setting_key, setting_value) VALUES ('why_first_capital', :v) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
                    $ins->execute([':v' => $valJson]);
                } catch (Throwable $e) {}
            }
            http_response_code(200);
            echo json_encode(['success' => true, 'source' => 'default_seeded', 'data' => $defaultReasons]);
            exit;
        }

        http_response_code(200);
        echo json_encode(['success' => true, 'data' => null]);
        exit;
    } elseif ($method === 'POST') {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true);
        $key = cleanString($body['key'] ?? ($_GET['key'] ?? ''), 100);
        $val = '';
        if (isset($body['value'])) {
            $val = is_string($body['value']) ? $body['value'] : json_encode($body['value'], JSON_UNESCAPED_UNICODE);
        } elseif ($body !== null && !isset($body['key'])) {
            $val = json_encode($body, JSON_UNESCAPED_UNICODE);
        }
        if ($pdo && $key) {
            try {
                $stmt = $pdo->prepare("INSERT INTO app_settings (setting_key, setting_value) VALUES (:k, :v) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
                $stmt->execute([':k' => $key, ':v' => $val]);
                http_response_code(200);
                echo json_encode(['success' => true]);
                exit;
            } catch (Throwable $e) {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => $e->getMessage()]);
                exit;
            }
        }
        http_response_code(200);
        echo json_encode(['success' => true]);
        exit;
    }
}

// ----------------------------------------------------
// 3. GET LEADS
// ----------------------------------------------------
if ($method === 'GET') {
    if ($pdo) {
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

            http_response_code(200);
            echo json_encode(['success' => true, 'leads' => $formatted, 'count' => count($formatted)]);
            exit;
        } catch (Throwable $e) {}
    }

    // JSON file fallback
    $jsonFile = __DIR__ . '/leads_data.json';
    $leads = file_exists($jsonFile) ? (json_decode(file_get_contents($jsonFile), true) ?: []) : [];
    http_response_code(200);
    echo json_encode(['success' => true, 'leads' => $leads, 'storage' => 'file']);
    exit;
}

// ----------------------------------------------------
// 4. POST / UPDATE / DELETE
// ----------------------------------------------------
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true) ?: [];

// Delete lead
if ($action === 'delete' || (isset($data['action']) && $data['action'] === 'delete') || $method === 'DELETE') {
    $rawId = (string)($data['id'] ?? $data['dbId'] ?? $_GET['id'] ?? '');
    $leadId = parseLeadId($data['dbId'] ?? $data['id'] ?? $_GET['id'] ?? 0);
    $deletedDb = false;

    if ($pdo && $leadId > 0) {
        try {
            $stmt = $pdo->prepare("DELETE FROM quiz_leads WHERE id = :id");
            $stmt->execute([':id' => $leadId]);
            $deletedDb = ($stmt->rowCount() > 0);
        } catch (Throwable $e) {}
    }

    // Also clean up from local JSON fallback file if present
    $jsonFile = __DIR__ . '/leads_data.json';
    if (file_exists($jsonFile)) {
        $fileLeads = json_decode(file_get_contents($jsonFile), true) ?: [];
        $origCount = count($fileLeads);
        $filtered = array_values(array_filter($fileLeads, function($item) use ($leadId, $rawId) {
            $itemId = (string)($item['id'] ?? '');
            $itemDbId = parseLeadId($item['dbId'] ?? $item['id'] ?? 0);
            if ($rawId !== '' && $itemId === $rawId) return false;
            if ($leadId > 0 && $itemDbId === $leadId) return false;
            return true;
        }));
        if (count($filtered) !== $origCount) {
            @file_put_contents($jsonFile, json_encode($filtered, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        }
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'deletedId' => $leadId,
        'rawId' => $rawId,
        'dbDeleted' => $deletedDb
    ]);
    exit;
}

// Update existing lead (status or notes)
if ($action === 'update' || (isset($data['action']) && $data['action'] === 'update') || (isset($data['dbId']) && $data['dbId'] > 0 && !isset($data['email']))) {
    $rawId = (string)($data['id'] ?? $data['dbId'] ?? $_GET['id'] ?? '');
    $leadId = parseLeadId($data['dbId'] ?? $data['id'] ?? $_GET['id'] ?? 0);
    $status = cleanString($data['status'] ?? 'NEW', 20);
    $notes = cleanString($data['notes'] ?? '', 1000);

    if ($pdo && $leadId > 0) {
        try {
            $stmt = $pdo->prepare("UPDATE quiz_leads SET status = :status, notes = :notes WHERE id = :id");
            $stmt->execute([':status' => $status, ':notes' => $notes, ':id' => $leadId]);
            http_response_code(200);
            echo json_encode(['success' => true, 'updatedId' => $leadId]);
            exit;
        } catch (Throwable $e) {}
    }

    // JSON file fallback update
    $jsonFile = __DIR__ . '/leads_data.json';
    if (file_exists($jsonFile)) {
        $fileLeads = json_decode(file_get_contents($jsonFile), true) ?: [];
        foreach ($fileLeads as &$item) {
            $itemId = (string)($item['id'] ?? '');
            $itemDbId = parseLeadId($item['dbId'] ?? $item['id'] ?? 0);
            if (($rawId !== '' && $itemId === $rawId) || ($leadId > 0 && $itemDbId === $leadId)) {
                $item['status'] = $status;
                if ($notes !== '') $item['notes'] = $notes;
            }
        }
        @file_put_contents($jsonFile, json_encode($fileLeads, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    http_response_code(200);
    echo json_encode(['success' => true, 'updatedId' => $leadId]);
    exit;
}

// Create new lead or submit quiz result
$name = cleanString($data['name'] ?? 'Anonymous Investor', 100);
$email = cleanString($data['email'] ?? 'N/A', 150);
$phone = cleanString($data['phone'] ?? 'N/A', 50);
$gender = strtolower(cleanString($data['gender'] ?? 'male', 20));
$profileKey = strtoupper(cleanString($data['profileKey'] ?? $data['resultCode'] ?? $data['profile'] ?? 'A', 2));
$profileName = cleanString($data['profileName'] ?? $data['resultProfile'] ?? '', 100);

// Auto-populate profile name from profile key if not passed directly
$profileMap = [
    'A' => 'The Keep-It-Cool Investor',
    'B' => 'The Smooth Operator',
    'C' => 'The Patient Player',
    'D' => 'The Opportunity Hunter'
];
if (empty($profileName) && isset($profileMap[$profileKey])) {
    $profileName = $profileMap[$profileKey];
}

$matchedProduct = cleanString($data['matchedProduct'] ?? $data['product'] ?? '', 255);
$answers = isset($data['answers']) ? json_encode($data['answers'], JSON_UNESCAPED_UNICODE) : null;
$status = strtoupper(cleanString($data['status'] ?? 'NEW', 20));
$notes = cleanString($data['notes'] ?? '', 1000);
$source = cleanString($data['source'] ?? 'Landing Page Quiz', 100);

function finalizeLeadSubmission($refId, $leadId, $data, $name, $email, $phone, $gender, $profileKey, $profileName, $matchedProduct, $source, $pdo, $storageType) {
    $emailResult = null;
    if (function_exists('sendLeadNotificationEmail')) {
        $leadPayloadForEmail = [
            'id' => $refId,
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'gender' => $gender,
            'profileKey' => $profileKey,
            'profileName' => $profileName,
            'matchedProduct' => $matchedProduct,
            'answers' => $data['answers'] ?? [],
            'source' => $source
        ];
        try {
            $emailResult = sendLeadNotificationEmail($leadPayloadForEmail, $pdo);
        } catch (Throwable $eMail) {
            $emailResult = ['success' => false, 'error' => $eMail->getMessage()];
        }
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'leadId' => (int)$leadId,
        'id' => $refId,
        'storage' => $storageType,
        'emailNotification' => $emailResult
    ]);
    exit;
}

if ($pdo) {
    try {
        $stmt = $pdo->prepare("
            INSERT INTO quiz_leads (name, email, phone, gender, result_code, result_profile, matched_product, answers_json, status, notes, source, created_at)
            VALUES (:name, :email, :phone, :gender, :code, :resultProfile, :product, :answers, :status, :notes, :source, NOW())
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
            ':source' => $source
        ]);
        $id = $pdo->lastInsertId();
        finalizeLeadSubmission('FC-' . $id, (int)$id, $data, $name, $email, $phone, $gender, $profileKey, $profileName, $matchedProduct, $source, $pdo, 'database');
    } catch (Throwable $e) {
        // Multi-tier fallback: Insert only core columns present in original table schema
        try {
            $stmtCore = $pdo->prepare("
                INSERT INTO quiz_leads (name, email, phone, result_code, result_profile, matched_product, answers_json, status, notes, created_at)
                VALUES (:name, :email, :phone, :code, :resultProfile, :product, :answers, :status, :notes, NOW())
            ");
            $stmtCore->execute([
                ':name' => $name,
                ':email' => $email,
                ':phone' => $phone,
                ':code' => $profileKey,
                ':resultProfile' => $profileName,
                ':product' => $matchedProduct,
                ':answers' => $answers,
                ':status' => $status,
                ':notes' => $notes
            ]);
            $id = $pdo->lastInsertId();
            finalizeLeadSubmission('FC-' . $id, (int)$id, $data, $name, $email, $phone, $gender, $profileKey, $profileName, $matchedProduct, $source, $pdo, 'database_core');
        } catch (Throwable $eCore) {}
    }
}

// Fallback JSON file
$jsonFile = __DIR__ . '/leads_data.json';
$leads = file_exists($jsonFile) ? (json_decode(file_get_contents($jsonFile), true) ?: []) : [];
$leadId = time() . rand(100, 999);
$newLead = [
    'id' => 'FC-' . $leadId,
    'dbId' => (int)$leadId,
    'createdAt' => date('c'),
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'gender' => $gender,
    'profileKey' => $profileKey,
    'profileName' => $profileName,
    'matchedProduct' => $matchedProduct,
    'answers' => $data['answers'] ?? [],
    'status' => $status,
    'notes' => $notes,
    'source' => $source
];
array_unshift($leads, $newLead);
@file_put_contents($jsonFile, json_encode($leads, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

finalizeLeadSubmission('FC-' . $leadId, (int)$leadId, $data, $name, $email, $phone, $gender, $profileKey, $profileName, $matchedProduct, $source, $pdo, 'file');
