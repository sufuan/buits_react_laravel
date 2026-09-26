import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Tag, ArrowLeft, Save, Eye, Upload, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function TicketingEventsCreate() {
    const [formSchema, setFormSchema] = useState([]);

    const { data, setData, post, processing, errors, transform } = useForm({
        title: '',
        slug: '',
        fee: '',
        deadline: '',
        status: 'active',
        event_html_content: '',
        html_file: null,
        form_schema: '',
    });

    // Auto-generate slug from title
    const handleTitleChange = (e) => {
        const title = e.target.value;
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
        
        setData(prev => ({
            ...prev,
            title,
            slug
        }));
    };

    // Handle form schema updates
    const updateFormSchema = (newSchema) => {
        setFormSchema(newSchema);
        setData('form_schema', JSON.stringify(newSchema));
    };

    const addFormField = () => {
        const newField = {
            id: Date.now().toString(),
            type: 'text',
            label: '',
            name: '',
            required: false,
            placeholder: '',
            options: []
        };
        updateFormSchema([...formSchema, newField]);
    };

    const updateFormField = (index, field) => {
        const updated = [...formSchema];
        updated[index] = field;
        updateFormSchema(updated);
    };

    const removeFormField = (index) => {
        const updated = formSchema.filter((_, i) => i !== index);
        updateFormSchema(updated);
    };

    // Handle file upload
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('html_file', file);
        }
    };

    // Transform data before submission
    transform((data) => {
        const formData = new FormData();
        
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== '') {
                if (key === 'html_file' && data[key] instanceof File) {
                    formData.append(key, data[key]);
                } else {
                    formData.append(key, data[key]);
                }
            }
        });

        return formData;
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.ticketing-events.store'), {
            forceFormData: true,
        });
    };

    const handlePreview = () => {
        // Create FormData manually for AJAX request
        const formData = new FormData();
        
        Object.keys(data).forEach(key => {
            if (data[key] !== null && data[key] !== '') {
                if (key === 'html_file' && data[key] instanceof File) {
                    formData.append(key, data[key]);
                } else {
                    formData.append(key, data[key]);
                }
            }
        });

        // Make AJAX request to preview endpoint
        fetch(route('admin.ticketing-events.preview'), {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.preview_url) {
                window.open(data.preview_url, '_blank');
            }
        })
        .catch(error => {
            console.error('Preview error:', error);
            alert('Preview failed. Please try again.');
        });
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={route('admin.ticketing-events.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-xl opacity-50 animate-pulse"></div>
                                <Tag className="relative h-8 w-8 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Create Ticketing Event
                                </h2>
                                <p className="text-sm text-gray-500">Set up a new event with custom registration forms</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handlePreview}
                            disabled={processing || !data.title}
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                        </Button>
                        <Button
                            type="submit"
                            form="event-form"
                            disabled={processing}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {processing ? 'Creating...' : 'Create Event'}
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title="Create Ticketing Event" />

            <div className="p-6 max-w-6xl mx-auto">
                <form id="event-form" onSubmit={handleSubmit}>
                    <Tabs defaultValue="basic" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="basic">Basic Info</TabsTrigger>
                            <TabsTrigger value="content">Event Content</TabsTrigger>
                            <TabsTrigger value="form">Registration Form</TabsTrigger>
                        </TabsList>

                        {/* Basic Information Tab */}
                        <TabsContent value="basic" className="space-y-6">
                            <Card className="border-0 shadow-lg">
                                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                                    <CardTitle>Event Details</CardTitle>
                                    <CardDescription>
                                        Basic information about your ticketing event
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Event Title *</Label>
                                            <Input
                                                id="title"
                                                value={data.title}
                                                onChange={handleTitleChange}
                                                placeholder="Enter event title"
                                                className={errors.title ? 'border-red-500' : ''}
                                            />
                                            {errors.title && (
                                                <Alert className="border-red-200 bg-red-50 mt-2">
                                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                                    <AlertDescription className="text-red-800">
                                                        {errors.title}
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="slug">URL Slug *</Label>
                                            <Input
                                                id="slug"
                                                value={data.slug}
                                                onChange={(e) => setData('slug', e.target.value)}
                                                placeholder="event-url-slug"
                                                className={errors.slug ? 'border-red-500' : ''}
                                            />
                                            {data.slug && (
                                                <p className="text-sm text-gray-500">
                                                    Event URL: /t/{data.slug}
                                                </p>
                                            )}
                                            {errors.slug && (
                                                <Alert className="border-red-200 bg-red-50 mt-2">
                                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                                    <AlertDescription className="text-red-800">
                                                        {errors.slug}
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="fee">Registration Fee</Label>
                                            <Input
                                                id="fee"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.fee}
                                                onChange={(e) => setData('fee', e.target.value)}
                                                placeholder="0.00 (leave empty for free)"
                                                className={errors.fee ? 'border-red-500' : ''}
                                            />
                                            {errors.fee && (
                                                <Alert className="border-red-200 bg-red-50 mt-2">
                                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                                    <AlertDescription className="text-red-800">
                                                        {errors.fee}
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="deadline">Registration Deadline</Label>
                                            <Input
                                                id="deadline"
                                                type="datetime-local"
                                                value={data.deadline}
                                                onChange={(e) => setData('deadline', e.target.value)}
                                                className={errors.deadline ? 'border-red-500' : ''}
                                            />
                                            {errors.deadline && (
                                                <Alert className="border-red-200 bg-red-50 mt-2">
                                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                                    <AlertDescription className="text-red-800">
                                                        {errors.deadline}
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="closed">Closed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Event Content Tab */}
                        <TabsContent value="content" className="space-y-6">
                            <Card className="border-0 shadow-lg">
                                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                                    <CardTitle>Event Content</CardTitle>
                                    <CardDescription>
                                        Custom HTML content for your event page
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="space-y-2 flex-1">
                                                <Label htmlFor="html_file">Upload HTML File</Label>
                                                <Input
                                                    id="html_file"
                                                    type="file"
                                                    accept=".html,.txt"
                                                    onChange={handleFileUpload}
                                                    className={errors.html_file ? 'border-red-500' : ''}
                                                />
                                                {errors.html_file && (
                                                    <Alert className="border-red-200 bg-red-50 mt-2">
                                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                                        <AlertDescription className="text-red-800">
                                                            {errors.html_file}
                                                        </AlertDescription>
                                                    </Alert>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-500 text-center px-4">
                                                OR
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="event_html_content">Direct HTML Content</Label>
                                            <Textarea
                                                id="event_html_content"
                                                rows={15}
                                                value={data.event_html_content}
                                                onChange={(e) => setData('event_html_content', e.target.value)}
                                                placeholder="Enter your custom HTML content here..."
                                                className="font-mono text-sm"
                                            />
                                            <p className="text-sm text-gray-500">
                                                You can include custom HTML, CSS, and basic JavaScript. This will be displayed on the public event page.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Registration Form Tab */}
                        <TabsContent value="form" className="space-y-6">
                            <Card className="border-0 shadow-lg">
                                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                                    <CardTitle className="flex items-center justify-between">
                                        Registration Form Builder
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addFormField}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Field
                                        </Button>
                                    </CardTitle>
                                    <CardDescription>
                                        Create custom fields for event registration
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    {formSchema.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500 mb-4">No custom fields added yet.</p>
                                            <Button type="button" variant="outline" onClick={addFormField}>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add First Field
                                            </Button>
                                        </div>
                                    ) : (
                                        formSchema.map((field, index) => (
                                            <div key={field.id} className="border rounded-lg p-4 space-y-4 bg-gray-50">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium">Field {index + 1}</h4>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeFormField(index)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Field Type</Label>
                                                        <Select
                                                            value={field.type}
                                                            onValueChange={(value) => updateFormField(index, { ...field, type: value })}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="text">Text</SelectItem>
                                                                <SelectItem value="email">Email</SelectItem>
                                                                <SelectItem value="phone">Phone</SelectItem>
                                                                <SelectItem value="textarea">Textarea</SelectItem>
                                                                <SelectItem value="select">Dropdown</SelectItem>
                                                                <SelectItem value="radio">Radio Buttons</SelectItem>
                                                                <SelectItem value="checkbox">Checkbox</SelectItem>
                                                                <SelectItem value="date">Date</SelectItem>
                                                                <SelectItem value="number">Number</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Field Label</Label>
                                                        <Input
                                                            value={field.label}
                                                            onChange={(e) => updateFormField(index, { ...field, label: e.target.value })}
                                                            placeholder="Enter field label"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Field Name</Label>
                                                        <Input
                                                            value={field.name}
                                                            onChange={(e) => updateFormField(index, { ...field, name: e.target.value })}
                                                            placeholder="field_name"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Placeholder</Label>
                                                        <Input
                                                            value={field.placeholder}
                                                            onChange={(e) => updateFormField(index, { ...field, placeholder: e.target.value })}
                                                            placeholder="Enter placeholder text"
                                                        />
                                                    </div>

                                                    <div className="flex items-center space-x-2 pt-8">
                                                        <input
                                                            type="checkbox"
                                                            id={`required-${field.id}`}
                                                            checked={field.required}
                                                            onChange={(e) => updateFormField(index, { ...field, required: e.target.checked })}
                                                            className="rounded border-gray-300"
                                                        />
                                                        <Label htmlFor={`required-${field.id}`}>Required Field</Label>
                                                    </div>
                                                </div>

                                                {(field.type === 'select' || field.type === 'radio') && (
                                                    <div className="space-y-2">
                                                        <Label>Options (one per line)</Label>
                                                        <Textarea
                                                            rows={4}
                                                            value={field.options?.join('\n') || ''}
                                                            onChange={(e) => updateFormField(index, { 
                                                                ...field, 
                                                                options: e.target.value.split('\n').filter(opt => opt.trim()) 
                                                            })}
                                                            placeholder="Option 1\nOption 2\nOption 3"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}

                                    {formSchema.length > 0 && (
                                        <div className="pt-4 border-t">
                                            <p className="text-sm text-gray-600">
                                                Default fields (Name, Email, Phone) are automatically included in all registration forms.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </form>
            </div>
        </AdminAuthenticatedLayout>
    );
}