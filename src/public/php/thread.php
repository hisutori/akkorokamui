<?php

declare(strict_types=1);
require_once __DIR__ . '../../../lib/quit.php';

// Main
if (empty($thread = $_POST['t']) || !filter_var($thread, FILTER_VALIDATE_INT)) {
    Quit::error(400);
} elseif (empty($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
    Quit::error(401);
}

require_once __DIR__ . '../../../lib/apcu.php';

$apcu = new APCU("akkorokamui-$thread");
$data = $apcu->fetch();

if (!$data) {
    require_once __DIR__ . '../../../lib/request.php';

    $request = new Request();
    $response = $request->get("api.hnpwa.com/v0/item/$thread.json");

    $data = $response;
    $apcu->store($data);
}

header('Content-Type: application/json; charset=utf-8');
echo $data;
