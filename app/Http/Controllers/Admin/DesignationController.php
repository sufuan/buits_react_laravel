<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Designation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DesignationController extends Controller
{
    /**
     * Display a listing of designations.
     */
    public function index()
    {
        $designations = Designation::orderBy('level')->orderBy('name')->get();

        return Inertia::render('Admin/Designations/Index', [
            'designations' => $designations
        ]);
    }

    /**
     * Show the form for creating a new designation.
     */
    public function create()
    {
        return Inertia::render('Admin/Designations/Create');
    }

    /**
     * Store a newly created designation.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'level' => 'required|string|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        Designation::create($request->all());

        return redirect()->route('admin.designations.index')
                        ->with('success', 'Designation created successfully.');
    }

    /**
     * Display the specified designation.
     */
    public function show(Designation $designation)
    {
        return Inertia::render('Admin/Designations/Show', [
            'designation' => $designation
        ]);
    }

    /**
     * Show the form for editing the specified designation.
     */
    public function edit(Designation $designation)
    {
        return Inertia::render('Admin/Designations/Edit', [
            'designation' => $designation
        ]);
    }

    /**
     * Update the specified designation.
     */
    public function update(Request $request, Designation $designation)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'level' => 'required|string|max:255',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $designation->update($request->all());

        return redirect()->route('admin.designations.index')
                        ->with('success', 'Designation updated successfully.');
    }

    /**
     * Remove the specified designation.
     */
    public function destroy(Designation $designation)
    {
        $designation->delete();

        return redirect()->route('admin.designations.index')
                        ->with('success', 'Designation deleted successfully.');
    }
}
