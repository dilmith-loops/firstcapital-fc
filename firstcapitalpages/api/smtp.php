<?php
/**
 * First Capital - Pure PHP SMTP Client
 * 
 * Standalone, zero-dependency SMTP client with support for:
 * - SSL (port 465) and TLS / STARTTLS (port 587)
 * - AUTH LOGIN & AUTH PLAIN
 * - Multipart HTML + Plain Text MIME emails
 * - Strict timeout and error handling
 * - Credentials loaded exclusively from .env
 */

// Automatically load credentials from .env if present and not already defined
if (!defined('SMTP_HOST') && empty(getenv('SMTP_HOST'))) {
    $envPaths = [__DIR__ . '/.env', __DIR__ . '/../.env', __DIR__ . '/../../.env'];
    foreach ($envPaths as $envPath) {
        if (file_exists($envPath)) {
            $lines = @file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            if ($lines) {
                foreach ($lines as $line) {
                    $line = trim($line);
                    if ($line === '' || strpos($line, '#') === 0) continue;
                    if (strpos($line, '=') !== false) {
                        list($name, $val) = explode('=', $line, 2);
                        $name = trim($name);
                        $val = trim($val, " \t\n\r\0\x0B\"'");
                        if (!defined($name)) {
                            define($name, $val);
                        }
                        putenv("$name=$val");
                        $_ENV[$name] = $val;
                    }
                }
            }
            break;
        }
    }
}

class FirstCapitalMailer {
    private $host;
    private $port;
    private $secure; // 'ssl', 'tls', or 'none'
    private $user;
    private $pass;
    private $fromEmail;
    private $fromName;
    private $toEmail;
    private $timeout = 15;
    private $socket = null;
    private $lastLog = [];

    public function __construct() {
        // Read configuration from environment / .env / constants
        $this->host = trim((string)(getenv('SMTP_HOST') ?: (defined('SMTP_HOST') ? SMTP_HOST : '')));
        $this->port = (int)(getenv('SMTP_PORT') ?: (defined('SMTP_PORT') ? SMTP_PORT : 465));
        
        $sec = strtolower(trim((string)(getenv('SMTP_SECURE') ?: (defined('SMTP_SECURE') ? SMTP_SECURE : ''))));
        if ($sec === 'tls' || $this->port === 587) {
            $this->secure = 'tls';
        } elseif ($sec === 'ssl' || $this->port === 465) {
            $this->secure = 'ssl';
        } else {
            $this->secure = 'none';
        }

        $this->user = trim((string)(getenv('SMTP_USER') ?: (defined('SMTP_USER') ? SMTP_USER : '')));
        $this->pass = trim((string)(getenv('SMTP_PASS') ?: (defined('SMTP_PASS') ? SMTP_PASS : (getenv('SMTP_PASSWORD') ?: (defined('SMTP_PASSWORD') ? SMTP_PASSWORD : '')))));
        
        $from = trim((string)(getenv('SMTP_FROM_EMAIL') ?: (defined('SMTP_FROM_EMAIL') ? SMTP_FROM_EMAIL : '')));
        $this->fromEmail = $from !== '' ? $from : ($this->user !== '' ? $this->user : 'no-reply@firstcapital.lk');
        
        $fromName = trim((string)(getenv('SMTP_FROM_NAME') ?: (defined('SMTP_FROM_NAME') ? SMTP_FROM_NAME : 'First Capital Investor Week')));
        $this->fromName = $fromName !== '' ? $fromName : 'First Capital Investor Week';

        $adminEmail = trim((string)(getenv('ADMIN_EMAIL') ?: (defined('ADMIN_EMAIL') ? ADMIN_EMAIL : (getenv('SMTP_TO_EMAIL') ?: (defined('SMTP_TO_EMAIL') ? SMTP_TO_EMAIL : '')))));
        $this->toEmail = $adminEmail;
    }

    public function isConfigured() {
        $enabled = getenv('SMTP_ENABLED');
        if ($enabled !== false && (strtolower(trim($enabled)) === 'false' || trim($enabled) === '0')) {
            return false;
        }
        if (empty($this->host) || empty($this->toEmail)) {
            return false;
        }
        // Avoid sending if placeholder password is still set
        if ($this->pass === 'your_smtp_password_here' || $this->host === 'your_smtp_host_here') {
            return false;
        }
        return true;
    }

    public function getLogs() {
        return $this->lastLog;
    }

    private function log($msg) {
        $this->lastLog[] = $msg;
    }

    private function readResponse($expectedCode = null) {
        $response = '';
        while ($this->socket && !feof($this->socket)) {
            $line = fgets($this->socket, 1024);
            if ($line === false) break;
            $response .= $line;
            // SMTP multiline responses have a hyphen after the code (e.g., '250-'), final line has space (e.g., '250 ')
            if (preg_match('/^[0-9]{3} /', $line)) {
                break;
            }
        }
        $this->log("SERVER: " . trim($response));
        if ($expectedCode !== null) {
            $code = (int)substr($response, 0, 3);
            if ($code !== (int)$expectedCode) {
                throw new Exception("SMTP Error: Expected code $expectedCode, got '$response'");
            }
        }
        return $response;
    }

    private function sendCommand($cmd, $expectedCode = null) {
        if (!$this->socket) {
            throw new Exception("Socket connection is not open.");
        }
        // Mask passwords in logs
        if (strpos($cmd, 'AUTH') === false && strlen($cmd) < 200) {
            $this->log("CLIENT: " . trim($cmd));
        } else {
            $this->log("CLIENT: [SECURE DATA]");
        }
        fwrite($this->socket, $cmd . "\r\n");
        return $this->readResponse($expectedCode);
    }

    public function diagnose() {
        $placeholder = ($this->pass === 'your_smtp_password_here');
        $configured = $this->isConfigured();
        $connTest = null;
        
        if (!empty($this->host)) {
            $proto = ($this->secure === 'ssl') ? 'ssl://' : 'tcp://';
            $errno = 0;
            $errstr = '';
            $t0 = microtime(true);
            $s = @stream_socket_client($proto . $this->host . ':' . $this->port, $errno, $errstr, 5, STREAM_CLIENT_CONNECT);
            if ($s) {
                $banner = fgets($s);
                fclose($s);
                $connTest = [
                    'reachable' => true,
                    'latency_ms' => round((microtime(true) - $t0) * 1000, 1),
                    'server_banner' => trim($banner)
                ];
            } else {
                $connTest = [
                    'reachable' => false,
                    'error' => "$errstr ($errno)"
                ];
            }
        }

        return [
            'is_configured' => $configured,
            'smtp_host' => $this->host ?: '(not set)',
            'smtp_port' => $this->port,
            'smtp_secure' => $this->secure,
            'smtp_user' => $this->user ?: '(not set)',
            'admin_recipient' => $this->toEmail ?: '(not set)',
            'password_status' => empty($this->pass) ? 'missing' : ($placeholder ? 'placeholder (your_smtp_password_here)' : 'configured'),
            'server_connection' => $connTest,
            'diagnostic_message' => ($placeholder || empty($this->pass))
                ? 'CRITICAL: SMTP_PASS in .env is still set to placeholder. Please update SMTP_PASS in your .env file with your real email mailbox password.'
                : ($configured ? 'SMTP is fully configured and ready.' : 'SMTP is missing host or recipient.')
        ];
    }

    public function send($to, $subject, $htmlBody, $textBody = '', $replyTo = null) {
        if (!$this->isConfigured()) {
            return [
                'success' => false,
                'error' => ($this->pass === 'your_smtp_password_here' || empty($this->pass))
                    ? 'SMTP is not active: SMTP_PASS in .env is still set to placeholder (your_smtp_password_here). Please update .env with your real mailbox password.'
                    : 'SMTP is not configured in .env (SMTP_HOST, SMTP_USER, SMTP_PASS, or ADMIN_EMAIL is missing).'
            ];
        }

        $recipient = !empty($to) ? $to : $this->toEmail;
        if (empty($recipient)) {
            return ['success' => false, 'error' => 'No recipient email specified.'];
        }

        try {
            $protocol = ($this->secure === 'ssl') ? 'ssl://' : 'tcp://';
            $hostTarget = $protocol . $this->host . ':' . $this->port;
            $this->log("Connecting to $hostTarget with timeout {$this->timeout}s...");

            $context = stream_context_create([
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                ]
            ]);

            $errno = 0;
            $errstr = '';
            $this->socket = @stream_socket_client(
                $hostTarget,
                $errno,
                $errstr,
                $this->timeout,
                STREAM_CLIENT_CONNECT,
                $context
            );

            // Automatic port fallback if primary fails (e.g. host blocks 465, try 587)
            if (!$this->socket) {
                $fallbackPort = ($this->port === 465) ? 587 : 465;
                $fallbackProtocol = ($fallbackPort === 465) ? 'ssl://' : 'tcp://';
                $this->log("Primary connect failed ($errstr). Trying fallback $fallbackProtocol{$this->host}:$fallbackPort...");
                $this->socket = @stream_socket_client(
                    $fallbackProtocol . $this->host . ':' . $fallbackPort,
                    $errno,
                    $errstr,
                    $this->timeout,
                    STREAM_CLIENT_CONNECT,
                    $context
                );
                if ($this->socket) {
                    $this->port = $fallbackPort;
                    $this->secure = ($fallbackPort === 465) ? 'ssl' : 'tls';
                }
            }

            if (!$this->socket) {
                throw new Exception("Failed to connect to SMTP server: $errstr ($errno)");
            }

            stream_set_timeout($this->socket, $this->timeout);

            // 1. Initial Greeting (220)
            $this->readResponse(220);

            // 2. EHLO with clean domain
            $clientDomain = 'firstcapital.lk';
            try {
                $this->sendCommand("EHLO $clientDomain", 250);
            } catch (Exception $e) {
                $this->sendCommand("HELO $clientDomain", 250);
            }

            // 3. STARTTLS if required
            if ($this->secure === 'tls') {
                $this->sendCommand("STARTTLS", 220);
                $crypto = @stream_socket_enable_crypto($this->socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
                if (!$crypto) {
                    $crypto = @stream_socket_enable_crypto($this->socket, true, STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT);
                }
                if (!$crypto) {
                    throw new Exception("Failed to initiate TLS encryption.");
                }
                $this->sendCommand("EHLO $clientDomain", 250);
            }

            // 4. Authenticate if username is provided
            if (!empty($this->user)) {
                $this->sendCommand("AUTH LOGIN", 334);
                $this->sendCommand(base64_encode($this->user), 334);
                $this->sendCommand(base64_encode($this->pass), 235);
            }

            // 5. Envelope (RFC 5321 compliant)
            $this->sendCommand("MAIL FROM:<{$this->fromEmail}>", 250);
            $this->sendCommand("RCPT TO:<{$recipient}>", 250);

            // 6. Message Data
            $this->sendCommand("DATA", 354);

            $boundary = "----=_Part_" . md5(uniqid(microtime(true), true));
            $headers = [];
            $headers[] = "Date: " . date('r');
            $headers[] = "From: =?UTF-8?B?" . base64_encode($this->fromName) . "?= <{$this->fromEmail}>";
            $headers[] = "To: <{$recipient}>";
            if (!empty($replyTo) && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
                $headers[] = "Reply-To: <{$replyTo}>";
            }
            $headers[] = "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=";
            $headers[] = "Message-ID: <" . md5(uniqid()) . "@" . $clientDomain . ">";
            $headers[] = "X-Mailer: FirstCapital-Quiz/1.0";
            $headers[] = "MIME-Version: 1.0";
            $headers[] = "Content-Type: multipart/alternative; boundary=\"{$boundary}\"";

            if (empty($textBody)) {
                $textBody = strip_tags(preg_replace('/<br\s*\/?>/i', "\n", $htmlBody));
            }

            $body = implode("\r\n", $headers) . "\r\n\r\n";
            $body .= "--{$boundary}\r\n";
            $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
            $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
            $body .= chunk_split(base64_encode($textBody)) . "\r\n";

            $body .= "--{$boundary}\r\n";
            $body .= "Content-Type: text/html; charset=UTF-8\r\n";
            $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
            $body .= chunk_split(base64_encode($htmlBody)) . "\r\n";

            $body .= "--{$boundary}--\r\n";

            // Terminate DATA with single dot
            fwrite($this->socket, $body . "\r\n.\r\n");
            $this->readResponse(250);

            // 7. QUIT
            try {
                $this->sendCommand("QUIT", 221);
            } catch (Exception $eq) {}

            fclose($this->socket);
            $this->socket = null;

            return ['success' => true];
        } catch (Throwable $e) {
            if ($this->socket) {
                @fclose($this->socket);
                $this->socket = null;
            }
            $this->log("SMTP Exception: " . $e->getMessage());

            // Optional fallback: If socket failed, try built-in PHP mail() if allowed
            if (function_exists('mail')) {
                try {
                    $headers = "MIME-Version: 1.0\r\n" .
                               "Content-Type: text/html; charset=UTF-8\r\n" .
                               "From: {$this->fromName} <{$this->fromEmail}>\r\n";
                    if (!empty($replyTo) && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
                        $headers .= "Reply-To: <{$replyTo}>\r\n";
                    }
                    $mailSent = @mail($recipient, $subject, $htmlBody, $headers);
                    if ($mailSent) {
                        return ['success' => true, 'via' => 'php_mail_fallback'];
                    }
                } catch (Throwable $eMail) {}
            }

            return [
                'success' => false,
                'error' => $e->getMessage(),
                'log' => $this->lastLog
            ];
        }
    }
}

/**
 * Format and send the lead notification email with full quiz breakdown
 */
function sendLeadNotificationEmail(array $leadData, $pdo = null) {
    $mailer = new FirstCapitalMailer();
    if (!$mailer->isConfigured()) {
        return ['success' => false, 'skipped' => true, 'reason' => 'SMTP not configured in .env'];
    }

    $name = htmlspecialchars($leadData['name'] ?? 'Anonymous Investor');
    $email = htmlspecialchars($leadData['email'] ?? 'N/A');
    $phone = htmlspecialchars($leadData['phone'] ?? 'N/A');
    $gender = ucfirst(htmlspecialchars($leadData['gender'] ?? 'Not specified'));
    $profileCode = htmlspecialchars($leadData['profileKey'] ?? $leadData['resultCode'] ?? 'A');
    $profileName = htmlspecialchars($leadData['profileName'] ?? $leadData['resultProfile'] ?? 'Investor');
    $matchedProduct = htmlspecialchars($leadData['matchedProduct'] ?? 'First Capital Investment Fund');
    $source = htmlspecialchars($leadData['source'] ?? 'Landing Page Quiz');
    $leadId = htmlspecialchars((string)($leadData['id'] ?? ('FC-' . time())));
    $date = date('Y-m-d H:i:s T');

    // Load quiz questions to map answers to actual question and option text
    $questions = [];
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("SELECT setting_value FROM app_settings WHERE setting_key = 'quiz_questions' LIMIT 1");
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($row && !empty($row['setting_value'])) {
                $dec = json_decode($row['setting_value'], true);
                if (is_array($dec)) $questions = $dec;
            }
        } catch (Throwable $e) {}
    }
    if (empty($questions) && function_exists('getDefaultQuizQuestions')) {
        $questions = getDefaultQuizQuestions();
    }

    // Map questions by ID
    $qMap = [];
    foreach ($questions as $q) {
        $qid = (int)($q['id'] ?? 0);
        if ($qid > 0) {
            $qMap[$qid] = $q;
        }
    }

    // Parse answers
    $answers = $leadData['answers'] ?? [];
    if (is_string($answers)) {
        $answers = json_decode($answers, true) ?: [];
    }

    // Build Quiz Answers HTML Rows
    $answersHtml = '';
    $answersText = '';
    for ($i = 1; $i <= 7; $i++) {
        $userKey = strtoupper(trim((string)($answers[$i] ?? $answers[(string)$i] ?? 'N/A')));
        $qData = $qMap[$i] ?? null;
        $qText = $qData['question'] ?? "Question $i";
        
        $optText = 'No answer provided';
        if ($qData && !empty($qData['options'])) {
            foreach ($qData['options'] as $opt) {
                if (strtoupper($opt['key'] ?? '') === $userKey) {
                    $optText = $opt['text'] ?? '';
                    break;
                }
            }
        }

        $answersHtml .= "
        <tr style='border-bottom: 1px solid #e2e8f0;'>
            <td style='padding: 12px 14px; font-weight: 700; color: #1a214c; vertical-align: top; width: 45px; font-size: 13px;'>Q{$i}</td>
            <td style='padding: 12px 14px; color: #334155; vertical-align: top;'>
                <div style='font-weight: 600; font-size: 13px; margin-bottom: 4px; color: #0f172a;'>{$qText}</div>
                <div style='font-size: 13px; color: #1e293b; background: #f8fafc; border-left: 3px solid #f1ca1f; padding: 6px 10px; border-radius: 4px;'>
                    <strong style='color: #1a214c;'>[Option {$userKey}]</strong> " . htmlspecialchars($optText) . "
                </div>
            </td>
        </tr>";

        $answersText .= "Q{$i}: {$qText}\nSelected: [{$userKey}] {$optText}\n\n";
    }

    $subject = "🎯 New Investor Quiz Lead: {$name} ({$profileName}) - Ref: {$leadId}";

    $htmlBody = "
    <!DOCTYPE html>
    <html lang='en'>
    <head>
        <meta charset='utf-8'>
        <title>New Quiz Lead</title>
    </head>
    <body style='margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #1e293b;'>
        <table width='100%' cellpadding='0' cellspacing='0' style='background-color: #f1f5f9; padding: 24px 0;'>
            <tr>
                <td align='center'>
                    <table width='640' cellpadding='0' cellspacing='0' style='max-width: 640px; width: 100%; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;'>
                        
                        <!-- Header Banner -->
                        <tr>
                            <td style='background-color: #1a214c; padding: 28px 32px; text-align: left; border-bottom: 4px solid #f1ca1f;'>
                                <table width='100%' cellpadding='0' cellspacing='0' border='0'>
                                    <tr>
                                        <td>
                                            <div style='font-size: 11px; text-transform: uppercase; font-weight: 800; letter-spacing: 1.5px; color: #f1ca1f; margin-bottom: 4px;'>First Capital Investor Week</div>
                                            <h1 style='margin: 0; font-size: 24px; font-weight: 800; color: #ffffff;'>New Investor Quiz Submission</h1>
                                        </td>
                                        <td align='right' style='vertical-align: middle;'>
                                            <span style='background: #f1ca1f; color: #1a214c; font-weight: 800; font-size: 12px; padding: 6px 12px; border-radius: 20px; text-transform: uppercase;'>{$leadId}</span>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Final Result Highlight Box -->
                        <tr>
                            <td style='padding: 24px 32px 12px 32px;'>
                                <div style='background: linear-gradient(135deg, #1a214c 0%, #252f6b 100%); border-radius: 12px; padding: 20px; color: #ffffff;'>
                                    <div style='font-size: 11px; text-transform: uppercase; font-weight: 700; color: #f1ca1f; letter-spacing: 1px;'>Final Quiz Result</div>
                                    <h2 style='margin: 4px 0 8px 0; font-size: 22px; font-weight: 800; color: #ffffff;'>{$profileName}</h2>
                                    <div style='display: inline-block; background: rgba(241, 202, 31, 0.2); border: 1px solid #f1ca1f; color: #f1ca1f; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; margin-bottom: 12px;'>
                                        Profile Type {$profileCode}
                                    </div>
                                    <div style='font-size: 13px; color: #e2e8f0; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 10px;'>
                                        <strong style='color: #ffffff;'>Suggested Match:</strong> {$matchedProduct}
                                    </div>
                                </div>
                            </td>
                        </tr>

                        <!-- User Contact Details Section -->
                        <tr>
                            <td style='padding: 12px 32px;'>
                                <h3 style='margin: 0 0 12px 0; font-size: 16px; font-weight: 800; color: #1a214c; text-transform: uppercase; letter-spacing: 0.5px;'>
                                    👤 Investor Contact Details
                                </h3>
                                <table width='100%' cellpadding='0' cellspacing='0' style='border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; font-size: 14px;'>
                                    <tr style='background: #f8fafc; border-bottom: 1px solid #e2e8f0;'>
                                        <td style='padding: 10px 14px; font-weight: 700; color: #475569; width: 140px;'>Full Name</td>
                                        <td style='padding: 10px 14px; font-weight: 700; color: #0f172a;'>{$name}</td>
                                    </tr>
                                    <tr style='border-bottom: 1px solid #e2e8f0;'>
                                        <td style='padding: 10px 14px; font-weight: 700; color: #475569;'>Email Address</td>
                                        <td style='padding: 10px 14px;'><a href='mailto:{$email}' style='color: #1a214c; font-weight: 600; text-decoration: underline;'>{$email}</a></td>
                                    </tr>
                                    <tr style='background: #f8fafc; border-bottom: 1px solid #e2e8f0;'>
                                        <td style='padding: 10px 14px; font-weight: 700; color: #475569;'>Phone Number</td>
                                        <td style='padding: 10px 14px;'><a href='tel:{$phone}' style='color: #1a214c; font-weight: 700; text-decoration: none;'>{$phone}</a></td>
                                    </tr>
                                    <tr style='border-bottom: 1px solid #e2e8f0;'>
                                        <td style='padding: 10px 14px; font-weight: 700; color: #475569;'>Gender</td>
                                        <td style='padding: 10px 14px; color: #0f172a;'>{$gender}</td>
                                    </tr>
                                    <tr style='background: #f8fafc; border-bottom: 1px solid #e2e8f0;'>
                                        <td style='padding: 10px 14px; font-weight: 700; color: #475569;'>Submission Source</td>
                                        <td style='padding: 10px 14px; color: #0f172a;'>{$source}</td>
                                    </tr>
                                    <tr>
                                        <td style='padding: 10px 14px; font-weight: 700; color: #475569;'>Submitted At</td>
                                        <td style='padding: 10px 14px; color: #64748b;'>{$date}</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Detailed Quiz Answers -->
                        <tr>
                            <td style='padding: 16px 32px 24px 32px;'>
                                <h3 style='margin: 0 0 12px 0; font-size: 16px; font-weight: 800; color: #1a214c; text-transform: uppercase; letter-spacing: 0.5px;'>
                                    📋 Quiz Answers Breakdown (7 Questions)
                                </h3>
                                <table width='100%' cellpadding='0' cellspacing='0' style='border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; border-collapse: collapse;'>
                                    {$answersHtml}
                                </table>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style='background: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b;'>
                                <p style='margin: 0;'>This notification was sent automatically by the <strong>First Capital Investor Week</strong> platform.</p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>";

    $textBody = "NEW INVESTOR QUIZ LEAD - First Capital\n" .
                "Ref: {$leadId}\n" .
                "Date: {$date}\n\n" .
                "--- USER DETAILS ---\n" .
                "Name: {$name}\n" .
                "Email: {$email}\n" .
                "Phone: {$phone}\n" .
                "Gender: {$gender}\n" .
                "Source: {$source}\n\n" .
                "--- FINAL RESULT ---\n" .
                "Profile: {$profileName} (Type {$profileCode})\n" .
                "Matched Product: {$matchedProduct}\n\n" .
                "--- QUIZ ANSWERS BREAKDOWN ---\n" .
                $answersText;

    // Send email with Reply-To set to the user's email address
    $replyToEmail = (filter_var($leadData['email'] ?? '', FILTER_VALIDATE_EMAIL)) ? $leadData['email'] : null;
    return $mailer->send(null, $subject, $htmlBody, $textBody, $replyToEmail);
}

// Direct CLI diagnostic or Web ?test=1 diagnostic
if (php_sapi_name() === 'cli' && isset($argv[0]) && realpath($argv[0]) === realpath(__FILE__)) {
    $m = new FirstCapitalMailer();
    echo "\n=== First Capital SMTP Diagnostic ===\n";
    echo json_encode($m->diagnose(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n\n";
} elseif (isset($_GET['test']) && $_GET['test'] === '1') {
    header('Content-Type: application/json; charset=utf-8');
    $m = new FirstCapitalMailer();
    echo json_encode($m->diagnose(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}
