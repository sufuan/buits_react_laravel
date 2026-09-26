import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Checkbox } from '@/Components/ui/checkbox';
import { Tag, ArrowLeft, Save, Eye, Upload, AlertCircle, Plus, Trash2, X } from 'lucide-react';
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

    // STEP 5: Auto-generate slug from title
    const handleTitleChange = (e) => {
        const title = e.target.value;
        const slugify = (str) => str.toLowerCase().trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
        
        setData(prev => ({
            ...prev,
            title,
            slug: slugify(title)
        }));
    };

    // STEP 7: Handle form schema updates
    const updateFormSchema = (newSchema) => {
        setFormSchema(newSchema);
        setData('form_schema', JSON.stringify(newSchema));
    };

    const addFormField = () => {
        const newField = {
            id: crypto.randomUUID(),
            type: 'text',
            label: '',
            placeholder: '',
            helpText: '',
            required: false,
            validate: false,
            options: [],
            min: '',
            max: '',
            step: '',
            accept: '',
            maxSize: '',
            rows: '3',
            maxLength: ''
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

    // STEP 6: Handle file upload
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
        // STEP 7: Serialize form schema before submit
        setData('form_schema', JSON.stringify(formSchema));
        post(route('admin.ticketing-events.store'), {
            forceFormData: true,
            onSuccess: () => toast.success('Event created successfully!'),
            onError: () => toast.error('Please fix the errors below.'),
        });
    };

    // STEP 8: Handle preview functionality
    const handlePreview = async () => {
        // Build FormData with current form values
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('slug', data.slug || 'preview');
        formData.append('event_html_content', data.event_html_content);
        formData.append('form_schema', JSON.stringify(formSchema));
        formData.append('fee', data.fee);
        formData.append('deadline', data.deadline);
        if (data.html_file) formData.append('html_file', data.html_file);
        
        try {
            const response = await fetch(route('admin.ticketing-events.preview'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: formData
            });
            
            const result = await response.json();
            if (result.preview_url) {
                window.open(result.preview_url, '_blank');
            }
        } catch (error) {
            console.error('Preview error:', error);
            toast.error('Preview failed. Please try again.');
        }
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
                            {processing ? 'Creating...' : 'Save Event'}
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

                        {/* STEP 5: Basic Information Tab */}
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
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-sm text-gray-500">Public URL:</span>
                                                    <div className="bg-blue-50 border border-blue-200 px-2 py-1 rounded text-sm font-mono text-blue-700">
                                                        {window.location.origin}/t/{data.slug}
                                                    </div>
                                                </div>
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
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">৳</span>
                                                <Input
                                                    id="fee"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={data.fee}
                                                    onChange={(e) => setData('fee', e.target.value)}
                                                    placeholder="0.00 (leave empty for free)"
                                                    className={`pl-8 ${errors.fee ? 'border-red-500' : ''}`}
                                                />
                                            </div>
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

                        {/* STEP 6: Event Content Tab */}
                        <TabsContent value="content" className="space-y-6">
                            <Card className="border-0 shadow-lg">
                                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                                    <CardTitle>Event Content</CardTitle>
                                    <CardDescription>
                                        Custom HTML content for your event page
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <Tabs defaultValue="paste" className="space-y-4">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="paste">Paste HTML Code</TabsTrigger>
                                            <TabsTrigger value="upload">Upload HTML File</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="paste" className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="event_html_content">HTML Content</Label>
                                                <Textarea
                                                    id="event_html_content"
                                                    rows={16}
                                                    value={data.event_html_content}
                                                    onChange={(e) => {
                                                        setData('event_html_content', e.target.value);
                                                        // Clear file when typing in textarea
                                                        if (data.html_file) {
                                                            setData('html_file', null);
                                                            const fileInput = document.getElementById('html_file');
                                                            if (fileInput) fileInput.value = '';
                                                        }
                                                    }}
                                                    placeholder="<!-- Paste your HTML content here -->\n<h2>Event Description</h2>\n<p>Your event description goes here...</p>\n\n<style>\n/* Custom CSS can be included */\n.event-highlight { color: #2563eb; }\n</style>"
                                                    className="font-mono text-sm"
                                                />
                                                <p className="text-sm text-gray-500">
                                                    You can include custom HTML, CSS, and basic JavaScript. This will be displayed on the public event page.
                                                </p>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="upload" className="space-y-4">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="html_file">HTML File</Label>
                                                    <Input
                                                        id="html_file"
                                                        type="file"
                                                        accept=".html,.txt"
                                                        onChange={(e) => {
                                                            handleFileUpload(e);
                                                            // Clear textarea when file is selected
                                                            setData('event_html_content', '');
                                                        }}
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
                                                
                                                {data.html_file && (
                                                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                        <span className="text-sm text-green-800">
                                                            Selected: {data.html_file.name}
                                                        </span>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setData('html_file', null);
                                                                const fileInput = document.getElementById('html_file');
                                                                if (fileInput) fileInput.value = '';
                                                            }}
                                                            className="ml-auto"
                                                        >
                                                            <X className="h-4 w-4" />
                                                            Clear
                                                        </Button>
                                                    </div>
                                                )}

                                                <p className="text-sm text-gray-500">
                                                    Upload an HTML file (max 512KB). Accepted formats: .html, .txt
                                                </p>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* STEP 7: Registration Form Tab */}
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
                                        Create custom fields for event registration (beyond the default fields)
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    {/* Default Fields Display */}
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                            Default Registration Fields
                                            <div className="h-4 w-4 text-gray-400">🔒</div>
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {['Name', 'Email', 'Phone'].map((field) => (
                                                <div key={field} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                                    <span>{field}</span>
                                                    <span className="text-gray-500 text-xs">REQUIRED</span>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-500">These fields are automatically included in all registration forms.</p>
                                    </div>

                                    {/* Custom Fields */}
                                    <div className="space-y-4">
                                        <h4 className="font-medium text-gray-900 border-t pt-4">Custom Fields</h4>
                                        
                                        {formSchema.length === 0 ? (
                                            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                                                <div className="space-y-4">
                                                    <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                                                        <Plus className="h-8 w-8 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-medium text-gray-900 mb-2">No custom fields added yet</p>
                                                        <p className="text-sm text-gray-500 mb-4">Add custom fields to collect additional information from registrants</p>
                                                        <Button type="button" onClick={addFormField} className="bg-blue-600 hover:bg-blue-700">
                                                            <Plus className="h-4 w-4 mr-2" />
                                                            Add Your First Field
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                {formSchema.map((field, index) => (
                                                    <Card key={field.id} className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                                                        <CardContent className="p-6">
                                                            {/* Field Header */}
                                                            <div className="flex items-center justify-between mb-6">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold text-sm">
                                                                        {index + 1}
                                                                    </div>
                                                                    <div>
                                                                        <h5 className="font-semibold text-gray-900">
                                                                            {field.label || `Field ${index + 1}`}
                                                                        </h5>
                                                                        <p className="text-sm text-gray-500 capitalize">
                                                                            {field.type === 'datetime-local' ? 'Date & Time' : field.type.replace('-', ' ')} Field
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => removeFormField(index)}
                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>

                                                            {/* Field Configuration */}
                                                            <div className="space-y-6">
                                                                {/* Basic Configuration */}
                                                                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                                                                    <h6 className="text-sm font-medium text-gray-700 uppercase tracking-wide">Basic Configuration</h6>
                                                                    
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        <div className="space-y-2">
                                                                            <Label className="text-sm font-medium">Field Type</Label>
                                                                            <Select
                                                                                value={field.type}
                                                                                onValueChange={(value) => updateFormField(index, { ...field, type: value })}
                                                                            >
                                                                                <SelectTrigger className="w-full bg-white">
                                                                                    <SelectValue />
                                                                                </SelectTrigger>
                                                                                <SelectContent className="max-h-64 overflow-y-auto">
                                                                                    <SelectItem value="text">Text Input</SelectItem>
                                                                                    <SelectItem value="email">Email Address</SelectItem>
                                                                                    <SelectItem value="tel">Phone Number</SelectItem>
                                                                                    <SelectItem value="number">Number</SelectItem>
                                                                                    <SelectItem value="date">Date Picker</SelectItem>
                                                                                    <SelectItem value="time">Time Picker</SelectItem>
                                                                                    <SelectItem value="datetime-local">Date & Time</SelectItem>
                                                                                    <SelectItem value="select">Dropdown Select</SelectItem>
                                                                                    <SelectItem value="radio">Radio Buttons</SelectItem>
                                                                                    <SelectItem value="checkbox">Multiple Choice</SelectItem>
                                                                                    <SelectItem value="textarea">Long Text</SelectItem>
                                                                                    <SelectItem value="file">File Upload</SelectItem>
                                                                                    <SelectItem value="url">Website URL</SelectItem>
                                                                                    <SelectItem value="password">Password</SelectItem>
                                                                                    <SelectItem value="range">Range Slider</SelectItem>
                                                                                    <SelectItem value="color">Color Picker</SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </div>

                                                                        <div className="space-y-2">
                                                                            <Label className="text-sm font-medium">Field Label</Label>
                                                                            <Input
                                                                                value={field.label}
                                                                                onChange={(e) => updateFormField(index, { ...field, label: e.target.value })}
                                                                                placeholder="e.g. Department, Student ID, T-Shirt Size"
                                                                                className="w-full"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        <div className="space-y-2">
                                                                            <Label className="text-sm font-medium">Placeholder Text</Label>
                                                                            <Input
                                                                                value={field.placeholder || ''}
                                                                                onChange={(e) => updateFormField(index, { ...field, placeholder: e.target.value })}
                                                                                placeholder="Text shown inside the field"
                                                                                className="w-full"
                                                                            />
                                                                        </div>

                                                                        <div className="space-y-2">
                                                                            <Label className="text-sm font-medium">Help Text</Label>
                                                                            <Input
                                                                                value={field.helpText || ''}
                                                                                onChange={(e) => updateFormField(index, { ...field, helpText: e.target.value })}
                                                                                placeholder="Additional guidance for users"
                                                                                className="w-full"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Validation Settings */}
                                                                <div className="bg-amber-50 rounded-lg p-4">
                                                                    <h6 className="text-sm font-medium text-amber-800 mb-3 uppercase tracking-wide">Validation Settings</h6>
                                                                    <div className="flex flex-wrap gap-4">
                                                                        <div className="flex items-center space-x-3">
                                                                            <input
                                                                                type="checkbox"
                                                                                id={`required-${field.id}`}
                                                                                checked={field.required || false}
                                                                                onChange={(e) => updateFormField(index, { ...field, required: e.target.checked })}
                                                                                className="rounded border-gray-300"
                                                                            />
                                                                            <Label htmlFor={`required-${field.id}`} className="text-sm font-medium text-amber-700">
                                                                                Required Field
                                                                            </Label>
                                                                        </div>
                                                                        <div className="flex items-center space-x-3">
                                                                            <input
                                                                                type="checkbox"
                                                                                id={`validate-${field.id}`}
                                                                                checked={field.validate || false}
                                                                                onChange={(e) => updateFormField(index, { ...field, validate: e.target.checked })}
                                                                                className="rounded border-gray-300"
                                                                            />
                                                                            <Label htmlFor={`validate-${field.id}`} className="text-sm font-medium text-amber-700">
                                                                                Enable Validation
                                                                            </Label>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                        {/* Field-specific options */}
                                                                {/* Advanced Configuration for specific field types */}
                                                                {(field.type === 'number' || field.type === 'range') && (
                                                                    <div className="bg-blue-50 rounded-lg p-4">
                                                                        <h6 className="text-sm font-medium text-blue-800 mb-3 uppercase tracking-wide">Number Settings</h6>
                                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                            <div className="space-y-2">
                                                                                <Label className="text-sm font-medium text-blue-700">Minimum Value</Label>
                                                                                <Input
                                                                                    type="number"
                                                                                    value={field.min || ''}
                                                                                    onChange={(e) => updateFormField(index, { ...field, min: e.target.value })}
                                                                                    placeholder="0"
                                                                                    className="bg-white"
                                                                                />
                                                                            </div>
                                                                            <div className="space-y-2">
                                                                                <Label className="text-sm font-medium text-blue-700">Maximum Value</Label>
                                                                                <Input
                                                                                    type="number"
                                                                                    value={field.max || ''}
                                                                                    onChange={(e) => updateFormField(index, { ...field, max: e.target.value })}
                                                                                    placeholder="100"
                                                                                    className="bg-white"
                                                                                />
                                                                            </div>
                                                                            <div className="space-y-2">
                                                                                <Label className="text-sm font-medium text-blue-700">Step Increment</Label>
                                                                                <Input
                                                                                    type="number"
                                                                                    value={field.step || ''}
                                                                                    onChange={(e) => updateFormField(index, { ...field, step: e.target.value })}
                                                                                    placeholder="1"
                                                                                    className="bg-white"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {field.type === 'file' && (
                                                                    <div className="bg-green-50 rounded-lg p-4">
                                                                        <h6 className="text-sm font-medium text-green-800 mb-3 uppercase tracking-wide">File Upload Settings</h6>
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                            <div className="space-y-2">
                                                                                <Label className="text-sm font-medium text-green-700">Accepted File Types</Label>
                                                                                <Input
                                                                                    value={field.accept || ''}
                                                                                    onChange={(e) => updateFormField(index, { ...field, accept: e.target.value })}
                                                                                    placeholder=".pdf,.doc,.docx,.jpg,.png"
                                                                                    className="bg-white"
                                                                                />
                                                                                <p className="text-xs text-green-600">Example: .pdf,.jpg,.png or image/*,application/pdf</p>
                                                                            </div>
                                                                            <div className="space-y-2">
                                                                                <Label className="text-sm font-medium text-green-700">Maximum File Size (MB)</Label>
                                                                                <Input
                                                                                    type="number"
                                                                                    value={field.maxSize || ''}
                                                                                    onChange={(e) => updateFormField(index, { ...field, maxSize: e.target.value })}
                                                                                    placeholder="5"
                                                                                    className="bg-white"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {field.type === 'textarea' && (
                                                                    <div className="bg-purple-50 rounded-lg p-4">
                                                                        <h6 className="text-sm font-medium text-purple-800 mb-3 uppercase tracking-wide">Text Area Settings</h6>
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                            <div className="space-y-2">
                                                                                <Label className="text-sm font-medium text-purple-700">Number of Rows</Label>
                                                                                <Input
                                                                                    type="number"
                                                                                    value={field.rows || '3'}
                                                                                    onChange={(e) => updateFormField(index, { ...field, rows: e.target.value })}
                                                                                    placeholder="3"
                                                                                    min="1"
                                                                                    max="10"
                                                                                    className="bg-white"
                                                                                />
                                                                            </div>
                                                                            <div className="space-y-2">
                                                                                <Label className="text-sm font-medium text-purple-700">Maximum Characters</Label>
                                                                                <Input
                                                                                    type="number"
                                                                                    value={field.maxLength || ''}
                                                                                    onChange={(e) => updateFormField(index, { ...field, maxLength: e.target.value })}
                                                                                    placeholder="500"
                                                                                    className="bg-white"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                                                                    <div className="bg-indigo-50 rounded-lg p-4">
                                                                        <div className="flex items-center justify-between mb-3">
                                                                            <h6 className="text-sm font-medium text-indigo-800 uppercase tracking-wide">Options Management</h6>
                                                                            <Button
                                                                                type="button"
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() => {
                                                                                    const newOptions = [...(field.options || []), ''];
                                                                                    updateFormField(index, { ...field, options: newOptions });
                                                                                }}
                                                                                className="text-indigo-700 border-indigo-300 hover:bg-indigo-100"
                                                                            >
                                                                                <Plus className="h-4 w-4 mr-1" />
                                                                                Add Option
                                                                            </Button>
                                                                        </div>
                                                                        
                                                                        <div className="space-y-3">
                                                                            {(field.options?.length > 0 ? field.options : ['', '']).map((option, optIndex) => (
                                                                                <div key={optIndex} className="flex items-center gap-3">
                                                                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-medium text-sm">
                                                                                        {optIndex + 1}
                                                                                    </div>
                                                                                    <Input
                                                                                        value={option}
                                                                                        onChange={(e) => {
                                                                                            const newOptions = [...(field.options || [])];
                                                                                            newOptions[optIndex] = e.target.value;
                                                                                            updateFormField(index, { ...field, options: newOptions });
                                                                                        }}
                                                                                        placeholder={`Option ${optIndex + 1}`}
                                                                                        className="flex-1 bg-white"
                                                                                    />
                                                                                    {(field.options?.length || 0) > 2 && (
                                                                                        <Button
                                                                                            type="button"
                                                                                            variant="outline"
                                                                                            size="sm"
                                                                                            onClick={() => {
                                                                                                const newOptions = field.options?.filter((_, i) => i !== optIndex) || [];
                                                                                                updateFormField(index, { ...field, options: newOptions });
                                                                                            }}
                                                                                            className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                                                                                        >
                                                                                            <X className="h-4 w-4" />
                                                                                        </Button>
                                                                                    )}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                        
                                                                        {field.options && field.options.filter(opt => opt.trim()).length > 0 && (
                                                                            <div className="mt-4 pt-3 border-t border-indigo-200">
                                                                                <Label className="text-sm font-medium text-indigo-700 mb-2 block">Preview Options:</Label>
                                                                                <div className="flex flex-wrap gap-2">
                                                                                    {field.options.filter(opt => opt.trim()).map((option, optIndex) => (
                                                                                        <span key={optIndex} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                                                                                            {option}
                                                                                        </span>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                                
                                                {/* Add Another Field Button */}
                                                <div className="text-center pt-4">
                                                    <Button 
                                                        type="button" 
                                                        onClick={addFormField}
                                                        variant="outline"
                                                        className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                                                    >
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Add Another Field
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Live Preview Section */}
                                    {formSchema.length > 0 && (
                                        <div className="space-y-6 border-t-2 border-gray-200 pt-8 mt-8">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                                                        <Eye className="h-5 w-5 text-blue-600" />
                                                        Form Preview
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mt-1">See how your registration form will appear to users</p>
                                                </div>
                                            </div>
                                            
                                            <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                                                <CardHeader className="pb-4 border-b border-blue-200">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                                        <div className="ml-4 text-sm font-medium text-gray-600">Registration Form Preview</div>
                                                    </div>
                                                    <CardTitle className="text-xl text-blue-900">Event Registration</CardTitle>
                                                    <CardDescription className="text-blue-700">
                                                        Complete this form to register for the event
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="p-6 space-y-6">
                                                    {/* Default Fields Preview */}
                                                    <div className="space-y-4">
                                                        <div className="border-b border-blue-200 pb-4">
                                                            <h5 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">Required Information</h5>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div className="space-y-2">
                                                                <Label className="text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></Label>
                                                                <Input placeholder="Enter your full name" disabled className="bg-white border-gray-300" />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></Label>
                                                                <Input type="email" placeholder="your.email@example.com" disabled className="bg-white border-gray-300" />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></Label>
                                                                <Input type="tel" placeholder="+880 1XXX-XXXXXX" disabled className="bg-white border-gray-300" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Custom Fields Preview */}
                                                    <div className="space-y-4 border-t border-blue-200 pt-6">
                                                        <div className="border-b border-blue-200 pb-4">
                                                            <h5 className="font-semibold text-gray-800 mb-1 text-sm uppercase tracking-wide">Additional Information</h5>
                                                            <p className="text-xs text-gray-600">{formSchema.length} custom field{formSchema.length !== 1 ? 's' : ''} configured</p>
                                                        </div>
                                                        <div className="grid grid-cols-1 gap-4">
                                                            {formSchema.map((field, index) => (
                                                                <div key={field.id} className="p-4 bg-white rounded-lg border border-gray-200">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                                                                            {index + 1}
                                                                        </span>
                                                                        <Label className="text-sm font-medium text-gray-700">
                                                                            {field.label || `Custom Field ${index + 1}`}
                                                                            {field.required && <span className="text-red-500 ml-1">*</span>}
                                                                        </Label>
                                                                        <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                                            {field.type === 'datetime-local' ? 'Date & Time' : field.type.replace('-', ' ').toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                    
                                                                    {field.type === 'textarea' ? (
                                                                        <Textarea 
                                                                            placeholder={field.placeholder || 'Enter text here...'}
                                                                            disabled 
                                                                            className="bg-gray-50 border-gray-300"
                                                                            rows={parseInt(field.rows) || 3}
                                                                        />
                                                                    ) : field.type === 'select' ? (
                                                                        <Select disabled>
                                                                            <SelectTrigger className="bg-gray-50 border-gray-300">
                                                                                <SelectValue placeholder={field.placeholder || 'Select an option'} />
                                                                            </SelectTrigger>
                                                                        </Select>
                                                                    ) : field.type === 'radio' ? (
                                                                        <div className="space-y-2 p-3 bg-gray-50 rounded">
                                                                            {(field.options || ['Option 1', 'Option 2']).filter(opt => opt.trim()).map((option, optIndex) => (
                                                                                <div key={optIndex} className="flex items-center space-x-2">
                                                                                    <input type="radio" disabled className="rounded-full" />
                                                                                    <Label className="text-sm text-gray-700">{option}</Label>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    ) : field.type === 'checkbox' ? (
                                                                        <div className="space-y-2 p-3 bg-gray-50 rounded">
                                                                            {(field.options || ['Option 1', 'Option 2']).filter(opt => opt.trim()).map((option, optIndex) => (
                                                                                <div key={optIndex} className="flex items-center space-x-2">
                                                                                    <input type="checkbox" disabled className="rounded" />
                                                                                    <Label className="text-sm text-gray-700">{option}</Label>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    ) : field.type === 'range' ? (
                                                                        <div className="space-y-3 p-3 bg-gray-50 rounded">
                                                                            <input 
                                                                                type="range" 
                                                                                disabled 
                                                                                className="w-full"
                                                                                min={field.min || 0}
                                                                                max={field.max || 100}
                                                                                step={field.step || 1}
                                                                            />
                                                                            <div className="flex justify-between text-xs text-gray-600">
                                                                                <span>Min: {field.min || 0}</span>
                                                                                <span>Max: {field.max || 100}</span>
                                                                            </div>
                                                                        </div>
                                                                    ) : field.type === 'file' ? (
                                                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                                                                            <div className="space-y-2">
                                                                                <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                                                                                <div className="text-sm text-gray-600">Click to upload or drag and drop</div>
                                                                                {field.accept && (
                                                                                    <div className="text-xs text-gray-500">Accepted: {field.accept}</div>
                                                                                )}
                                                                                {field.maxSize && (
                                                                                    <div className="text-xs text-gray-500">Max size: {field.maxSize}MB</div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    ) : field.type === 'color' ? (
                                                                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                                                                            <div className="w-10 h-10 bg-blue-500 rounded border border-gray-300"></div>
                                                                            <Input 
                                                                                value="#3B82F6" 
                                                                                disabled 
                                                                                className="bg-white border-gray-300 flex-1 font-mono text-sm"
                                                                            />
                                                                        </div>
                                                                    ) : (
                                                                        <Input 
                                                                            type={field.type}
                                                                            placeholder={field.placeholder || 'Enter value...'}
                                                                            disabled 
                                                                            className="bg-gray-50 border-gray-300"
                                                                            min={field.min}
                                                                            max={field.max}
                                                                            step={field.step}
                                                                        />
                                                                    )}
                                                                    
                                                                    {field.helpText && (
                                                                        <p className="text-xs text-gray-500 mt-2 pl-8">{field.helpText}</p>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="pt-4 border-t border-blue-200">
                                                        <Button disabled className="w-full bg-blue-600 text-white">
                                                            Submit Registration
                                                        </Button>
                                                        <p className="text-xs text-center text-gray-500 mt-2">Preview only - form is not functional</p>
                                                    </div>
                                                </CardContent>
                                            </Card>
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