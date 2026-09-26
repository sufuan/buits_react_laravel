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
import { Switch } from '@/Components/ui/switch';
import { Checkbox } from '@/Components/ui/checkbox';
import { ArrowLeft, Save, Eye, Upload, AlertCircle, Plus, Trash2, X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { Link } from '@inertiajs/react';

function FieldError({ message }) {
    if (!message) return null;
    return (
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {message}
        </p>
    );
}

const STEPS = [
    { id: 1, label: 'Basic Info',        description: 'Title, slug, fee & deadline' },
    { id: 2, label: 'Event Content',     description: 'HTML content for the event page' },
    { id: 3, label: 'Registration Form', description: 'Custom fields for registrants' },
];

export default function TicketingEventsEdit({ ticketingEvent }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formSchema, setFormSchema] = useState(
        Array.isArray(ticketingEvent.form_schema) ? ticketingEvent.form_schema : []
    );
    const [clientErrors, setClientErrors] = useState({});
    const [contentTab, setContentTab] = useState('paste');

    const { data, setData, post, processing, errors } = useForm({
        title:                   ticketingEvent.title || '',
        slug:                    ticketingEvent.slug  || '',
        fee:                     ticketingEvent.fee   || '',
        deadline:                ticketingEvent.deadline || '',
        status:                  ticketingEvent.status  || 'active',
        event_html_content:      ticketingEvent.event_html_content || '',
        html_file:               null,
        form_schema:             JSON.stringify(ticketingEvent.form_schema || []),
        requires_payment:        ticketingEvent.requires_payment || false,
        member_fee:              ticketingEvent.member_fee || '',
        non_member_fee:          ticketingEvent.non_member_fee || '',
        enabled_payment_methods: ticketingEvent.enabled_payment_methods || [],
        _method:                 'PUT',
    });

    const handleSlugChange = (e) => {
        setData('slug', e.target.value);
        if (clientErrors.slug) setClientErrors(p => ({ ...p, slug: null }));
    };

    const togglePaymentMethod = (method) => {
        const current = data.enabled_payment_methods || [];
        if (current.includes(method)) {
            setData('enabled_payment_methods', current.filter(m => m !== method));
        } else {
            setData('enabled_payment_methods', [...current, method]);
        }
    };

    const updateFormSchema = (s) => { setFormSchema(s); setData('form_schema', JSON.stringify(s)); };
    const addFormField    = () => updateFormSchema([...formSchema, {
        id: crypto.randomUUID(), type: 'text', label: '', placeholder: '',
        helpText: '', required: false, options: [],
        min: '', max: '', step: '', accept: '', maxSize: '', rows: '3', maxLength: '',
    }]);
    const updateFormField = (i, f) => { const u = [...formSchema]; u[i] = f; updateFormSchema(u); };
    const removeFormField = (i) => updateFormSchema(formSchema.filter((_, idx) => idx !== i));

    const validateStep1 = () => {
        const errs = {};
        if (!data.title.trim()) errs.title = 'Event title is required.';
        if (!data.slug.trim())  errs.slug  = 'URL slug is required.';
        else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug))
            errs.slug = 'Slug may only contain lowercase letters, numbers, and hyphens.';
        setClientErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const goToStep = (step) => {
        if (step > currentStep && currentStep === 1 && !validateStep1()) return;
        setCurrentStep(step);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateStep1()) { setCurrentStep(1); toast.error('Please fix the errors on Step 1 before saving.'); return; }

        const fd = new FormData();
        fd.append('title',              data.title);
        fd.append('slug',               data.slug);
        fd.append('fee',                data.fee);
        fd.append('deadline',           data.deadline);
        fd.append('status',             data.status);
        fd.append('event_html_content', data.event_html_content);
        fd.append('form_schema',        JSON.stringify(formSchema));
        fd.append('requires_payment',   data.requires_payment ? '1' : '0');
        fd.append('member_fee',         data.member_fee);
        fd.append('non_member_fee',     data.non_member_fee);
        fd.append('_method',            'PUT');
        
        // Append enabled payment methods as individual array items
        if (data.enabled_payment_methods && data.enabled_payment_methods.length > 0) {
            data.enabled_payment_methods.forEach((method, index) => {
                fd.append(`enabled_payment_methods[${index}]`, method);
            });
        }
        
        if (data.html_file instanceof File) fd.append('html_file', data.html_file);

        post(route('admin.ticketing-events.update', ticketingEvent.slug), {
            data: fd,
            forceFormData: true,
            onSuccess: () => toast.success('Event updated successfully!'),
            onError: (errs) => {
                if (errs.title || errs.slug || errs.fee || errs.deadline || errs.status) setCurrentStep(1);
                else if (errs.event_html_content || errs.html_file) setCurrentStep(2);
                toast.error('Please fix the errors below.');
            },
        });
    };

    const handlePreview = async () => {
        const fd = new FormData();
        fd.append('title',              data.title);
        fd.append('slug',               data.slug || 'preview');
        fd.append('event_html_content', data.event_html_content);
        fd.append('form_schema',        JSON.stringify(formSchema));
        fd.append('fee',                data.fee);
        fd.append('deadline',           data.deadline);
        fd.append('requires_payment',   data.requires_payment ? '1' : '0');
        fd.append('member_fee',         data.member_fee);
        fd.append('non_member_fee',     data.non_member_fee);
        
        // Append enabled payment methods
        if (data.enabled_payment_methods && data.enabled_payment_methods.length > 0) {
            data.enabled_payment_methods.forEach((method, index) => {
                fd.append(`enabled_payment_methods[${index}]`, method);
            });
        }
        
        if (data.html_file instanceof File) fd.append('html_file', data.html_file);
        try {
            const res = await fetch(route('admin.ticketing-events.preview'), {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content, 'X-Requested-With': 'XMLHttpRequest' },
                body: fd,
            });
            const result = await res.json();
            if (result.preview_url) window.open(result.preview_url, '_blank');
        } catch { toast.error('Preview failed. Please try again.'); }
    };

    const StepBar = () => (
        <div className="mb-8">
            <div className="flex items-center justify-between relative">
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0">
                    <div className="h-full bg-blue-600 transition-all duration-300"
                         style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }} />
                </div>
                {STEPS.map((step) => {
                    const done = currentStep > step.id, active = currentStep === step.id;
                    return (
                        <div key={step.id} onClick={() => goToStep(step.id)}
                             className="relative z-10 flex flex-col items-center gap-2 cursor-pointer select-none">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-semibold text-sm transition-all
                                ${done ? 'bg-blue-600 border-blue-600 text-white' : active ? 'bg-white border-blue-600 text-blue-600' : 'bg-white border-gray-300 text-gray-400'}`}>
                                {done ? <Check className="h-5 w-5" /> : step.id}
                            </div>
                            <div className="text-center">
                                <div className={`text-sm font-semibold ${active ? 'text-blue-600' : done ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</div>
                                <div className="text-xs text-gray-400 hidden sm:block">{step.description}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const stepFieldMap = { 1: ['title','slug','fee','deadline','status'], 2: ['event_html_content','html_file'], 3: ['form_schema'] };
    const stepErrors   = (stepFieldMap[currentStep] || []).filter(f => errors[f]).map(f => errors[f]);

    const NavButtons = () => (
        <div className="mt-6 flex items-center justify-between">
            <div>
                {currentStep > 1 && (
                    <Button type="button" variant="outline" onClick={() => goToStep(currentStep - 1)}>
                        <ChevronLeft className="h-4 w-4 mr-1" /> Back
                    </Button>
                )}
            </div>
            <div>
                {currentStep < STEPS.length ? (
                    <Button type="button" onClick={() => goToStep(currentStep + 1)} className="bg-blue-600 hover:bg-blue-700">
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                ) : (
                    <Button type="submit" form="edit-event-form" disabled={processing} className="bg-blue-600 hover:bg-blue-700 min-w-[130px]">
                        <Save className="h-4 w-4 mr-2" />
                        {processing ? 'Saving...' : 'Update Event'}
                    </Button>
                )}
            </div>
        </div>
    );

    return (
        <AdminAuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={route('admin.ticketing-events.index')}>
                            <Button type="button" variant="outline" size="sm"><ArrowLeft className="h-4 w-4" /></Button>
                        </Link>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Edit: {ticketingEvent.title}</h2>
                            <p className="text-sm text-gray-500">Step {currentStep} of {STEPS.length} — {STEPS[currentStep - 1].label}</p>
                        </div>
                    </div>
                    <Button type="button" variant="outline" onClick={handlePreview} disabled={!data.title}>
                        <Eye className="h-4 w-4 mr-2" /> Preview
                    </Button>
                </div>
            }
        >
            <Head title={`Edit: ${ticketingEvent.title}`} />

            {/* Hidden form — only wires up POST on submit */}
            <form id="edit-event-form" onSubmit={handleSubmit} style={{ display: 'none' }} />

            <div className="p-6 max-w-4xl mx-auto">
                <StepBar />

                {stepErrors.length > 0 && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                        <div>
                            <p className="font-medium text-red-800 mb-1">Please fix the following errors:</p>
                            <ul className="list-disc list-inside space-y-1">
                                {stepErrors.map((msg, i) => <li key={i} className="text-sm text-red-700">{msg}</li>)}
                            </ul>
                        </div>
                    </div>
                )}

                {/* ── STEP 1 ── */}
                {currentStep === 1 && (
                    <Card className="shadow-sm">
                        <CardHeader className="border-b bg-gray-50">
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>Update the title, slug, fee and deadline for this event.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-1.5">
                                <Label htmlFor="title">Event Title <span className="text-red-500">*</span></Label>
                                <Input id="title" value={data.title}
                                    onChange={(e) => { setData('title', e.target.value); if (clientErrors.title) setClientErrors(p => ({ ...p, title: null })); }}
                                    placeholder="e.g. MS Office Workshop 2025"
                                    className={clientErrors.title || errors.title ? 'border-red-500 focus-visible:ring-red-300' : ''} />
                                <FieldError message={clientErrors.title || errors.title} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="slug">URL Slug <span className="text-red-500">*</span></Label>
                                <Input id="slug" value={data.slug} onChange={handleSlugChange} placeholder="ms-office-workshop-2025"
                                    className={clientErrors.slug || errors.slug ? 'border-red-500 focus-visible:ring-red-300' : ''} />
                                <FieldError message={clientErrors.slug || errors.slug} />
                                {data.slug && !clientErrors.slug && !errors.slug && (
                                    <p className="text-xs text-gray-500">
                                        Public URL:{' '}
                                        <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-blue-700">
                                            {window.location.origin}/t/{data.slug}
                                        </span>
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="deadline">Registration Deadline <span className="text-gray-400 font-normal">(optional)</span></Label>
                                <Input id="deadline" type="datetime-local" value={data.deadline}
                                    onChange={(e) => setData('deadline', e.target.value)}
                                    className={errors.deadline ? 'border-red-500' : ''} />
                                <FieldError message={errors.deadline} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="status">Status</Label>
                                <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                    <SelectTrigger id="status" className="w-48"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FieldError message={errors.status} />
                            </div>

                            {/* Payment Settings Section */}
                            <div className="pt-6 border-t border-gray-200">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="requires_payment" className="text-base font-semibold">Payment Settings</Label>
                                            <p className="text-sm text-gray-500 mt-1">Configure payment requirements and fees</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="requires_payment" className="text-sm font-medium cursor-pointer">
                                                Requires Payment
                                            </Label>
                                            <Switch
                                                id="requires_payment"
                                                checked={data.requires_payment}
                                                onCheckedChange={(checked) => {
                                                    setData('requires_payment', checked);
                                                    if (!checked) {
                                                        setData('member_fee', '');
                                                        setData('non_member_fee', '');
                                                        setData('enabled_payment_methods', []);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {data.requires_payment && (
                                        <Card className="bg-gray-50 border-gray-200">
                                            <CardContent className="p-4 space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="member_fee">Member Fee</Label>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium select-none">৳</span>
                                                            <Input
                                                                id="member_fee"
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                value={data.member_fee}
                                                                onChange={(e) => setData('member_fee', e.target.value)}
                                                                placeholder="0.00"
                                                                className={`pl-8 ${errors.member_fee ? 'border-red-500' : ''}`}
                                                            />
                                                        </div>
                                                        <FieldError message={errors.member_fee} />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="non_member_fee">Non-Member Fee</Label>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium select-none">৳</span>
                                                            <Input
                                                                id="non_member_fee"
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                value={data.non_member_fee}
                                                                onChange={(e) => setData('non_member_fee', e.target.value)}
                                                                placeholder="0.00"
                                                                className={`pl-8 ${errors.non_member_fee ? 'border-red-500' : ''}`}
                                                            />
                                                        </div>
                                                        <FieldError message={errors.non_member_fee} />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Enabled Payment Methods</Label>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                        {[
                                                            { value: 'bkash', label: 'bKash' },
                                                            { value: 'nagad', label: 'Nagad' },
                                                            { value: 'rocket', label: 'Rocket' },
                                                            { value: 'bank', label: 'Bank Transfer' }
                                                        ].map((method) => (
                                                            <div key={method.value} className="flex items-center gap-2 p-3 bg-white border rounded-lg hover:border-blue-300 transition-colors">
                                                                <Checkbox
                                                                    id={`method-${method.value}`}
                                                                    checked={(data.enabled_payment_methods || []).includes(method.value)}
                                                                    onCheckedChange={() => togglePaymentMethod(method.value)}
                                                                />
                                                                <Label htmlFor={`method-${method.value}`} className="cursor-pointer font-normal flex-1">
                                                                    {method.label}
                                                                </Label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <FieldError message={errors.enabled_payment_methods} />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* ── STEP 2 ── */}
                {currentStep === 2 && (
                    <Card className="shadow-sm">
                        <CardHeader className="border-b bg-gray-50">
                            <CardTitle>Event Content</CardTitle>
                            <CardDescription>HTML content shown on the public event page. Optional.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex border-b border-gray-200">
                                <button type="button" onClick={() => setContentTab('paste')}
                                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${contentTab === 'paste' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                    Edit HTML Code
                                </button>
                                <button type="button" onClick={() => setContentTab('upload')}
                                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${contentTab === 'upload' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                    Replace with File
                                </button>
                            </div>

                            {contentTab === 'paste' && (
                                <div className="space-y-2">
                                    <Label htmlFor="event_html_content">HTML Content</Label>
                                    <Textarea id="event_html_content" rows={18} value={data.event_html_content}
                                        onChange={(e) => { setData('event_html_content', e.target.value); if (data.html_file) setData('html_file', null); }}
                                        placeholder={"<!-- Paste your HTML content here -->\n<h2>Event Description</h2>"}
                                        className="font-mono text-sm" />
                                    <FieldError message={errors.event_html_content} />
                                </div>
                            )}

                            {contentTab === 'upload' && (
                                <div className="space-y-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="html_file">Upload .html or .txt file <span className="text-gray-400 font-normal">(max 512 KB)</span></Label>
                                        <Input id="html_file" type="file" accept=".html,.txt"
                                            onChange={(e) => { const f = e.target.files[0]; if (f) { setData('html_file', f); setData('event_html_content', ''); } }}
                                            className={errors.html_file ? 'border-red-500' : ''} />
                                        <FieldError message={errors.html_file} />
                                    </div>
                                    {data.html_file && (
                                        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                            <Upload className="h-4 w-4 text-green-700" />
                                            <span className="text-sm text-green-800 flex-1">{data.html_file.name}</span>
                                            <button type="button" onClick={() => { setData('html_file', null); const fi = document.getElementById('html_file'); if (fi) fi.value = ''; }}
                                                className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1">
                                                <X className="h-4 w-4" /> Clear
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* ── STEP 3 ── */}
                {currentStep === 3 && (
                    <Card className="shadow-sm">
                        <CardHeader className="border-b bg-gray-50">
                            <CardTitle>Registration Form Builder</CardTitle>
                            <CardDescription>Add custom fields on top of the default Name, Email and Phone fields.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-700">Default Fields (always included)</Label>
                                <div className="flex flex-wrap gap-2">
                                    {['Name', 'Email', 'Phone'].map((f) => (
                                        <span key={f} className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                                            {f} <span className="text-gray-400 text-xs uppercase tracking-wide">required</span>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t pt-5">
                                <Label className="text-sm font-semibold text-gray-700">Custom Fields</Label>
                                <button type="button" onClick={addFormField}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                                    <Plus className="h-4 w-4" /> Add Field
                                </button>
                            </div>

                            {formSchema.length === 0 ? (
                                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                                    <div className="w-14 h-14 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                        <Plus className="h-7 w-7 text-blue-600" />
                                    </div>
                                    <p className="font-medium text-gray-900 mb-1">No custom fields yet</p>
                                    <p className="text-sm text-gray-500 mb-4">Add fields to collect extra information from registrants.</p>
                                    <button type="button" onClick={addFormField}
                                        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                                        <Plus className="h-4 w-4" /> Add First Field
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {formSchema.map((field, index) => (
                                        <Card key={field.id} className="border-l-4 border-l-blue-500 shadow-sm">
                                            <CardContent className="p-5 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold text-xs">{index + 1}</span>
                                                        <span className="font-medium text-gray-800 text-sm">{field.label || `Custom Field ${index + 1}`}</span>
                                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full capitalize">{field.type}</span>
                                                    </div>
                                                    <button type="button" onClick={() => removeFormField(index)}
                                                        className="text-red-600 hover:text-red-700 p-1.5 rounded hover:bg-red-50 transition-colors">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs font-medium text-gray-600">Field Type</Label>
                                                        <Select value={field.type} onValueChange={(v) => updateFormField(index, { ...field, type: v })}>
                                                            <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="text">Text Input</SelectItem>
                                                                <SelectItem value="email">Email Address</SelectItem>
                                                                <SelectItem value="tel">Phone Number</SelectItem>
                                                                <SelectItem value="number">Number</SelectItem>
                                                                <SelectItem value="date">Date Picker</SelectItem>
                                                                <SelectItem value="time">Time Picker</SelectItem>
                                                                <SelectItem value="datetime-local">Date &amp; Time</SelectItem>
                                                                <SelectItem value="select">Dropdown Select</SelectItem>
                                                                <SelectItem value="radio">Radio Buttons</SelectItem>
                                                                <SelectItem value="checkbox">Multiple Choice</SelectItem>
                                                                <SelectItem value="textarea">Long Text</SelectItem>
                                                                <SelectItem value="file">File Upload</SelectItem>
                                                                <SelectItem value="url">Website URL</SelectItem>
                                                                <SelectItem value="range">Range Slider</SelectItem>
                                                                <SelectItem value="color">Color Picker</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs font-medium text-gray-600">Field Label</Label>
                                                        <Input value={field.label} onChange={(e) => updateFormField(index, { ...field, label: e.target.value })} placeholder="e.g. Department, Batch, T-Shirt Size" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs font-medium text-gray-600">Placeholder Text</Label>
                                                        <Input value={field.placeholder || ''} onChange={(e) => updateFormField(index, { ...field, placeholder: e.target.value })} placeholder="Hint shown inside the field" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs font-medium text-gray-600">Help Text</Label>
                                                        <Input value={field.helpText || ''} onChange={(e) => updateFormField(index, { ...field, helpText: e.target.value })} placeholder="Short guidance for users" />
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox" id={`req-${field.id}`} checked={field.required || false} onChange={(e) => updateFormField(index, { ...field, required: e.target.checked })} className="rounded border-gray-300 text-blue-600" />
                                                    <Label htmlFor={`req-${field.id}`} className="text-sm cursor-pointer">Required Field</Label>
                                                </div>

                                                {(field.type === 'number' || field.type === 'range') && (
                                                    <div className="grid grid-cols-3 gap-3 bg-blue-50 p-3 rounded-lg">
                                                        <div><Label className="text-xs text-blue-700 mb-1 block">Min</Label><Input className="bg-white" value={field.min || ''} onChange={(e) => updateFormField(index, { ...field, min: e.target.value })} placeholder="0" /></div>
                                                        <div><Label className="text-xs text-blue-700 mb-1 block">Max</Label><Input className="bg-white" value={field.max || ''} onChange={(e) => updateFormField(index, { ...field, max: e.target.value })} placeholder="100" /></div>
                                                        <div><Label className="text-xs text-blue-700 mb-1 block">Step</Label><Input className="bg-white" value={field.step || ''} onChange={(e) => updateFormField(index, { ...field, step: e.target.value })} placeholder="1" /></div>
                                                    </div>
                                                )}
                                                {field.type === 'file' && (
                                                    <div className="grid grid-cols-2 gap-3 bg-green-50 p-3 rounded-lg">
                                                        <div><Label className="text-xs text-green-700 mb-1 block">Accepted Types</Label><Input className="bg-white" value={field.accept || ''} onChange={(e) => updateFormField(index, { ...field, accept: e.target.value })} placeholder=".pdf,.jpg,.png" /></div>
                                                        <div><Label className="text-xs text-green-700 mb-1 block">Max Size (MB)</Label><Input type="number" className="bg-white" value={field.maxSize || ''} onChange={(e) => updateFormField(index, { ...field, maxSize: e.target.value })} placeholder="5" /></div>
                                                    </div>
                                                )}
                                                {field.type === 'textarea' && (
                                                    <div className="grid grid-cols-2 gap-3 bg-purple-50 p-3 rounded-lg">
                                                        <div><Label className="text-xs text-purple-700 mb-1 block">Rows</Label><Input type="number" className="bg-white" value={field.rows || '3'} onChange={(e) => updateFormField(index, { ...field, rows: e.target.value })} /></div>
                                                        <div><Label className="text-xs text-purple-700 mb-1 block">Max Characters</Label><Input type="number" className="bg-white" value={field.maxLength || ''} onChange={(e) => updateFormField(index, { ...field, maxLength: e.target.value })} placeholder="500" /></div>
                                                    </div>
                                                )}
                                                {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                                                    <div className="bg-indigo-50 p-3 rounded-lg space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <Label className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">Options</Label>
                                                            <button type="button" onClick={() => updateFormField(index, { ...field, options: [...(field.options || []), ''] })}
                                                                className="text-xs text-indigo-700 border border-indigo-300 px-2 py-1 rounded hover:bg-indigo-100 flex items-center gap-1">
                                                                <Plus className="h-3 w-3" /> Add Option
                                                            </button>
                                                        </div>
                                                        {(field.options?.length > 0 ? field.options : ['', '']).map((opt, oi) => (
                                                            <div key={oi} className="flex items-center gap-2">
                                                                <span className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xs font-medium shrink-0">{oi + 1}</span>
                                                                <Input className="bg-white flex-1" value={opt}
                                                                    onChange={(e) => { const opts = [...(field.options || [])]; opts[oi] = e.target.value; updateFormField(index, { ...field, options: opts }); }}
                                                                    placeholder={`Option ${oi + 1}`} />
                                                                {(field.options?.length || 0) > 2 && (
                                                                    <button type="button" onClick={() => updateFormField(index, { ...field, options: field.options.filter((_, i) => i !== oi) })}
                                                                        className="text-red-500 hover:text-red-700 p-1"><X className="h-4 w-4" /></button>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {field.options?.filter(o => o.trim()).length > 0 && (
                                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                                {field.options.filter(o => o.trim()).map((o, oi) => (
                                                                    <span key={oi} className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs">{o}</span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                    <div className="text-center pt-2">
                                        <button type="button" onClick={addFormField}
                                            className="inline-flex items-center gap-2 px-4 py-2 border border-dashed border-blue-300 rounded-md text-sm text-blue-600 hover:bg-blue-50 transition-colors">
                                            <Plus className="h-4 w-4" /> Add Another Field
                                        </button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                <NavButtons />
            </div>
        </AdminAuthenticatedLayout>
    );
}
