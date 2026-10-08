<?php
// Seamless direct inclusion of exported landing page
if (file_exists(__DIR__ . '/index.html')) {
    include __DIR__ . '/index.html';
    exit;
} elseif (file_exists(__DIR__ . '/firstcapitalpages/index.html')) {
    include __DIR__ . '/firstcapitalpages/index.html';
    exit;
} else {
    header("Location: firstcapitalpages/", true, 302);
    exit;
}
