<?php

declare(strict_types=1);
require_once __DIR__ . '../../../lib/quit.php';

// Main
if (empty($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
    Quit::error(401);
}

require_once __DIR__ . '../../../lib/apcu.php';

$apcu = new APCU('akkorokamui-overview');
$data = $apcu->fetch();

if (!$data) {
    require_once __DIR__ . '../../../lib/request.php';

    $request = new Request();
    $response = $request->get('hckrnews.com/data/latest.js');

    $json = json_decode(substr($response, 15), true);

    if (!$json) {
        Quit::error(523);
    }

    $i = 0;
    $threads = [];

    while ($json[$i]['date'] > strtotime('-12 hours')) {
        $thread = $json[$i];

        if ($thread['dead'] === true) {
            $i++;
            continue;
        }

        unset($thread['type']);
        unset($thread['time']);
        unset($thread['submitter']);
        unset($thread['homepage']);
        unset($thread['last_update']);
        unset($thread['dead']);
        unset($thread['source']);

        $threads[] = $thread;

        $i++;
    }

    $data = json_encode($threads);
    $apcu->store($data);
}

header('Content-Type: application/json; charset=utf-8');
echo $data;
