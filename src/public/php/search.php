<?php

declare(strict_types=1);
require_once __DIR__ . '../../../lib/quit.php';

// Main
if (empty($_POST['q'])) {
    Quit::error(400);
} elseif (empty($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
    Quit::error(401);
}

require_once __DIR__ . '../../../lib/request.php';

$request = new Request();
$response = $request->get('hn.algolia.com/api/v1/search?tags=story&' . http_build_query(['query' => $_POST['q']]));

header('Content-Type: application/json; charset=utf-8');
echo $response;
