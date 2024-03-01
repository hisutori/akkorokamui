<?php

declare(strict_types=1);

final readonly class Quit
{
    // Public methods
    public static function error(int $code): void
    {
        http_response_code($code);
        exit();
    }
}
