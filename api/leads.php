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

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Auto-detect action from PATH_INFO or REQUEST_URI if rewritten
$uri = $_SERVER['REQUEST_URI'] ?? '';
if (strpos($uri, '/api/admin/status') !== false) {
    $action = 'status';
} elseif (strpos($uri, '/api/admin/settings') !== false) {
    $action = 'settings';
} elseif (strpos($uri, '/api/admin/leads/update') !== false) {
    $action = 'update';
} elseif (strpos($uri, '/api/admin/leads/delete') !== false) {
    $action = 'delete';
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

$pdo = getDbConnection();

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
if ($action === 'settings') {
    if ($method === 'GET') {
        $key = cleanString($_GET['key'] ?? 'quiz_questions', 100);
        if ($pdo) {
            try {
                $stmt = $pdo->prepare("SELECT setting_value FROM app_settings WHERE setting_key = :k");
                $stmt->execute([':k' => $key]);
                $row = $stmt->fetch();
                if ($row && isset($row['setting_value'])) {
                    $decoded = json_decode($row['setting_value'], true);
                    http_response_code(200);
                    echo json_encode(['success' => true, 'data' => $decoded !== null ? $decoded : $row['setting_value']]);
                    exit;
                }
            } catch (Throwable $e) {}
        }
        http_response_code(200);
        echo json_encode(['success' => true, 'data' => null]);
        exit;
    } elseif ($method === 'POST') {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true);
        $key = cleanString($body['key'] ?? '', 100);
        $val = isset($body['value']) ? json_encode($body['value'], JSON_UNESCAPED_UNICODE) : '';
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
        http_response_code(200);
        echo json_encode(['success' => true, 'leadId' => (int)$id, 'id' => 'FC-' . $id, 'storage' => 'database']);
        exit;
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
            http_response_code(200);
            echo json_encode(['success' => true, 'leadId' => (int)$id, 'id' => 'FC-' . $id, 'storage' => 'database_core']);
            exit;
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

http_response_code(200);
echo json_encode(['success' => true, 'leadId' => (int)$leadId, 'id' => 'FC-' . $leadId, 'storage' => 'file']);
