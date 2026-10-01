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

export default function TicketingEventsCreate() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formSchema, setFormSchema] = useState([]);
    const [clientErrors, setClientErrors] = useState({});
    // Step 2 sub-tab state managed in plain React (NOT inside a <form>)
    const [contentTab, setContentTab] = useState('paste');

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        slug: '',
        fee: '',
        deadline: '',
        status: 'active',
        event_html_content: '',
        html_file: null,
        form_schema: '[]',
        requires_payment: false,
        member_fee: '',
        non_member_fee: '',
        enabled_payment_methods: [],
        payment_numbers: {},
    });

    const slugify = (str) =>
        str.toLowerCase().trim()
           .replace(/[^\w\s-]/g, '')
           .replace(/[\s_-]+/g, '-')
           .replace(/^-+|-+$/g, '');

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setData(prev => ({ ...prev, title, slug: slugify(title) }));
        if (clientErrors.title) setClientErrors(p => ({ ...p, title: null }));
    };

    const handleSlugChange = (e) => {
        const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
        setData('slug', val);
        if (clientErrors.slug) setClientErrors(p => ({ ...p, slug: null }));
    };

    const togglePaymentMethod = (method) => {
        const current = data.enabled_payment_methods || [];
        if (current.includes(method)) {
            setData('enabled_payment_methods', current.filter(m => m !== method));
            setData('payment_numbers', { ...data.payment_numbers, [method]: '' });
        } else {
            setData('enabled_payment_methods', [...current, method]);
        }
    };

    const updatePaymentNumber = (method, number) => {
        setData('payment_numbers', { ...data.payment_numbers, [method]: number });
    };

    // ── form schema ────────────────────────────────────────────────────────────
    const updateFormSchema = (s) => {
        setFormSchema(s);
        setData('form_schema', JSON.stringify(s));
    };
    const addFormField = () => updateFormSchema([...formSchema, {
        id: crypto.randomUUID(), type: 'text', label: '', placeholder: '',
        helpText: '', required: false, options: [],
        min: '', max: '', step: '', accept: '', maxSize: '', rows: '3', maxLength: '',
    }]);
    const updateFormField = (i, f) => { const u = [...formSchema]; u[i] = f; updateFormSchema(u); };
    const removeFormField = (i) => updateFormSchema(formSchema.filter((_, idx) => idx !== i));

    // ── validation ─────────────────────────────────────────────────────────────
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

    // ── submit (only called from step 3 Save button) ───────────────────────────
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateStep1()) {
            setCurrentStep(1);
            toast.error('Please fix the errors on Step 1 before saving.');
            return;
        }

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
        
        // Append enabled payment methods as individual array items
        if (data.enabled_payment_methods && data.enabled_payment_methods.length > 0) {
            data.enabled_payment_methods.forEach((method, index) => {
                fd.append(`enabled_payment_methods[${index}]`, method);
            });
        }
        Object.entries(data.payment_numbers || {}).forEach(([method, number]) => {
            if (number) fd.append(`payment_numbers[${method}]`, number);
        });
        
        if (data.html_file instanceof File) fd.append('html_file', data.html_file);

        post(route('admin.ticketing-events.store'), {
            data: fd,
            forceFormData: true,
            onSuccess: () => toast.success('Event created successfully!'),
            onError: (errs) => {
                if (errs.title || errs.slug || errs.fee || errs.deadline || errs.status || errs.member_fee || errs.non_member_fee || Object.keys(errs).some(key => key.startsWith('payment_numbers.'))) setCurrentStep(1);
                else if (errs.event_html_content || errs.html_file) setCurrentStep(2);
                toast.error('Please fix the errors below.');
            },
        });
    };

    // ── preview ────────────────────────────────────────────────────────────────
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
        Object.entries(data.payment_numbers || {}).forEach(([method, number]) => {
            if (number) fd.append(`payment_numbers[${method}]`, number);
        });
        
        if (data.html_file instanceof File) fd.append('html_file', data.html_file);
        try {
            const res = await fetch(route('admin.ticketing-events.preview'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: fd,
            });
            const result = await res.json();
            if (result.preview_url) window.open(result.preview_url, '_blank');
        } catch {
            toast.error('Preview failed. Please try again.');
        }
    };

    // ── step indicator (plain divs — zero buttons outside steps) ──────────────
    const StepBar = () => (
        <div className="mb-8">
            <div className="flex items-center justify-between relative">
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0">
                    <div className="h-full bg-blue-600 transition-all duration-300"
                         style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }} />
                </div>
                {STEPS.map((step) => {
                    const done   = currentStep > step.id;
                    const active = currentStep === step.id;
                    return (
                        <div
                            key={step.id}
                            onClick={() => goToStep(step.id)}
                            className="relative z-10 flex flex-col items-center gap-2 cursor-pointer select-none"
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-semibold text-sm transition-all
                                ${done   ? 'bg-blue-600 border-blue-600 text-white'
                                : active ? 'bg-white border-blue-600 text-blue-600'
                                :          'bg-white border-gray-300 text-gray-400'}`}>
                                {done ? <Check className="h-5 w-5" /> : step.id}
                            </div>
                            <div className="text-center">
                                <div className={`text-sm font-semibold ${active ? 'text-blue-600' : done ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {step.label}
                                </div>
                                <div className="text-xs text-gray-400 hidden sm:block">{step.description}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    // ── server-error banner for current step ──────────────────────────────────
    const stepFieldMap = { 1: ['title','slug','fee','deadline','status','member_fee','non_member_fee','enabled_payment_methods'], 2: ['event_html_content','html_file'], 3: ['form_schema'] };
    const stepErrors   = (stepFieldMap[currentStep] || []).filter(f => errors[f]).map(f => errors[f]);

    // ── nav buttons (completely outside any form) ─────────────────────────────
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
                    /* Step 3: submit button is INSIDE its own mini form */
                    <Button type="submit" form="create-event-form" disabled={processing} className="bg-blue-600 hover:bg-blue-700 min-w-[130px]">
                        <Save className="h-4 w-4 mr-2" />
                        {processing ? 'Saving...' : 'Save Event'}
                    </Button>
                )}
            </div>
        </div>
    );

    // ── render ─────────────────────────────────────────────────────────────────
    return (
        <AdminAuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={route('admin.ticketing-events.index')}>
                            <Button type="button" variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Create Ticketing Event</h2>
                            <p className="text-sm text-gray-500">Step {currentStep} of {STEPS.length} — {STEPS[currentStep - 1].label}</p>
                        </div>
                    </div>
                    <Button type="button" variant="outline" onClick={handlePreview} disabled={!data.title}>
                        <Eye className="h-4 w-4 mr-2" /> Preview
                    </Button>
                </div>
            }
        >
            <Head title="Create Ticketing Event" />

            {/* Single hidden form — only handles POST on submit, no buttons inside except the submit one */}
            <form id="create-event-form" onSubmit={handleSubmit} style={{ display: 'none' }} />

            <div className="p-6 max-w-4xl mx-auto">
                <StepBar />

                {/* Error banner */}
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
                            <CardDescription>Set the title, slug, fee and deadline for this event.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-1.5">
                                <Label htmlFor="title">Event Title <span className="text-red-500">*</span></Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={handleTitleChange}
                                    placeholder="e.g. MS Office Workshop 2025"
                                    className={clientErrors.title || errors.title ? 'border-red-500 focus-visible:ring-red-300' : ''}
                                />
                                <FieldError message={clientErrors.title || errors.title} />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="slug">URL Slug <span className="text-red-500">*</span></Label>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={handleSlugChange}
                                    placeholder="ms-office-workshop-2025"
                                    className={clientErrors.slug || errors.slug ? 'border-red-500 focus-visible:ring-red-300' : ''}
                                />
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
                                <Input
                                    id="deadline"
                                    type="datetime-local"
                                    value={data.deadline}
                                    min={new Date().toISOString().slice(0, 16)}
                                    onChange={(e) => setData('deadline', e.target.value)}
                                    className={errors.deadline ? 'border-red-500' : ''}
                                />
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
                                                        setData('payment_numbers', {});
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
                                                    <Label>Payment Methods</Label>
                                                    <div className="space-y-3">
                                                        {[
                                                            { value: 'bkash', label: 'bKash' },
                                                            { value: 'nagad', label: 'Nagad' },
                                                            { value: 'rocket', label: 'Rocket' },
                                                            { value: 'bank', label: 'Bank Transfer' }
                                                        ].map((method) => (
                                                            <div key={method.value} className="p-3 bg-white border rounded-lg transition-colors">
                                                                <div className="flex items-center justify-between gap-3">
                                                                <Label htmlFor={`method-${method.value}`} className="cursor-pointer font-normal flex-1">
                                                                    {method.label}
                                                                </Label>
                                                                <Switch
                                                                    id={`method-${method.value}`}
                                                                    checked={(data.enabled_payment_methods || []).includes(method.value)}
                                                                    onCheckedChange={() => togglePaymentMethod(method.value)}
                                                                />
                                                                </div>
                                                                {(data.enabled_payment_methods || []).includes(method.value) && (
                                                                    <div className="mt-3 space-y-1.5">
                                                                        <Label htmlFor={`payment-number-${method.value}`}>{method.value === 'bank' ? 'Account number' : 'Payment number'}</Label>
                                                                        <Input
                                                                            id={`payment-number-${method.value}`}
                                                                            type="tel"
                                                                            value={data.payment_numbers?.[method.value] || ''}
                                                                            onChange={(e) => updatePaymentNumber(method.value, e.target.value)}
                                                                            placeholder={method.value === 'bank' ? 'Enter account number' : `Enter ${method.label} number`}
                                                                            className={errors[`payment_numbers.${method.value}`] ? 'border-red-500' : ''}
                                                                        />
                                                                        <FieldError message={errors[`payment_numbers.${method.value}`]} />
                                                                    </div>
                                                                )}
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
                            <CardDescription>HTML content shown on the public event page. This step is optional.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {/* Manual tab switcher — plain buttons, no form interference */}
                            <div className="flex border-b border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setContentTab('paste')}
                                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                        contentTab === 'paste'
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Paste HTML Code
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setContentTab('upload')}
                                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                        contentTab === 'upload'
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Upload HTML File
                                </button>
                            </div>

                            {contentTab === 'paste' && (
                                <div className="space-y-2">
                                    <Label htmlFor="event_html_content">HTML Content</Label>
                                    <Textarea
                                        id="event_html_content"
                                        rows={18}
                                        value={data.event_html_content}
                                        onChange={(e) => {
                                            setData('event_html_content', e.target.value);
                                            if (data.html_file) { setData('html_file', null); }
                                        }}
                                        placeholder={"<!-- Paste your HTML content here -->\n<h2>Event Description</h2>"}
                                        className="font-mono text-sm"
                                    />
                                    <FieldError message={errors.event_html_content} />
                                </div>
                            )}

                            {contentTab === 'upload' && (
                                <div className="space-y-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="html_file">Upload .html or .txt file <span className="text-gray-400 font-normal">(max 512 KB)</span></Label>
                                        <Input
                                            id="html_file"
                                            type="file"
                                            accept=".html,.txt"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) { setData('html_file', file); setData('event_html_content', ''); }
                                            }}
                                            className={errors.html_file ? 'border-red-500' : ''}
                                        />
                                        <FieldError message={errors.html_file} />
                                    </div>
                                    {data.html_file && (
                                        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                            <Upload className="h-4 w-4 text-green-700" />
                                            <span className="text-sm text-green-800 flex-1">{data.html_file.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => { setData('html_file', null); const fi = document.getElementById('html_file'); if (fi) fi.value = ''; }}
                                                className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                                            >
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
                    <div className="space-y-6">
                        {/* Form Builder */}
                        <Card className="shadow-sm">
                            <CardHeader className="border-b bg-gray-50">
                                <CardTitle>Registration Form Builder</CardTitle>
                                <CardDescription>Add custom fields on top of the default Name, Email and Phone fields.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                            {/* Default fields */}
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

                            {/* Custom fields header */}
                            <div className="flex items-center justify-between border-t pt-5">
                                <Label className="text-sm font-semibold text-gray-700">Custom Fields</Label>
                                <button
                                    type="button"
                                    onClick={addFormField}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                                >
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
                                    <button
                                        type="button"
                                        onClick={addFormField}
                                        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <Plus className="h-4 w-4" /> Add First Field
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {formSchema.map((field, index) => (
                                        <Card key={field.id} className="border-l-4 border-l-blue-500 shadow-sm">
                                            <CardContent className="p-5 space-y-4">
                                                {/* Field header row */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold text-xs">{index + 1}</span>
                                                        <span className="font-medium text-gray-800 text-sm">{field.label || `Custom Field ${index + 1}`}</span>
                                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full capitalize">{field.type}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFormField(index)}
                                                        className="text-red-600 hover:text-red-700 p-1.5 rounded hover:bg-red-50 transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                {/* Config grid */}
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

                                                {/* Number / Range */}
                                                {(field.type === 'number' || field.type === 'range') && (
                                                    <div className="grid grid-cols-3 gap-3 bg-blue-50 p-3 rounded-lg">
                                                        <div><Label className="text-xs text-blue-700 mb-1 block">Min</Label><Input className="bg-white" value={field.min || ''} onChange={(e) => updateFormField(index, { ...field, min: e.target.value })} placeholder="0" /></div>
                                                        <div><Label className="text-xs text-blue-700 mb-1 block">Max</Label><Input className="bg-white" value={field.max || ''} onChange={(e) => updateFormField(index, { ...field, max: e.target.value })} placeholder="100" /></div>
                                                        <div><Label className="text-xs text-blue-700 mb-1 block">Step</Label><Input className="bg-white" value={field.step || ''} onChange={(e) => updateFormField(index, { ...field, step: e.target.value })} placeholder="1" /></div>
                                                    </div>
                                                )}

                                                {/* File */}
                                                {field.type === 'file' && (
                                                    <div className="grid grid-cols-2 gap-3 bg-green-50 p-3 rounded-lg">
                                                        <div><Label className="text-xs text-green-700 mb-1 block">Accepted Types</Label><Input className="bg-white" value={field.accept || ''} onChange={(e) => updateFormField(index, { ...field, accept: e.target.value })} placeholder=".pdf,.jpg,.png" /></div>
                                                        <div><Label className="text-xs text-green-700 mb-1 block">Max Size (MB)</Label><Input type="number" className="bg-white" value={field.maxSize || ''} onChange={(e) => updateFormField(index, { ...field, maxSize: e.target.value })} placeholder="5" /></div>
                                                    </div>
                                                )}

                                                {/* Textarea */}
                                                {field.type === 'textarea' && (
                                                    <div className="grid grid-cols-2 gap-3 bg-purple-50 p-3 rounded-lg">
                                                        <div><Label className="text-xs text-purple-700 mb-1 block">Rows</Label><Input type="number" className="bg-white" value={field.rows || '3'} onChange={(e) => updateFormField(index, { ...field, rows: e.target.value })} /></div>
                                                        <div><Label className="text-xs text-purple-700 mb-1 block">Max Characters</Label><Input type="number" className="bg-white" value={field.maxLength || ''} onChange={(e) => updateFormField(index, { ...field, maxLength: e.target.value })} placeholder="500" /></div>
                                                    </div>
                                                )}

                                                {/* Options */}
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
                                                                        className="text-red-500 hover:text-red-700 p-1">
                                                                        <X className="h-4 w-4" />
                                                                    </button>
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

                    {/* Live Form Preview - Below */}
                    <Card className="shadow-xl border border-gray-200">
                        <CardHeader className="bg-white border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-semibold text-gray-900">Registration Form Preview</CardTitle>
                                    <CardDescription className="text-sm text-gray-600 mt-1">
                                        {data.title || 'Event Registration Form'}
                                    </CardDescription>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                    <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Live</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 bg-gradient-to-br from-gray-50 to-white">
                            <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm p-8 space-y-6">
                                {/* Event Info Header */}
                                <div className="border-b border-gray-200 pb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        {data.title || 'Event Registration'}
                                    </h2>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        {data.fee && parseFloat(data.fee) > 0 && (
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-medium">Registration Fee:</span>
                                                <span className="font-semibold text-gray-900">৳ {parseFloat(data.fee).toFixed(2)}</span>
                                            </div>
                                        )}
                                        {!data.fee || parseFloat(data.fee) === 0 && (
                                            <div className="inline-flex items-center px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
                                                Free Registration
                                            </div>
                                        )}
                                        {data.deadline && (
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-medium">Deadline:</span>
                                                <span className="text-gray-900">{new Date(data.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Required Information Section */}
                                <div className="space-y-5">
                                    <div className="flex items-center gap-2">
                                        <div className="h-px flex-1 bg-gray-200"></div>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">Required Information</span>
                                        <div className="h-px flex-1 bg-gray-200"></div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-5">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-gray-700">
                                                Full Name
                                                <span className="text-red-600 ml-1">*</span>
                                            </Label>
                                            <Input 
                                                placeholder="Enter your full name" 
                                                disabled 
                                                className="bg-gray-50 border-gray-300 h-11 text-gray-900 placeholder:text-gray-500"
                                            />
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-semibold text-gray-700">
                                                    Email Address
                                                    <span className="text-red-600 ml-1">*</span>
                                                </Label>
                                                <Input 
                                                    type="email" 
                                                    placeholder="your.email@example.com" 
                                                    disabled 
                                                    className="bg-gray-50 border-gray-300 h-11 text-gray-900 placeholder:text-gray-500"
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label className="text-sm font-semibold text-gray-700">
                                                    Phone Number
                                                    <span className="text-red-600 ml-1">*</span>
                                                </Label>
                                                <Input 
                                                    type="tel" 
                                                    placeholder="+880 1XXX-XXXXXX" 
                                                    disabled 
                                                    className="bg-gray-50 border-gray-300 h-11 text-gray-900 placeholder:text-gray-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Custom Fields Section */}
                                {formSchema.length > 0 && (
                                    <div className="space-y-5 pt-2">
                                        <div className="flex items-center gap-2">
                                            <div className="h-px flex-1 bg-gray-200"></div>
                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">Additional Information</span>
                                            <div className="h-px flex-1 bg-gray-200"></div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 gap-5">
                                            {formSchema.map((field, index) => (
                                                <div key={field.id} className="space-y-2">
                                                    <Label className="text-sm font-semibold text-gray-700">
                                                        {field.label || `Field ${index + 1}`}
                                                        {field.required && <span className="text-red-600 ml-1">*</span>}
                                                        {!field.required && <span className="text-gray-400 text-xs font-normal ml-1.5">(Optional)</span>}
                                                    </Label>
                                                    
                                                    {/* Text-based inputs */}
                                                    {['text', 'email', 'tel', 'url'].includes(field.type) && (
                                                        <Input
                                                            type={field.type}
                                                            placeholder={field.placeholder || `Enter ${field.label || 'value'}`}
                                                            disabled
                                                            className="bg-gray-50 border-gray-300 h-11 text-gray-900 placeholder:text-gray-500"
                                                        />
                                                    )}
                                                    
                                                    {/* Number */}
                                                    {field.type === 'number' && (
                                                        <Input
                                                            type="number"
                                                            placeholder={field.placeholder || 'Enter number'}
                                                            min={field.min}
                                                            max={field.max}
                                                            step={field.step}
                                                            disabled
                                                            className="bg-gray-50 border-gray-300 h-11 text-gray-900 placeholder:text-gray-500"
                                                        />
                                                    )}
                                                    
                                                    {/* Date/Time inputs */}
                                                    {['date', 'time', 'datetime-local'].includes(field.type) && (
                                                        <Input
                                                            type={field.type}
                                                            disabled
                                                            className="bg-gray-50 border-gray-300 h-11 text-gray-900"
                                                        />
                                                    )}
                                                    
                                                    {/* Textarea */}
                                                    {field.type === 'textarea' && (
                                                        <Textarea
                                                            placeholder={field.placeholder || 'Enter your response'}
                                                            rows={field.rows || 4}
                                                            maxLength={field.maxLength}
                                                            disabled
                                                            className="bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 resize-none"
                                                        />
                                                    )}
                                                    
                                                    {/* Select Dropdown */}
                                                    {field.type === 'select' && (
                                                        <Select disabled>
                                                            <SelectTrigger className="bg-gray-50 border-gray-300 h-11 text-gray-900">
                                                                <SelectValue placeholder={field.placeholder || 'Select an option'} />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {(field.options || []).filter(o => o.trim()).map((opt, oi) => (
                                                                    <SelectItem key={oi} value={opt}>{opt}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                    
                                                    {/* Radio Buttons */}
                                                    {field.type === 'radio' && (
                                                        <div className="space-y-3 pt-1">
                                                            {(field.options || []).filter(o => o.trim()).map((opt, oi) => (
                                                                <div key={oi} className="flex items-center gap-3">
                                                                    <input
                                                                        type="radio"
                                                                        id={`${field.id}-${oi}`}
                                                                        name={field.id}
                                                                        disabled
                                                                        className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                                                                    />
                                                                    <Label htmlFor={`${field.id}-${oi}`} className="text-sm font-normal text-gray-700 cursor-not-allowed">{opt}</Label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    
                                                    {/* Checkboxes */}
                                                    {field.type === 'checkbox' && (
                                                        <div className="space-y-3 pt-1">
                                                            {(field.options || []).filter(o => o.trim()).map((opt, oi) => (
                                                                <div key={oi} className="flex items-center gap-3">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={`${field.id}-${oi}`}
                                                                        disabled
                                                                        className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                                                                    />
                                                                    <Label htmlFor={`${field.id}-${oi}`} className="text-sm font-normal text-gray-700 cursor-not-allowed">{opt}</Label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    
                                                    {/* File Upload */}
                                                    {field.type === 'file' && (
                                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                                                            <div className="flex flex-col items-center gap-2">
                                                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                                                    <Upload className="h-5 w-5 text-gray-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        {field.accept ? `Accepted formats: ${field.accept}` : 'Any file type'}
                                                                        {field.maxSize && ` • Max ${field.maxSize}MB`}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Range Slider */}
                                                    {field.type === 'range' && (
                                                        <div className="space-y-3 pt-2">
                                                            <input
                                                                type="range"
                                                                min={field.min || 0}
                                                                max={field.max || 100}
                                                                step={field.step || 1}
                                                                disabled
                                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                                            />
                                                            <div className="flex justify-between text-xs font-medium text-gray-600">
                                                                <span>{field.min || 0}</span>
                                                                <span>{field.max || 100}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Color Picker */}
                                                    {field.type === 'color' && (
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                type="color"
                                                                disabled
                                                                className="h-11 w-24 rounded border border-gray-300 bg-gray-50 cursor-pointer"
                                                            />
                                                            <span className="text-sm text-gray-500">Select a color</span>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Help Text */}
                                                    {field.helpText && (
                                                        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{field.helpText}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="pt-6 border-t border-gray-200">
                                    <Button disabled className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-base shadow-sm">
                                        Complete Registration
                                        {data.fee && parseFloat(data.fee) > 0 && (
                                            <span className="ml-2 font-normal opacity-90">• Pay ৳ {parseFloat(data.fee).toFixed(2)}</span>
                                        )}
                                    </Button>
                                    <p className="text-xs text-center text-gray-500 mt-3">
                                        By registering, you agree to the event terms and conditions
                                    </p>
                                </div>

                                {/* Empty State */}
                                {formSchema.length === 0 && (
                                    <div className="text-center py-12 border-t border-gray-200 mt-6">
                                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h4 className="text-sm font-semibold text-gray-900 mb-1">No custom fields added</h4>
                                        <p className="text-xs text-gray-500">Add custom fields above to see them in the preview</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                )}

                <NavButtons />
            </div>
        </AdminAuthenticatedLayout>
    );
}
