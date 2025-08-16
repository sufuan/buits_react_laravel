<?php

namespace App\DTOs;

class ImportPreviewDTO
{
    public array $rows;
    public array $errors;
    public array $statistics;

    public function __construct(array $rows, array $errors, array $statistics)
    {
        $this->rows = $rows;
        $this->errors = $errors;
        $this->statistics = $statistics;
    }

    /**
     * Convert to array for JSON response
     */
    public function toArray(): array
    {
        // Extract column names from the first row if available
        $columns = [];
        if (!empty($this->rows)) {
            $firstRow = $this->rows[0];
            $columns = array_map(function($key) {
                return [
                    'key' => $key,
                    'label' => ucwords(str_replace('_', ' ', $key))
                ];
            }, array_keys($firstRow));
        }

        return [
            'rows' => $this->rows,
            'columns' => $columns,
            'errors' => array_map(function($error) {
                if ($error instanceof ValidationErrorDTO) {
                    return $error->toArray();
                }
                return $error;
            }, $this->errors),
            'statistics' => $this->statistics
        ];
    }

    /**
     * Get only valid rows (rows without errors)
     */
    public function getValidRows(): array
    {
        $errorRowNumbers = array_unique(array_map(function($error) {
            return $error instanceof ValidationErrorDTO ? $error->row : ($error['row'] ?? 0);
        }, $this->errors));

        return array_filter($this->rows, function($row) use ($errorRowNumbers) {
            $rowNumber = $row['row_number'] ?? $row['row_id'] ?? 0;
            return !in_array($rowNumber, $errorRowNumbers);
        });
    }

    /**
     * Get rows with errors
     */
    public function getErrorRows(): array
    {
        $errorRowNumbers = array_unique(array_map(function($error) {
            return $error instanceof ValidationErrorDTO ? $error->row : ($error['row'] ?? 0);
        }, $this->errors));

        return array_filter($this->rows, function($row) use ($errorRowNumbers) {
            $rowNumber = $row['row_number'] ?? $row['row_id'] ?? 0;
            return in_array($rowNumber, $errorRowNumbers);
        });
    }

    /**
     * Group errors by row
     */
    public function getErrorsByRow(): array
    {
        $groupedErrors = [];
        
        foreach ($this->errors as $error) {
            $rowNumber = $error instanceof ValidationErrorDTO ? $error->row : ($error['row'] ?? 0);
            
            if (!isset($groupedErrors[$rowNumber])) {
                $groupedErrors[$rowNumber] = [];
            }
            
            $groupedErrors[$rowNumber][] = $error;
        }
        
        return $groupedErrors;
    }

    /**
     * Check if import is valid (no errors)
     */
    public function isValid(): bool
    {
        return empty($this->errors);
    }

    /**
     * Get summary message
     */
    public function getSummaryMessage(): string
    {
        if ($this->isValid()) {
            return "All {$this->statistics['total_rows']} rows are valid and ready for import.";
        }
        
        return "Found {$this->statistics['total_errors']} error(s) in {$this->statistics['error_rows']} row(s). " .
               "{$this->statistics['valid_rows']} row(s) are valid.";
    }
}