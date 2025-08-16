<?php

namespace App\DTOs;

class ValidationErrorDTO
{
    public int $row;
    public string $column;
    public string $message;
    public string $severity;

    /**
     * Create a new validation error DTO
     * 
     * @param int $row Row number (1-based)
     * @param string $column Column name
     * @param string $message Error message
     * @param string $severity Error severity ('error' or 'warning')
     */
    public function __construct(int $row, string $column, string $message, string $severity = 'error')
    {
        $this->row = $row;
        $this->column = $column;
        $this->message = $message;
        $this->severity = $severity;
    }

    /**
     * Convert to array for JSON response
     */
    public function toArray(): array
    {
        return [
            'row' => $this->row,
            'column' => $this->column,
            'message' => $this->message,
            'severity' => $this->severity
        ];
    }

    /**
     * Create from array
     */
    public static function fromArray(array $data): self
    {
        return new self(
            $data['row'] ?? 0,
            $data['column'] ?? '',
            $data['message'] ?? '',
            $data['severity'] ?? 'error'
        );
    }

    /**
     * Check if this is an error (not a warning)
     */
    public function isError(): bool
    {
        return $this->severity === 'error';
    }

    /**
     * Check if this is a warning
     */
    public function isWarning(): bool
    {
        return $this->severity === 'warning';
    }

    /**
     * Get formatted message with row and column info
     */
    public function getFormattedMessage(): string
    {
        return "Row {$this->row}, Column '{$this->column}': {$this->message}";
    }

    /**
     * Create an error
     */
    public static function error(int $row, string $column, string $message): self
    {
        return new self($row, $column, $message, 'error');
    }

    /**
     * Create a warning
     */
    public static function warning(int $row, string $column, string $message): self
    {
        return new self($row, $column, $message, 'warning');
    }
}