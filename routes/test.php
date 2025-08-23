<?php

use Illuminate\Support\Facades\Route;
use App\Models\Designation;

// Temporary test route to check designations
Route::get('/test-designations', function () {
    $designations = Designation::all();
    
    if ($designations->isEmpty()) {
        return response()->json(['message' => 'No designations found in database']);
    }
    
    return response()->json([
        'count' => $designations->count(),
        'designations' => $designations->map(function($d) {
            return [
                'id' => $d->id,
                'name' => $d->name,
                'level' => $d->level,
                'sort_order' => $d->sort_order,
                'is_active' => $d->is_active
            ];
        })
    ]);
});
