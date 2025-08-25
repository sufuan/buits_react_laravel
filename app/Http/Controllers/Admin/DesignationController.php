<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Designation;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DesignationController extends Controller
{
    /**
     * Display a listing of designations.
     */
    public function index()
    {
        $designations = Designation::withCount('users')->get();
        
        return Inertia::render('Admin/Designations/Index', [
            'designations' => $designations,
        ]);
    }

    /**
     * Show the form for creating a new designation.
     */
    public function create()
    {
        $designations = Designation::orderBy('level')->orderBy('sort_order')->get();

        return Inertia::render('Admin/Designations/Create', [
            'designations' => $designations
        ]);
    }

    /**
     * Store a newly created designation.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:designations',
            'level' => 'required|integer|min:1|max:3',
            'parent_id' => 'nullable|exists:designations,id',
            'is_active' => 'boolean',
        ]);

        $data = $request->all();
        $data['is_active'] = $request->boolean('is_active', true);
        
        // Auto-calculate sort_order based on existing designations at the same level
        $maxSortOrder = Designation::where('level', $data['level'])->max('sort_order') ?? 0;
        $data['sort_order'] = $maxSortOrder + 1;

        Designation::create($data);

        return redirect()->route('admin.admin.designations.index')
                        ->with('success', 'Designation created successfully.');
    }

    /**
     * Display the specified designation.
     */
    public function show(Designation $designation)
    {
        $designation->load(['parent', 'children']);
        
        // Get users assigned to this designation
        $assignedUsers = \App\Models\User::where('designation_id', $designation->id)->get();

        return Inertia::render('Admin/Designations/Show', [
            'designation' => $designation,
            'children' => $designation->children,
            'assignedUsers' => $assignedUsers
        ]);
    }

    /**
     * Show the form for editing the specified designation.
     */
    public function edit(Designation $designation)
    {
        $designations = Designation::where('id', '!=', $designation->id)
            ->orderBy('level')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Admin/Designations/Edit', [
            'designation' => $designation,
            'designations' => $designations
        ]);
    }

    /**
     * Update the specified designation.
     */
    public function update(Request $request, Designation $designation)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:designations,name,' . $designation->id,
            'level' => 'required|integer|min:1|max:3',
            'parent_id' => 'nullable|exists:designations,id',
            'is_active' => 'boolean',
        ]);

        $data = $request->all();
        $data['is_active'] = $request->boolean('is_active', true);
        
        // Keep existing sort_order if level doesn't change, or auto-calculate if level changes
        if ($designation->level != $data['level']) {
            $maxSortOrder = Designation::where('level', $data['level'])->max('sort_order') ?? 0;
            $data['sort_order'] = $maxSortOrder + 1;
        } else {
            $data['sort_order'] = $designation->sort_order; // Keep existing
        }

        $designation->update($data);

        return redirect()->route('admin.admin.designations.index')
                        ->with('success', 'Designation updated successfully.');
    }

    /**
     * Remove the specified designation.
     */
    public function destroy(Designation $designation)
    {
        // Check if designation has assigned users
        $assignedUsers = \App\Models\User::where('designation_id', $designation->id)->count();
        
        if ($assignedUsers > 0) {
            return back()->with('error', 'Cannot delete designation. It is currently assigned to ' . $assignedUsers . ' user(s).');
        }

        // Check if designation has children
        if ($designation->children()->count() > 0) {
            return back()->with('error', 'Cannot delete designation. It has sub-positions that depend on it.');
        }

        $designation->delete();

        return redirect()->route('admin.admin.designations.index')
                        ->with('success', 'Designation deleted successfully.');
    }
}
