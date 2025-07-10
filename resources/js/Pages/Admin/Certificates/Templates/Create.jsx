import React, { useState, useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// Import Pinyon Script font
import '@fontsource/pinyon-script';

// Custom styles for Quill fonts and dropdowns
const styles = `
  /* Font Family Styles */
  .ql-font-arial { font-family: Arial, sans-serif; }
  .ql-font-times-new-roman { font-family: "Times New Roman", Times, serif; }
  .ql-font-georgia { font-family: Georgia, serif; }
  .ql-font-verdana { font-family: Verdana, sans-serif; }
  .ql-font-helvetica { font-family: Helvetica, sans-serif; }
  .ql-font-garamond { font-family: Garamond, serif; }
  .ql-font-tahoma { font-family: Tahoma, sans-serif; }
  .ql-font-courier-new { font-family: "Courier New", Courier, monospace; }
  .ql-font-pinyon-script { font-family: "Pinyon Script", cursive; }

  /* Font picker dropdown styling */
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="arial"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="arial"]::before {
    content: 'Arial';
    font-family: 'Arial';
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="times-new-roman"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="times-new-roman"]::before {
    content: 'Times New Roman';
    font-family: 'Times New Roman';
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="georgia"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="georgia"]::before {
    content: 'Georgia';
    font-family: 'Georgia';
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="verdana"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="verdana"]::before {
    content: 'Verdana';
    font-family: 'Verdana';
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="helvetica"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="helvetica"]::before {
    content: 'Helvetica';
    font-family: 'Helvetica';
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="garamond"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="garamond"]::before {
    content: 'Garamond';
    font-family: 'Garamond';
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="tahoma"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="tahoma"]::before {
    content: 'Tahoma';
    font-family: 'Tahoma';
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="courier-new"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="courier-new"]::before {
    content: 'Courier New';
    font-family: 'Courier New';
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="pinyon-script"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="pinyon-script"]::before {
    content: 'Pinyon Script';
    font-family: 'Pinyon Script', cursive;
  }

  /* Editor content styling */
  .ql-editor {
    min-height: 300px;
    font-size: 14px;
  }

  /* Font picker dropdown improvements */
  .ql-snow .ql-picker.ql-font {
    width: 150px;
  }
  .ql-snow .ql-picker.ql-font .ql-picker-options {
    width: 150px;
  }
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Separator } from '@/Components/ui/separator';

export default function Create({ auth, types = [], canAdd = true }) {
  const { flash } = usePage().props;

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  // Helper function to safely parse JSON
  const safeJsonParse = (str, defaultValue = []) => {
    if (!str) return defaultValue;
    try {
      return JSON.parse(str);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return defaultValue;
    }
  };

  // Initialize form data with defaults (no editData for create)
  const { data, setData, post, processing, errors } = useForm({
    id: '',
    name: '',
    type_id: '',
    layout: '',
    height: '',
    width: '',
    status: 1,
    qr_code_student: ['admission_no'],
    qr_code_staff: ['staff_id'],
    user_photo_style: 1,
    user_image_size: '100',
    qr_image_size: '100',
    content: '',
    background_image: null,
    signature_image: null,
    logo_image: null,
  });

  // State for UI toggles
  const [showStudentQR, setShowStudentQR] = useState(false);
  const [showEmployeeQR, setShowEmployeeQR] = useState(false);

  // Usable tags fetched dynamically (simulate AJAX)
  const [usableTags, setUsableTags] = useState([]);

  // Ref for Quill editor
  const quillRef = React.useRef();

  // Handle certificate type change
  function onCertificateTypeChange(value) {
    setData('type_id', value);
    const selectedType = types.find(type => type.id == value);
    if (selectedType) {
      if (selectedType.usertype === 'student') {
        setShowStudentQR(true);
        setShowEmployeeQR(false);
      } else {
        setShowStudentQR(false);
        setShowEmployeeQR(true);
      }
      // Fetch usable tags for selected type
      fetchUsableTags(selectedType.id);
    } else {
      setShowStudentQR(false);
      setShowEmployeeQR(false);
      setUsableTags([]);
    }
  }

  // Simulate fetching usable tags for a given certificate type ID
  function fetchUsableTags(typeId) {
    // In real app, replace with axios/fetch call to backend
    // For demo, let's simulate some tags
    const demoTags = {
      1: ['{{student_name}}', '{{course_name}}', '{{certificate_date}}', '{{admission_no}}', '{{roll_no}}'],
      2: ['{{staff_name}}', '{{designation}}', '{{certificate_date}}', '{{staff_id}}', '{{joining_date}}'],
    };
    setUsableTags(demoTags[typeId] || ['{{default_tag}}']);
  }

  // Handle inserting tag into Quill editor
  function insertTag(tag) {
    const quill = quillRef.current.getEditor();
    const range = quill.getSelection(true);
    quill.insertText(range.index, tag, 'user');
    quill.setSelection(range.index + tag.length, 0);
  }

  // Handle layout change
  function onLayoutChange(value) {
    setData('layout', value);
    if (value === '1') { // A4 Portrait
      setData(prev => ({ ...prev, width: '210', height: '297' }));
    } else if (value === '2') { // A4 Landscape
      setData(prev => ({ ...prev, width: '297', height: '210' }));
    }
  }

  // Handle multiple select changes (for QR code text)
  function onMultiSelectChange(e, key) {
    const options = [...e.target.options].filter(o => o.selected).map(o => o.value);
    setData(key, options);
  }

  useEffect(() => {
    // user_photo_style 0 = no photo, disable size input
    // 1 = circle, 2 = square, enable size input
  }, [data.user_photo_style]);

  // Submit handler
  function onSubmit(e) {
    e.preventDefault();

    console.log('Form data before submission:', data);
    console.log('Content field specifically:', data.content);
    console.log('Content length:', data.content ? data.content.length : 'undefined');

    // Try simple object submission first (without files)
    const submitData = {
      ...data,
      qr_code_student: JSON.stringify(data.qr_code_student),
      qr_code_staff: JSON.stringify(data.qr_code_staff),
      // Remove file fields for now to test basic submission
      background_image: null,
      signature_image: null,
      logo_image: null
    };

    console.log('Submit data:', submitData);

    post(route('admin.certificate.templates.store'), {
      data: submitData,
      preserveScroll: true,
      onSuccess: (response) => {
        console.log('Template created successfully', response);
        console.log('Current URL after success:', window.location.href);
      },
      onError: (errors) => {
        console.error('Validation errors:', errors);
      },
      onFinish: () => {
        console.log('Request finished');
      }
    });
  }

  // Format file name from File object or null
  function fileName(file) {
    if (!file) return '';
    if (typeof file === 'string') return file; // existing filename string
    return file.name || '';
  }

  // React Quill toolbar options
  const quillModules = {
    toolbar: [
      [{ 'font': ['arial', 'times-new-roman', 'georgia', 'verdana', 'helvetica', 'garamond', 'tahoma', 'courier-new', 'pinyon-script'] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'header': 1 }, { 'header': 2 }, 'blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }, { 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const quillFormats = [
    'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'header', 'blockquote', 'code-block',
    'list', 'bullet', 'indent',
    'direction', 'align',
    'link', 'image', 'video'
  ];

  return (
    <AdminAuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Certificate Template</h2>}
    >
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Create New Certificate Template</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-6">
                {/* Template Name */}
                <div>
                  <Label htmlFor="name">
                    Template Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Certificate Type */}
                <div>
                  <Label>
                    Certificate Type <span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={onCertificateTypeChange}>
                    <SelectTrigger className={errors.type_id ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select certificate type" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map(type => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type_id && <p className="text-red-500 text-sm mt-1">{errors.type_id}</p>}
                </div>

                {/* Layout */}
                <div>
                  <Label>
                    Layout <span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={onLayoutChange}>
                    <SelectTrigger className={errors.layout ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select layout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">A4 Portrait</SelectItem>
                      <SelectItem value="2">A4 Landscape</SelectItem>
                      <SelectItem value="3">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.layout && <p className="text-red-500 text-sm mt-1">{errors.layout}</p>}
                </div>

                {/* Dimensions */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="width">
                      Width (mm) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="width"
                      type="number"
                      value={data.width}
                      onChange={e => setData('width', e.target.value)}
                      className={errors.width ? 'border-red-500' : ''}
                    />
                    {errors.width && <p className="text-red-500 text-sm mt-1">{errors.width}</p>}
                  </div>
                  <div>
                    <Label htmlFor="height">
                      Height (mm) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      value={data.height}
                      onChange={e => setData('height', e.target.value)}
                      className={errors.height ? 'border-red-500' : ''}
                    />
                    {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
                  </div>
                </div>

                {/* User Photo Style */}
                <div>
                  <Label>User Photo Style</Label>
                  <Select onValueChange={value => setData('user_photo_style', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select photo style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No Photo</SelectItem>
                      <SelectItem value="1">Circle</SelectItem>
                      <SelectItem value="2">Square</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* User Image Size */}
                {data.user_photo_style !== '0' && (
                  <div>
                    <Label htmlFor="user_image_size">User Image Size (px)</Label>
                    <Input
                      id="user_image_size"
                      type="number"
                      value={data.user_image_size}
                      onChange={e => setData('user_image_size', e.target.value)}
                    />
                  </div>
                )}

                {/* QR Code Size */}
                <div>
                  <Label htmlFor="qr_image_size">QR Code Size (px)</Label>
                  <Input
                    id="qr_image_size"
                    type="number"
                    value={data.qr_image_size}
                    onChange={e => setData('qr_image_size', e.target.value)}
                    min="100"
                  />
                </div>

                {/* QR Code Sections */}
                {showStudentQR && (
                  <div className="mt-6">
                    <Label>
                      QR Code Text <span className="text-red-500">*</span>
                    </Label>
                    <ScrollArea className="h-[200px] w-full border rounded-md p-4">
                      <div className="space-y-2">
                        {['admission_no', 'roll_no', 'date_of_birth', 'certificate_number', 'link'].map(option => (
                          <label key={option} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={data.qr_code_student.includes(option)}
                              onChange={e => {
                                const newValue = e.target.checked
                                  ? [...data.qr_code_student, option]
                                  : data.qr_code_student.filter(item => item !== option);
                                setData('qr_code_student', newValue);
                              }}
                              className="rounded border-gray-300"
                            />
                            <span className="capitalize">{option.replace(/_/g, ' ')}</span>
                          </label>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}

                {showEmployeeQR && (
                  <div className="mt-6">
                    <Label>
                      QR Code Text <span className="text-red-500">*</span>
                    </Label>
                    <ScrollArea className="h-[200px] w-full border rounded-md p-4">
                      <div className="space-y-2">
                        {['staff_id', 'joining_date', 'certificate_number', 'link'].map(option => (
                          <label key={option} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={data.qr_code_staff.includes(option)}
                              onChange={e => {
                                const newValue = e.target.checked
                                  ? [...data.qr_code_staff, option]
                                  : data.qr_code_staff.filter(item => item !== option);
                                setData('qr_code_staff', newValue);
                              }}
                              className="rounded border-gray-300"
                            />
                            <span className="capitalize">{option.replace(/_/g, ' ')}</span>
                          </label>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}

                {/* File Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="background_image">Background Image</Label>
                    <Input
                      id="background_image"
                      type="file"
                      accept="image/*"
                      onChange={e => setData('background_image', e.target.files[0])}
                    />
                  </div>
                  <div>
                    <Label htmlFor="logo_image">Logo Image</Label>
                    <Input
                      id="logo_image"
                      type="file"
                      accept="image/*"
                      onChange={e => setData('logo_image', e.target.files[0])}
                    />
                  </div>
                  <div>
                    <Label htmlFor="signature_image">Signature Image</Label>
                    <Input
                      id="signature_image"
                      type="file"
                      accept="image/*"
                      onChange={e => setData('signature_image', e.target.files[0])}
                    />
                  </div>
                </div>

                {/* Content with ReactQuill */}
                <div>
                  <Label htmlFor="content">
                    Content <span className="text-red-500">*</span>
                  </Label>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {usableTags.map(tag => (
                        <Button
                          key={tag}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => insertTag(tag)}
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>
                    <ReactQuill
                      ref={quillRef}
                      theme="snow"
                      value={data.content}
                      onChange={value => {
                        console.log('ReactQuill onChange:', value);
                        setData('content', value);
                      }}
                      modules={quillModules}
                      formats={quillFormats}
                      className={errors.content ? 'border-red-500' : ''}
                      placeholder="Enter certificate content..."
                    />
                  </div>
                  {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={processing}>
                    {processing ? 'Creating...' : 'Create Template'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminAuthenticatedLayout>
  );
}
