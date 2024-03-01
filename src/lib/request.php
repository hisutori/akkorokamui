<?php

declare(strict_types=1);
require_once 'quit.php';

final class Request
{
    // Constants
    private const AGENTS = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (iPad; CPU OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (iPod touch; CPU iPhone 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (X11; Linux x86_64; rv:122.0) Gecko/20100101 Firefox/122.0'
    ];

    // Properties
    private array $opt = [
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_2TLS,
        CURLOPT_TIMEOUT => 4,
        CURLOPT_HTTPHEADER => [
            'Sec-GPC: 1',
            'DNT: 1',
            'Accept-Language: en-US,en;q=0.9'
        ],
        CURLOPT_ENCODING => '',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSLVERSION => CURL_SSLVERSION_TLSv1_2,
        CURLOPT_SSL_VERIFYHOST => 2,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_TCP_FASTOPEN => true,
        CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4
    ];


    // Private methods
    private function set_opt(CurlHandle $ch, string $url): bool
    {
        $this->opt[CURLOPT_URL] = $url;
        $this->opt[CURLOPT_USERAGENT] = self::AGENTS[array_rand(self::AGENTS)];

        return curl_setopt_array($ch, $this->opt);
    }

    // Public methods
    public function get(string $url): string
    {
        $ch = curl_init();
        $this->set_opt($ch, "https://$url");

        $response = curl_exec($ch);

        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $status = $status === 0 ? 500 : $status;

        if ($status !== 200 || is_bool($response)) {
            Quit::error($status);
        }

        curl_close($ch);

        return $response;
    }
}
