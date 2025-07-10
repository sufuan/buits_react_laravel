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

export default function CertificateTemplateForm({ auth, types = [], editData = null, canAdd = true }) {
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

  // Helper function to safely parse QR code data
  const parseQRCode = (qrCodeData) => {
    if (!qrCodeData) return [];

    try {
      // Handle different formats of QR code data
      if (typeof qrCodeData === 'string') {
        // Remove extra quotes if present
        const cleanData = qrCodeData.replace(/^"(.*)"$/, '$1');
        return JSON.parse(cleanData);
      } else if (Array.isArray(qrCodeData)) {
        return qrCodeData;
      }
      return [];
    } catch (error) {
      console.error('Error parsing QR code data:', error, qrCodeData);
      return [];
    }
  };

  // Initialize form data with defaults or editData
  const { data, setData, post, processing, errors } = useForm({
    id: editData?.id || '',
    name: editData?.name || '',
    type_id: editData?.certificate_type_id || '',
    layout: editData?.layout || '',
    height: editData?.height ? editData.height.replace('mm', '') : '',
    width: editData?.width ? editData.width.replace('mm', '') : '',
    status: editData?.status || 1,
    qr_code_student: editData?.qr_code
      ? parseQRCode(editData.qr_code).filter(opt =>
          ['admission_no', 'roll_no', 'date_of_birth', 'certificate_number', 'link'].includes(opt)
        )
      : ['admission_no'],
    qr_code_staff: editData?.qr_code
      ? parseQRCode(editData.qr_code).filter(opt =>
          ['staff_id', 'joining_date', 'certificate_number', 'link'].includes(opt)
        )
      : ['staff_id'],
    user_photo_style: editData?.user_photo_style ?? 0,
    user_image_size: editData?.user_image_size || '',
    qr_image_size: editData?.qr_image_size || '',
    content: editData?.content || '',
    background_image: null,
    signature_image: null,
    logo_image: null,
  });

  // State for UI toggles
  const [showStudentQR, setShowStudentQR] = useState(false);
  const [showEmployeeQR, setShowEmployeeQR] = useState(false);

  // Usable tags fetched dynamically (simulate AJAX)
  const [usableTags, setUsableTags] = useState([]);

  // Update show QR sections based on selected certificate type
  useEffect(() => {
    const selectedType = types.find(t => t.id === Number(data.type_id));
    if (selectedType) {
      if (selectedType.usertype === 'student') {
        setShowStudentQR(true);
        setShowEmployeeQR(false);
      } else {
        setShowEmployeeQR(true);
        setShowStudentQR(false);
      }
      // Fetch usable tags for selected type (simulate)
      fetchUsableTags(selectedType.id);
    } else {
      setShowStudentQR(false);
      setShowEmployeeQR(false);
      setUsableTags([]);
    }
  }, [data.type_id, types]);

  // Simulate fetching usable tags for a given certificate type ID
  function fetchUsableTags(typeId) {
    // In real app, replace with axios/fetch call to backend
    // e.g., axios.post('/certificate/templateType', { type_id: typeId })...

    // For demo, let's simulate some tags
    const demoTags = {
      1: ['{{student_name}}', '{{course_name}}', '{{certificate_date}}'],
      2: ['{{staff_name}}', '{{designation}}', '{{certificate_date}}'],
    };
    setUsableTags(demoTags[typeId] || ['{{default_tag}}']);
  }

  // Handle file input changes
  function onFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setData(e.target.name, file);
    }
  }

  // Handle multiple select changes (for QR code text)
  function onMultiSelectChange(e, key) {
    const options = [...e.target.options].filter(o => o.selected).map(o => o.value);
    setData(key, options);
  }

  // Handle inserting tag into Quill editor
  function insertTag(tag) {
    const quill = quillRef.current.getEditor();
    const range = quill.getSelection(true);
    quill.insertText(range.index, tag, 'user');
    quill.setSelection(range.index + tag.length, 0);
  }

  // Quill ref for inserting tags
  const quillRef = React.useRef(null);

  // Layout change handler to auto adjust width & height
  function onLayoutChange(e) {
    const layout = e.target.value;
    setData('layout', layout);

    if (layout === '1') {
      setData('height', '297');
      setData('width', '210');
    } else if (layout === '2') {
      setData('height', '210');
      setData('width', '297');
    } else {
      setData('height', '');
      setData('width', '');
    }
  }

  // Toggle user image size input enable/disable based on photo style
  useEffect(() => {
    // user_photo_style 0 = no photo, disable size input
    // 1 = circle, 2 = square, enable size input
  }, [data.user_photo_style]);

  // Submit handler
  function onSubmit(e) {
    e.preventDefault();

    const formData = new FormData();

    // Add all form data
    Object.keys(data).forEach(key => {
      if (key === 'background_image' || key === 'signature_image' || key === 'logo_image') {
        if (data[key] && data[key] instanceof File) {
          formData.append(key, data[key]);
        }
      } else if (key === 'qr_code_student' || key === 'qr_code_staff') {
        // Convert arrays to JSON strings
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key] || '');
      }
    });

    post(route('admin.certificate.templates.store'), {
      data: formData,
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        // Handle success
        console.log('Template saved successfully');
      },
      onError: (errors) => {
        console.error('Validation errors:', errors);
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
  const modules = {
    toolbar: [
      [{ font: ['arial', 'times-new-roman', 'georgia', 'verdana', 'helvetica', 'garamond', 'tahoma', 'courier-new', 'pinyon-script'] }],
      [{ size: ['12', '14', '18', '24', '36'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['clean'],
    ],
  };

  // React Quill formats and whitelist
  const formats = [
    'font',
    'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
  ];

  // Configure Quill to recognize our custom fonts
  if (typeof window !== 'undefined') {
    const Quill = ReactQuill.Quill;
    const Font = Quill.import('formats/font');
    Font.whitelist = [
      'arial', 'times-new-roman', 'georgia', 'verdana',
      'helvetica', 'garamond', 'tahoma', 'courier-new',
      'pinyon-script'
    ];
    Quill.register(Font, true);
  }

  return (
    <AdminAuthenticatedLayout user={auth.user}>
      <div className="container mx-auto py-6 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {editData ? 'Edit Certificate Template' : 'Create Certificate Template'}
            </CardTitle>
            <Separator className="my-4" />
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} encType="multipart/form-data" id="certificate_form">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    className={errors.name ? 'border-red-500' : ''}
                    placeholder="Certificate Name"
                    autoComplete="off"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                <input type="hidden" name="id" value={data.id} />

                {/* Certificate Type Field */}
                <div className="space-y-2">
                  <Label htmlFor="type_id">
                    Certificate Type <span className="text-red-500">*</span>
                  </Label>
                  <Select value={data.type_id} onValueChange={value => setData('type_id', value)}>
                    <SelectTrigger className={errors.type_id ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select Certificate Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map(type => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type_id && <p className="text-red-500 text-sm">{errors.type_id}</p>}
                </div>

                {/* Page Layout Field */}
                <div className="space-y-2">
                  <Label htmlFor="layout">
                    Page Layout <span className="text-red-500">*</span>
                  </Label>
                  <Select value={data.layout} onValueChange={value => onLayoutChange({ target: { value } })}>
                    <SelectTrigger className={errors.layout ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select Page Layout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">A4 (Portrait)</SelectItem>
                      <SelectItem value="2">A4 (Landscape)</SelectItem>
                      <SelectItem value="3">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.layout && <p className="text-red-500 text-sm">{errors.layout}</p>}
                </div>

                {/* Height Field */}
                <div className="space-y-2">
                  <Label htmlFor="height">
                    Height (mm) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="height"
                    type="text"
                    name="height"
                    value={data.height}
                    onChange={e => setData('height', e.target.value)}
                    className={errors.height ? 'border-red-500' : ''}
                    placeholder="Enter height"
                    autoComplete="off"
                  />
                  {errors.height && <p className="text-red-500 text-sm">{errors.height}</p>}
                </div>

                {/* Width Field */}
                <div className="space-y-2">
                  <Label htmlFor="width">
                    Width (mm) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="width"
                    type="text"
                    name="width"
                    value={data.width}
                    onChange={e => setData('width', e.target.value)}
                    className={errors.width ? 'border-red-500' : ''}
                    placeholder="Enter width"
                    autoComplete="off"
                  />
                  {errors.width && <p className="text-red-500 text-sm">{errors.width}</p>}
                </div>

                {/* Status Field */}
                <div className="space-y-2">
                  <Label htmlFor="status">
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <Select value={data.status.toString()} onValueChange={value => setData('status', value)}>
                    <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Active</SelectItem>
                      <SelectItem value="2">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
                </div>
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
                  {errors.qr_code_student && <p className="text-red-500 text-sm mt-1">{errors.qr_code_student}</p>}
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
                  {errors.qr_code_staff && <p className="text-red-500 text-sm mt-1">{errors.qr_code_staff}</p>}
                </div>
              )}

              {/* Image Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="user_photo_style">User Image Shape</Label>
                  <Select value={data.user_photo_style.toString()} onValueChange={value => setData('user_photo_style', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select User Image Shape" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No Photo</SelectItem>
                      <SelectItem value="1">Circle</SelectItem>
                      <SelectItem value="2">Square</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user_image_size">User Image Size (px)</Label>
                  <Input
                    type="number"
                    value={data.user_image_size}
                    onChange={e => setData('user_image_size', e.target.value)}
                    min="0"
                    disabled={data.user_photo_style === '0' || data.user_photo_style === ''}
                    placeholder="Enter user image size"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qr_image_size">QR Image Size (px)</Label>
                  <Input
                    type="number"
                    value={data.qr_image_size}
                    onChange={e => setData('qr_image_size', e.target.value)}
                    min="0"
                    placeholder="Enter QR code image size"
                  />
                </div>
              </div>

              {/* File Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <div className="space-y-2">
                  <Label>Background Image</Label>
                  <Input
                    type="file"
                    name="background_image"
                    onChange={onFileChange}
                    accept="image/*"
                    className="cursor-pointer"
                  />
                  {fileName(data.background_image) && (
                    <p className="text-sm text-gray-500">{fileName(data.background_image)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Signature Image</Label>
                  <Input
                    type="file"
                    name="signature_image"
                    onChange={onFileChange}
                    accept="image/*"
                    className="cursor-pointer"
                  />
                  {fileName(data.signature_image) && (
                    <p className="text-sm text-gray-500">{fileName(data.signature_image)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Logo Image</Label>
                  <Input
                    type="file"
                    name="logo_image"
                    onChange={onFileChange}
                    accept="image/*"
                    className="cursor-pointer"
                  />
                  {fileName(data.logo_image) && (
                    <p className="text-sm text-gray-500">{fileName(data.logo_image)}</p>
                  )}
                </div>
              </div>

              {/* Certificate Body */}
              <div className="mt-6 space-y-2">
                <Label>
                  Certificate Body <span className="text-red-500">*</span>
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
                  <div className="quill-editor-container" style={{ minHeight: '400px' }}>
                    <ReactQuill
                      ref={quillRef}
                      theme="snow"
                      value={data.content}
                      onChange={value => {
                        console.log('ReactQuill onChange (Edit):', value);
                        setData('content', value);
                      }}
                      modules={modules}
                      formats={formats}
                      className="bg-white rounded-md h-[300px]"
                      style={{
                        height: '300px',
                      }}
                      placeholder="Enter certificate content..."
                    />
                  </div>
                  <style jsx global>{`
                    @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap');
                    .quill-editor-container .ql-container {
                      height: calc(300px - 42px); /* 42px is the toolbar height */
                      font-size: 16px;
                      font-family: Arial, sans-serif;
                    }
                    .ql-font-arial { font-family: Arial, sans-serif; }
                    .ql-font-times-new-roman { font-family: 'Times New Roman', Times, serif; }
                    .ql-font-georgia { font-family: Georgia, serif; }
                    .ql-font-verdana { font-family: Verdana, Geneva, sans-serif; }
                    .ql-font-helvetica { font-family: Helvetica, Arial, sans-serif; }
                    .ql-font-garamond { font-family: Garamond, serif; }
                    .ql-font-tahoma { font-family: Tahoma, Geneva, sans-serif; }
                    .ql-font-courier-new { font-family: 'Courier New', Courier, monospace; }
                    
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

                    .quill-editor-container .ql-toolbar {
                      border-top-left-radius: 0.375rem;
                      border-top-right-radius: 0.375rem;
                      background-color: #f9fafb;
                      border-color: #e5e7eb;
                    }
                    .quill-editor-container .ql-container {
                      border-bottom-left-radius: 0.375rem;
                      border-bottom-right-radius: 0.375rem;
                      border-color: #e5e7eb;
                    }
                    .quill-editor-container .ql-editor {
                      min-height: 100%;
                      font-size: 16px;
                      line-height: 1.5;
                      padding: 1rem;
                    }
                    .quill-editor-container .ql-snow .ql-picker.ql-size .ql-picker-label::before,
                    .quill-editor-container .ql-snow .ql-picker.ql-size .ql-picker-item::before {
                      content: attr(data-value) !important;
                    }
                    .quill-editor-container .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="12"]::before,
                    .quill-editor-container .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="12"]::before {
                      content: '12px' !important;
                    }
                    .quill-editor-container .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="14"]::before,
                    .quill-editor-container .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="14"]::before {
                      content: '14px' !important;
                    }
                    .quill-editor-container .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="18"]::before,
                    .quill-editor-container .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="18"]::before {
                      content: '18px' !important;
                    }
                    .quill-editor-container .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="24"]::before,
                    .quill-editor-container .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="24"]::before {
                      content: '24px' !important;
                    }
                    .quill-editor-container .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="36"]::before,
                    .quill-editor-container .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="36"]::before {
                      content: '36px' !important;
                    }
                    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="12"]::before { font-size: 12px; }
                    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="14"]::before { font-size: 14px; }
                    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="18"]::before { font-size: 18px; }
                    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="24"]::before { font-size: 24px; }
                    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="36"]::before { font-size: 36px; }
                    .ql-snow .ql-size-12 { font-size: 12px; }
                    .ql-snow .ql-size-14 { font-size: 14px; }
                    .ql-snow .ql-size-18 { font-size: 18px; }
                    .ql-snow .ql-size-24 { font-size: 24px; }
                    .ql-snow .ql-size-36 { font-size: 36px; }
                  `}</style>
                </div>
                {errors.body && <p className="text-red-500 text-sm">{errors.body}</p>}
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <Button
                  type="submit"
                  className="w-full md:w-auto"
                  disabled={!canAdd || processing}
                  title={canAdd ? '' : "You don't have permission to add"}
                >
                  {editData ? 'Update Template' : 'Create Template'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminAuthenticatedLayout>
  );
}
