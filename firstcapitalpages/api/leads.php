<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

// Helper to sanitize strings
function cleanString($str, $maxLen = 255) {
    if (!is_string($str)) return '';
    $clean = strip_tags(trim($str));
    return mb_substr($clean, 0, $maxLen, 'UTF-8');
}

// ---------------------------------------------
// POST: Submit or update a lead
// ---------------------------------------------
if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!$data || !is_array($data)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid JSON payload.']);
        exit;
    }

    $name = cleanString($data['name'] ?? '', 100);
    $email = cleanString($data['email'] ?? '', 150);
    $phone = cleanString($data['phone'] ?? '', 50);
    $gender = strtolower(cleanString($data['gender'] ?? 'male', 20));
    $profileKey = strtoupper(cleanString($data['profileKey'] ?? $data['resultCode'] ?? $data['profile'] ?? 'A', 2));
    $profileName = cleanString($data['profileName'] ?? $data['resultProfile'] ?? '', 100);
    $matchedProduct = cleanString($data['matchedProduct'] ?? $data['product'] ?? '', 255);
    $answers = isset($data['answers']) ? json_encode($data['answers'], JSON_UNESCAPED_UNICODE) : null;
    $status = strtoupper(cleanString($data['status'] ?? 'NEW', 20));
    $notes = cleanString($data['notes'] ?? '', 1000);

    if (!$name) {
        $name = 'Anonymous Investor';
    }

    $pdo = getDbConnection();

    if ($pdo) {
        try {
            // Full insert with all columns
            $stmt = $pdo->prepare("
                INSERT INTO quiz_leads (name, email, phone, gender, result_code, result_profile, matched_product, answers_json, status, notes, created_at)
                VALUES (:name, :email, :phone, :gender, :code, :resultProfile, :product, :answers, :status, :notes, NOW())
            ");
            $stmt->execute([
                ':name' => $name,
                ':email' => $email ? $email : 'N/A',
                ':phone' => $phone ? $phone : 'N/A',
                ':gender' => $gender,
                ':code' => $profileKey,
                ':resultProfile' => $profileName ? $profileName : null,
                ':product' => $matchedProduct ? $matchedProduct : null,
                ':answers' => $answers,
                ':status' => $status,
                ':notes' => $notes ? $notes : null,
            ]);

            $leadId = $pdo->lastInsertId();

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'leadId' => (int)$leadId,
                'storage' => 'database',
                'message' => 'Lead successfully saved to database.'
            ]);
            exit;
        } catch (Throwable $e) {
            // Fallback for tables without gender or matched_product columns
            try {
                $stmt = $pdo->prepare("
                    INSERT INTO quiz_leads (name, email, phone, result_code, result_profile, answers_json, status, notes, created_at)
                    VALUES (:name, :email, :phone, :code, :resultProfile, :answers, :status, :notes, NOW())
                ");
                $stmt->execute([
                    ':name' => $name,
                    ':email' => $email ? $email : 'N/A',
                    ':phone' => $phone ? $phone : 'N/A',
                    ':code' => $profileKey,
                    ':resultProfile' => $profileName ? $profileName : null,
                    ':answers' => $answers,
                    ':status' => $status,
                    ':notes' => $notes ? $notes : null,
                ]);

                $leadId = $pdo->lastInsertId();

                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'leadId' => (int)$leadId,
                    'storage' => 'database',
                    'message' => 'Lead successfully saved to database.'
                ]);
                exit;
            } catch (Throwable $e2) {
                // Fall through to JSON storage
            }
        }
    }

    // Fallback: Save to local leads_data.json
    $jsonFile = __DIR__ . '/leads_data.json';
    $leads = [];
    if (file_exists($jsonFile)) {
        $content = @file_get_contents($jsonFile);
        $leads = json_decode($content, true) ?: [];
    }

    $leadId = time() . rand(100, 999);
    $newLead = [
        'id' => (string)$leadId,
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
        'source' => 'Landing Page Quiz'
    ];

    array_unshift($leads, $newLead);
    @file_put_contents($jsonFile, json_encode($leads, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'leadId' => (int)$leadId,
        'storage' => 'file',
        'message' => 'Lead successfully saved.'
    ]);
    exit;
}

// ---------------------------------------------
// GET: Fetch leads or DB health check
// ---------------------------------------------
if ($method === 'GET') {
    $pdo = getDbConnection();

    if ($pdo) {
        try {
            if (isset($_GET['action']) && $_GET['action'] === 'status') {
                $stmt = $pdo->query("SELECT COUNT(*) as count FROM quiz_leads");
                $row = $stmt->fetch();
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'connected' => true,
                    'storage' => 'database',
                    'totalLeads' => (int)($row['count'] ?? 0),
                    'database' => DB_NAME,
                    'serverTime' => date('Y-m-d H:i:s')
                ]);
                exit;
            }

            $stmt = $pdo->query("SELECT * FROM quiz_leads ORDER BY created_at DESC LIMIT 500");
            $leads = $stmt->fetchAll();
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'count' => count($leads),
                'leads' => $leads
            ]);
            exit;
        } catch (Throwable $e) {}
    }

    // Fallback: Read from JSON file
    $jsonFile = __DIR__ . '/leads_data.json';
    $leads = [];
    if (file_exists($jsonFile)) {
        $content = @file_get_contents($jsonFile);
        $leads = json_decode($content, true) ?: [];
    }

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'storage' => 'file',
        'totalLeads' => count($leads),
        'leads' => $leads
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed.']);
