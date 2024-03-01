<?php

declare(strict_types=1);

final readonly class APCU
{
    // Properties
    private bool $apcu_enabled;
    private string $name;

    // Constructor
    public function __construct(string $name)
    {
        $this->apcu_enabled = function_exists('apcu_enabled') && apcu_enabled();
        $this->name = $name;
    }

    // Public methods
    public function fetch(): mixed
    {
        if ($this->apcu_enabled && apcu_exists($this->name)) {
            return apcu_fetch($this->name);
        }

        return false;
    }

    public function store(string $object, int $time = 120): bool
    {
        return $this->apcu_enabled && apcu_store($this->name, $object, $time);
    }
}
