import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Building2 } from 'lucide-react';

export default function Edit({ designation, designations }) {
    const { data, setData, put, processing, errors } = useForm({
        name: designation.name || '',
        level: designation.level || '',
        parent_id: designation.parent_id || '',
        is_active: designation.is_active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.admin.designations.update', designation.id));
    };

    // Group existing designations for parent selection (exclude self and descendants)
    const availableParents = designations.filter(d => 
        d.id !== designation.id && 
        d.level < 3 && 
        d.level < data.level
    );

    return (
        <AdminAuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="sm">
                        <a href={route('admin.admin.designations.index')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Designations
                        </a>
                    </Button>
                    <h2 className="text-3xl font-bold tracking-tight">Edit Designation</h2>
                </div>
            }
        >
            <Head title={`Edit ${designation.name}`} />

            <div className="max-w-2xl space-y-6">
                {/* Current Designation Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Current Designation
                        </CardTitle>
                        <CardDescription>
                            Editing: {designation.name} (Level {designation.level})
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="font-medium text-muted-foreground">Created</p>
                                <p>{new Date(designation.created_at).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="font-medium text-muted-foreground">Last Modified</p>
                                <p>{new Date(designation.updated_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Edit Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Designation Details</CardTitle>
                        <CardDescription>
                            Update the information for this executive position
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Designation Name *</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g., President, Vice President (Admin), General Secretary"
                                    className={errors.name ? 'border-destructive' : ''}
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name}</p>
                                )}
                            </div>

                            {/* Position Type */}
                            <div className="space-y-2">
                                <Label htmlFor="level">Position Type *</Label>
                                <Select value={data.level.toString()} onValueChange={(value) => setData('level', parseInt(value))}>
                                    <SelectTrigger className={errors.level ? 'border-destructive' : ''}>
                                        <SelectValue placeholder="Select position type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Executive Leadership (President, Vice Presidents)</SelectItem>
                                        <SelectItem value="2">Administrative Leadership (General Secretary)</SelectItem>
                                        <SelectItem value="3">Department Secretary</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p><strong>Executive Leadership:</strong> President, Vice Presidents</p>
                                    <p><strong>Administrative Leadership:</strong> General Secretary, Additional General Secretary</p>
                                    <p><strong>Department Secretary:</strong> All department secretaries and joint secretaries</p>
                                </div>
                                {errors.level && (
                                    <p className="text-sm text-destructive">{errors.level}</p>
                                )}
                            </div>

                            {/* Parent (if applicable) */}
                            {data.level > 1 && (
                                <div className="space-y-2">
                                    <Label htmlFor="parent_id">Reports To (Parent Position)</Label>
                                    <Select value={data.parent_id?.toString() || 'none'} onValueChange={(value) => setData('parent_id', value === 'none' ? null : value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select parent position (optional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">No Parent</SelectItem>
                                            {availableParents.map((parent) => (
                                                <SelectItem key={parent.id} value={parent.id.toString()}>
                                                    {parent.name} (Level {parent.level})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.parent_id && (
                                        <p className="text-sm text-destructive">{errors.parent_id}</p>
                                    )}
                                </div>
                            )}

                            {/* Active Status */}
                            <div className="flex items-center space-x-3">
                                <Switch
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked)}
                                />
                                <Label htmlFor="is_active" className="flex flex-col">
                                    <span>Active Status</span>
                                    <span className="text-sm text-muted-foreground">
                                        Only active designations can be assigned to users
                                    </span>
                                </Label>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex items-center gap-4 pt-4">
                                <Button type="submit" disabled={processing}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Updating...' : 'Update Designation'}
                                </Button>
                                <Button asChild type="button" variant="outline">
                                    <a href={route('admin.admin.designations.index')}>
                                        Cancel
                                    </a>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
