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

export default function Create({ designations }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        level: '',
        parent_id: '',
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.admin.designations.store'));
    };

    // Group existing designations for parent selection
    const availableParents = designations.filter(d => d.level < 3); // Level 3 cannot have children

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
                    <h2 className="text-3xl font-bold tracking-tight">Create New Designation</h2>
                </div>
            }
        >
            <Head title="Create Designation" />

            <div className="max-w-2xl space-y-6">
                {/* Hierarchy Guide */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Hierarchy Guide
                        </CardTitle>
                        <CardDescription>
                            Understanding the organizational structure
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <div>
                                    <p className="font-medium">Level 1 - President</p>
                                    <p className="text-sm text-muted-foreground">Supreme executive authority</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                                <div>
                                    <p className="font-medium">Level 2 - Vice Presidents</p>
                                    <p className="text-sm text-muted-foreground">Admin, Technical, Finance divisions</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-muted rounded-full"></div>
                                <div>
                                    <p className="font-medium">Level 3 - Secretaries</p>
                                    <p className="text-sm text-muted-foreground">Departmental operations</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Create Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Designation Details</CardTitle>
                        <CardDescription>
                            Fill in the information for the new executive position
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
                                <Select onValueChange={(value) => setData('level', parseInt(value))}>
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
                                    <Select onValueChange={(value) => setData('parent_id', value === 'none' ? null : value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select parent position (optional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">No Parent</SelectItem>
                                            {availableParents
                                                .filter(p => p.level < data.level)
                                                .map((parent) => (
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
                                    {processing ? 'Creating...' : 'Create Designation'}
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
