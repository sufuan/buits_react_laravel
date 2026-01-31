import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { useState, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/Components/ui/button';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css'; // Import bubble theme
import {
  Save,
  RotateCcw,
  Eye,
  ZoomIn,
  ZoomOut,
  Move,
  Type,
  Image as ImageIcon,
  QrCode,
  User,
  Download,
  ArrowLeft
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';

export default function CertificateDesigner({ editData, auth }) {
  const [elements, setElements] = useState([]);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [zoom, setZoom] = useState(0.8);
  const [selectedElement, setSelectedElement] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [editorContent, setEditorContent] = useState('');
  const [selectedTextElement, setSelectedTextElement] = useState(null);
  const [editingId, setEditingId] = useState(null); // New state for inline editing
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const Size = Quill.import('attributors/style/size');
      const Align = Quill.import('attributors/style/align');
      // Use px values for inline styles which are more reliable
      Size.whitelist = ['10px', '11px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '60px', '72px'];
      Quill.register(Size, true);
      Quill.register(Align, true);
      console.log('Quill size and align registered with inline styles');
    }
  }, []);

  useEffect(() => {
    if (editData) {
      const width = parseFloat(editData.width?.replace('mm', '') || 210);
      const height = parseFloat(editData.height?.replace('mm', '') || 297);
      setCanvasSize({ width, height });

      const templateElements = [];

      if (editData.content) {
        templateElements.push({
          id: 'content',
          type: 'content',
          x: 50,
          y: 150,
          width: width - 100,
          height: 200,
          fontSize: 16,
          fontFamily: 'Arial',
          color: '#000000',
          textAlign: 'center',
          text: editData.content,
        });
      }

      if (editData.logo_image) {
        templateElements.push({
          id: 'logo',
          type: 'image',
          src: `/storage/${editData.logo_image}`,
          x: 30,
          y: 30,
          width: 80,
          height: 80,
          alt: 'Logo',
        });
      }

      if (editData.signature_image) {
        templateElements.push({
          id: 'signature',
          type: 'image',
          src: `/storage/${editData.signature_image}`,
          x: width - 110,
          y: height - 100,
          width: 80,
          height: 80,
          alt: 'Signature',
        });
      }

      if (editData.qr_code && editData.qr_image_size) {
        const qrSize = parseInt(editData.qr_image_size) || 100;
        templateElements.push({
          id: 'qrCode',
          type: 'qr',
          text: '{qrCode}',
          x: width - qrSize - 30,
          y: 30,
          width: qrSize,
          height: qrSize,
          backgroundColor: '#f0f0f0',
          border: '2px dashed #ccc',
        });
      }

      if (editData.user_photo_style > 0) {
        const userSize = parseInt(editData.user_image_size) || 100;
        templateElements.push({
          id: 'userPhoto',
          type: 'photo',
          text: '{user_image}',
          x: 300,
          y: 50,
          width: userSize,
          height: userSize,
          style: editData.user_photo_style,
        });
      }

      if (editData.design?.design_content) {
        try {
          const savedDesign = JSON.parse(editData.design.design_content);
          if (Array.isArray(savedDesign) && savedDesign.length > 0) {
            setElements(savedDesign);
          } else {
            setElements(templateElements);
          }
        } catch (e) {
          console.error('Error parsing saved design:', e);
          setElements(templateElements);
        }
      } else {
        setElements(templateElements);
      }
    }
  }, [editData?.id]); // Only re-run when template ID changes, not on every editData change

  // Quill editor configuration
  const quillModules = {
    toolbar: [
      [{ 'font': [] }],
      // Use px values to match our whitelist
      [{ 'size': ['10px', '11px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '60px', '72px'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['clean']
    ],
  };

  const quillFormats = [
    'font', 'size', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'align', 'list', 'bullet'
  ];

  // Handle text element selection
  const handleElementClick = (elementId) => {
    setSelectedElement(elementId);
    const element = elements.find(el => el.id === elementId);
    if (element && (element.type === 'content' || element.type === 'text')) {
      setSelectedTextElement(element);
      setEditorContent(element.text || '');
    } else {
      setSelectedTextElement(null);
      setEditorContent('');
    }
  };

  // Handle inline text change
  const handleInlineChange = (id, newContent) => {
    setElements((prev) => prev.map((el) => el.id === id ? { ...el, text: newContent } : el));
    // Sync sidebar if selected
    if (selectedElement === id) {
      setEditorContent(newContent);
    }
  };

  // Update text content from editor
  const handleEditorChange = (content) => {
    setEditorContent(content);
    if (selectedTextElement) {
      console.log('=== Editor content changed ===');
      console.log('Raw content:', content);

      // Create a temporary div to parse the new content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      console.log('Parsed DOM:', tempDiv.innerHTML);

      // Collect font sizes from inline styles and Quill size classes
      const nodes = tempDiv.querySelectorAll('*');
      const fontSizes = [];

      nodes.forEach((node, index) => {
        if (!node) return;
        console.log(`Node ${index}:`, node.tagName, 'classes:', Array.from(node.classList || []), 'style:', node.style.cssText);

        let fs = null;

        // Check inline styles first (Quill should now use these with px values)
        if (node.style && node.style.fontSize) {
          fs = node.style.fontSize;
          console.log('Found inline fontSize:', fs);
        }

        // Check for Quill size classes (now with px suffix)
        if (!fs && node.classList && node.classList.length) {
          node.classList.forEach((c) => {
            console.log('Checking class:', c);
            // Match ql-size-12px patterns
            const m = c.match(/^ql-size-(\d+)px$/);
            if (m) {
              fs = m[1] + 'px';
              console.log('Found size class:', c, 'extracted:', fs);
            }
          });
        }

        if (fs) {
          const n = parseFloat(fs);
          if (!isNaN(n)) {
            fontSizes.push(n);
            console.log('Added font size:', n);
          }
        }
      });

      console.log('All found font sizes:', fontSizes);

      // Also check the root content for inline styles
      if (tempDiv.firstElementChild && tempDiv.firstElementChild.style.fontSize) {
        const rootFs = parseFloat(tempDiv.firstElementChild.style.fontSize);
        if (!isNaN(rootFs) && !fontSizes.includes(rootFs)) {
          fontSizes.push(rootFs);
          console.log('Added root font size:', rootFs);
        }
      }

      // Fallback: try to inspect the first block for family/color/align
      const firstElement = tempDiv.querySelector('p, span, div') || tempDiv.firstElementChild;
      let fontFamily = null;
      let color = null;
      let textAlign = null;
      if (firstElement) {
        if (firstElement.style && firstElement.style.fontFamily) fontFamily = firstElement.style.fontFamily.replace(/['"]/g, '');
        if (firstElement.style && firstElement.style.color) color = firstElement.style.color;
        if (firstElement.style && firstElement.style.textAlign) textAlign = firstElement.style.textAlign;
        // Quill may use classes for alignment
        if (!textAlign && firstElement.classList) {
          if (firstElement.classList.contains('ql-align-center')) textAlign = 'center';
          else if (firstElement.classList.contains('ql-align-right')) textAlign = 'right';
          else if (firstElement.classList.contains('ql-align-justify')) textAlign = 'justify';
          else if (firstElement.classList.contains('ql-align-left')) textAlign = 'left';
        }
      }

      // Choose the largest font size found (so partial changes don't default everything to a small size)
      const chosenFontSize = fontSizes.length ? Math.max(...fontSizes) : (selectedTextElement.fontSize || 16);
      console.log('Chosen font size:', chosenFontSize);

      const newStyles = {};
      if (chosenFontSize && chosenFontSize !== (selectedTextElement.fontSize || 16)) {
        newStyles.fontSize = chosenFontSize;
      }
      if (fontFamily) newStyles.fontFamily = fontFamily;
      if (color) newStyles.color = color;
      if (textAlign) newStyles.textAlign = textAlign;

      console.log('New styles to apply:', newStyles);
      console.log('Current element fontSize:', selectedTextElement.fontSize);

      // Don't strip font-size styles. Let them persist so mixed sizes work.
      // nodes.forEach((node) => { ... }); REMOVED cleanup

      const cleanedContent = tempDiv.innerHTML;
      console.log('Content with styles preserved:', cleanedContent);

      if (Object.keys(newStyles).length > 0) {
        console.log('Updating elements with new styles...');
        setElements((prev) =>
          prev.map((el) =>
            el.id === selectedTextElement.id
              ? {
                ...el,
                text: cleanedContent,
                ...newStyles, // Still update base props for fallback
              }
              : el
          )
        );

        // Keep selectedTextElement in sync so sidebar shows updated props
        setSelectedTextElement((prev) => (prev ? { ...prev, text: cleanedContent, ...newStyles } : prev));
      } else {
        console.log('No style changes detected, only updating text content');
        setElements((prev) =>
          prev.map((el) =>
            el.id === selectedTextElement.id
              ? {
                ...el,
                text: cleanedContent,
              }
              : el
          )
        );
        setSelectedTextElement((prev) => (prev ? { ...prev, text: cleanedContent } : prev));
      }
    }
  };

  const handleDragStop = (id, d) => {
    console.log(`Dragging ${id} to position:`, d);
    setElements((prev) => {
      const updated = prev.map((el) => (el.id === id ? { ...el, x: d.x, y: d.y } : el));
      console.log('Updated elements:', updated);
      return updated;
    });
  };

  const handleResize = (id, ref, position) => {
    setElements((prev) =>
      prev.map((el) =>
        el.id === id
          ? {
            ...el,
            width: ref.offsetWidth,
            height: ref.offsetHeight,
            x: position.x,
            y: position.y,
          }
          : el
      )
    );
  };

  const saveDesign = async () => {
    if (!editData?.id) return;

    setSaving(true);
    try {
      const response = await axios.post(route('admin.certificate.templates.design.update'), {
        template_id: editData.id,
        design_content: JSON.stringify(elements),
      });
      toast.success('Design saved successfully');
    } catch (error) {
      toast.error('Failed to save design: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const resetDesign = async () => {
    if (!editData?.id) return;

    if (!window.confirm('Are you sure you want to reset the design?')) return;

    try {
      const response = await axios.post(route('admin.certificate.templates.design.reset', editData.id));
      if (response.data.status === 'success') {
        router.reload();
        toast.success('Design reset successfully');
      }
    } catch (error) {
      toast.error('Failed to reset design');
    }
  };

  const previewDesign = async () => {
    if (!editData?.id) return;

    try {
      const response = await axios.post(route('admin.certificate.templates.preview'), {
        template: editData.id,
        design_content: generateHtmlFromElements(),
      });

      if (response.data.status === 'success') {
        setPreviewHtml(response.data.data);
        setShowPreview(true);
      }
    } catch (error) {
      toast.error('Failed to preview design');
    }
  };

  const generateHtmlFromElements = () => {
    return elements
      .map((el) => {
        const style = `position:absolute;left:${el.x}px;top:${el.y}px;width:${el.width}px;height:${el.height}px;`;
        if (el.type === 'image') {
          return `<img src="${el.src}" style="${style}"/>`;
        } else if (el.type === 'qr' || el.type === 'photo') {
          return `<div style="${style}">${el.text}</div>`;
        } else if (el.type === 'content' || el.type === 'text') {
          const textStyle = `${style}font-size:${el.fontSize || 16}px;font-family:${el.fontFamily || 'Arial'};color:${el.color || '#000000'};text-align:${el.textAlign || 'center'};padding:8px;`;
          return `<div style="${textStyle}">${el.text}</div>`;
        } else {
          return `<div style="${style}">${el.text}</div>`;
        }
      })
      .join('');
  };

  const handleZoomChange = (factor) => {
    setZoom(factor);
  };

  //  Scale calculator for preview
  const calculateScale = (widthMm, heightMm) => {
    const mmToPx = (mm) => mm * 3.7795; // convert mm to px
    const screenW = window.innerWidth * 0.9;
    const screenH = window.innerHeight * 0.8;

    const wPx = mmToPx(widthMm);
    const hPx = mmToPx(heightMm);

    return Math.min(screenW / wPx, screenH / hPx, 1); // never scale above 100%
  };


  return (
    <AdminAuthenticatedLayout user={auth?.user}>
      <style>{`
        .sidebar-quill .ql-toolbar {
          border: 1px solid #d1d5db;
          border-radius: 6px 6px 0 0;
          padding: 4px 8px;
          font-size: 12px;
        }
        .sidebar-quill .ql-container {
          border: 1px solid #d1d5db;
          border-top: none;
          border-radius: 0 0 6px 6px;
          font-size: 12px;
          height: 150px;
          padding: 4px;
        }
        .sidebar-quill .ql-editor {
          min-height: 110px;
          font-size: 12px;
          padding: 12px;
          margin: 2px;
          background-color: #ffffff;
          border-radius: 4px;
        }
        .sidebar-quill .ql-toolbar button {
          width: 24px;
          height: 24px;
          padding: 2px;
        }
        .sidebar-quill .ql-toolbar .ql-picker-label {
          padding: 2px 4px;
          font-size: 11px;
        }
        .ql-size-10px { font-size: 10px; }
        .ql-size-11px { font-size: 11px; }
        .ql-size-12px { font-size: 12px; }
        .ql-size-14px { font-size: 14px; }
        .ql-size-16px { font-size: 16px; }
        .ql-size-18px { font-size: 18px; }
        .ql-size-20px { font-size: 20px; }
        .ql-size-24px { font-size: 24px; }
        .ql-size-30px { font-size: 30px; }
        .ql-size-36px { font-size: 36px; }
        .ql-size-48px { font-size: 48px; }
        .ql-size-60px { font-size: 60px; }
        .ql-size-72px { font-size: 72px; }
        
        /* Size picker dropdown styling - show sizes as "12px", "14px", etc. */
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-label::before,
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-item::before {
          content: attr(data-value) !important;
        }
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="10px"]::before,
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="10px"]::before {
          content: '10px' !important;
        }
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="11px"]::before,
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="11px"]::before {
          content: '11px' !important;
        }
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="12px"]::before,
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="12px"]::before {
          content: '12px' !important;
        }
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="14px"]::before,
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="14px"]::before {
          content: '14px' !important;
        }
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="16px"]::before,
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="16px"]::before {
          content: '16px' !important;
        }
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="18px"]::before,
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="18px"]::before {
          content: '18px' !important;
        }
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="20px"]::before,
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before {
          content: '20px' !important;
        }
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="24px"]::before,
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="24px"]::before {
          content: '24px' !important;
        }
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="30px"]::before,
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="30px"]::before {
          content: '30px' !important;
        }
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="36px"]::before,
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="36px"]::before {
          content: '36px' !important;
        }
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="48px"]::before,
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="48px"]::before {
          content: '48px' !important;
        }
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="60px"]::before,
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="60px"]::before {
          content: '60px' !important;
        }
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="72px"]::before,
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="72px"]::before {
          content: '72px' !important;
        }
        
        /* Apply actual font sizes to picker items */
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="10px"]::before { font-size: 10px; }
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="11px"]::before { font-size: 11px; }
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="12px"]::before { font-size: 12px; }
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="14px"]::before { font-size: 14px; }
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="16px"]::before { font-size: 16px; }
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="18px"]::before { font-size: 18px; }
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before { font-size: 20px; }
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="24px"]::before { font-size: 24px; }
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="30px"]::before { font-size: 30px; }
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="36px"]::before { font-size: 36px; }
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="48px"]::before { font-size: 48px; }
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="60px"]::before { font-size: 60px; }
        .sidebar-quill .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="72px"]::before { font-size: 72px; }
        
        /* Size classes for content */
        .ql-snow .ql-size-10px { font-size: 10px; }
        .ql-snow .ql-size-11px { font-size: 11px; }
        .ql-snow .ql-size-12px { font-size: 12px; }
        .ql-snow .ql-size-14px { font-size: 14px; }
        .ql-snow .ql-size-16px { font-size: 16px; }
        .ql-snow .ql-size-18px { font-size: 18px; }
        .ql-snow .ql-size-20px { font-size: 20px; }
        .ql-snow .ql-size-24px { font-size: 24px; }
        .ql-snow .ql-size-30px { font-size: 30px; }
        .ql-snow .ql-size-36px { font-size: 36px; }
        .ql-snow .ql-size-48px { font-size: 48px; }
        .ql-snow .ql-size-60px { font-size: 60px; }
        .ql-snow .ql-size-72px { font-size: 72px; }

        /* Bubble theme size picker styling */
        .ql-bubble .ql-picker.ql-size .ql-picker-label::before,
        .ql-bubble .ql-picker.ql-size .ql-picker-item::before {
          content: attr(data-value) !important;
        }
        .ql-bubble .ql-picker.ql-size .ql-picker-label[data-value="10px"]::before,
        .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="10px"]::before {
          content: '10px' !important;
        }
        .ql-bubble .ql-picker.ql-size .ql-picker-label[data-value="11px"]::before,
        .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="11px"]::before {
          content: '11px' !important;
        }
        .ql-bubble .ql-picker.ql-size .ql-picker-label[data-value="12px"]::before,
        .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="12px"]::before {
          content: '12px' !important;
        }
        .ql-bubble .ql-picker.ql-size .ql-picker-label[data-value="14px"]::before,
        .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="14px"]::before {
          content: '14px' !important;
        }
        .ql-bubble .ql-picker.ql-size .ql-picker-label[data-value="16px"]::before,
        .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="16px"]::before {
          content: '16px' !important;
        }
        .ql-bubble .ql-picker.ql-size .ql-picker-label[data-value="18px"]::before,
        .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="18px"]::before {
          content: '18px' !important;
        }
        .ql-bubble .ql-picker.ql-size .ql-picker-label[data-value="20px"]::before,
        .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before {
          content: '20px' !important;
        }
        .ql-bubble .ql-picker.ql-size .ql-picker-label[data-value="24px"]::before,
        .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="24px"]::before {
          content: '24px' !important;
        }
        .ql-bubble .ql-picker.ql-size .ql-picker-label[data-value="30px"]::before,
        .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="30px"]::before {
          content: '30px' !important;
        }
        .ql-bubble .ql-picker.ql-size .ql-picker-label[data-value="36px"]::before,
        .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="36px"]::before {
          content: '36px' !important;
        }
        .ql-bubble .ql-picker.ql-size .ql-picker-label[data-value="48px"]::before,
        .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="48px"]::before {
          content: '48px' !important;
        }
        .ql-bubble .ql-picker.ql-size .ql-picker-label[data-value="60px"]::before,
        .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="60px"]::before {
          content: '60px' !important;
        }
        .ql-bubble .ql-picker.ql-size .ql-picker-label[data-value="72px"]::before,
        .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="72px"]::before {
          content: '72px' !important;
        }

        /* Apply actual font sizes to bubble picker items */
        .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="10px"]::before { font-size: 10px; }
        .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="11px"]::before { font-size: 11px; }
        .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="12px"]::before { font-size: 12px; }
        .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="14px"]::before { font-size: 14px; }
        .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="16px"]::before { font-size: 16px; }
        .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="18px"]::before { font-size: 18px; }
        .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before { font-size: 20px; }
        .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="24px"]::before { font-size: 24px; }
        .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="30px"]::before { font-size: 30px; }
        .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="36px"]::before { font-size: 36px; }
        .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="48px"]::before { font-size: 48px; }
        .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="60px"]::before { font-size: 60px; }
        .ql-bubble .ql-picker.ql-size .ql-picker-item[data-value="72px"]::before { font-size: 72px; }
      `}</style>
      <div className="min-h-screen bg-gray-50">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.visit(route('admin.certificate.templates.index'))}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Templates
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Certificate Designer</h1>
                <p className="text-sm text-gray-500">{editData?.name || 'Untitled Template'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button onClick={() => {
                const newElement = {
                  id: `text-${Date.now()}`,
                  type: 'text',
                  text: 'New Text',
                  x: 100,
                  y: 100,
                  width: 200,
                  height: 50,
                  fontSize: 16,
                  fontFamily: 'Arial',
                  color: '#000000',
                  textAlign: 'center',
                  backgroundColor: 'transparent', // Explicitly set transparent background
                };
                setElements([...elements, newElement]);
                setSelectedElement(newElement.id);
                setSelectedTextElement(newElement);
                setEditorContent(newElement.text);
              }} variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Type className="w-4 h-4 mr-2" />
                Add Text
              </Button>
              <Button onClick={resetDesign} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
              <Button onClick={previewDesign} variant="outline" size="sm">
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              <Button onClick={saveDesign} disabled={saving} size="sm">
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Design'}
              </Button>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="flex h-[calc(100vh-80px)]">
          {/* Sidebar */}
          <div className="w-64 bg-white border-r border-gray-200 p-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Design Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-2 block">Zoom Level</label>
                  <div className="grid grid-cols-3 gap-1">
                    {[0.5, 0.75, 1].map((level) => (
                      <Button
                        key={level}
                        onClick={() => handleZoomChange(level)}
                        variant={zoom === level ? 'default' : 'outline'}
                        size="sm"
                        className="text-xs"
                      >
                        {Math.round(level * 100)}%
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-2 block">Canvas Size</label>
                  <div className="text-xs text-gray-600">
                    {canvasSize.width} × {canvasSize.height} mm
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Text Editor Card */}
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Text Editor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTextElement ? (
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-2 block">
                      Edit Text Content
                    </label>
                    <div className="text-xs text-gray-500 mb-2">
                      Selected: {selectedTextElement.id}
                    </div>
                    <div className="sidebar-quill">
                      <ReactQuill
                        theme="snow"
                        value={editorContent}
                        onChange={handleEditorChange}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Enter text content..."
                        style={{ height: '150px' }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Type className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">
                      Select a text element to edit its content
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-gray-100 p-8 overflow-auto" onClick={() => {
            setEditingId(null);
            setSelectedElement(null);
            setSelectedTextElement(null);
          }}>
            <div className="flex items-center justify-center min-h-full">
              <div
                ref={canvasRef}
                className="relative bg-white shadow-2xl border border-gray-300"
                style={{
                  width: `${canvasSize.width * zoom}mm`,
                  height: `${canvasSize.height * zoom}mm`,
                  minWidth: '400px',
                  minHeight: '300px',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingId(null);
                  setSelectedElement(null);
                  setSelectedTextElement(null);
                }} // Clicking on canvas background deselects all elements
              >
                {editData?.background_image && (
                  <img
                    src={`/storage/${editData.background_image}`}
                    alt="Certificate Background"
                    className="absolute top-0 left-0 w-full h-full object-cover z-0"
                    style={{ pointerEvents: 'none' }}
                  />
                )}

                <div className="absolute top-0 left-0 w-full h-full z-10">
                  {elements.map((el) => (
                    <Rnd
                      key={`${el.id}-${el.x}-${el.y}`}
                      default={{
                        x: el.x * zoom,
                        y: el.y * zoom,
                        width: el.width * zoom,
                        height: el.height * zoom,
                      }}
                      onDragStop={(e, d) => handleDragStop(el.id, { x: d.x / zoom, y: d.y / zoom })}
                      onResizeStop={(e, direction, ref, delta, position) => {
                        handleResize(el.id, ref, { x: position.x / zoom, y: position.y / zoom });
                      }}
                      bounds="parent"
                      enableResizing={editingId !== el.id && el.type !== 'qr' && el.type !== 'photo'}
                      cancel=".no-drag"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleElementClick(el.id);
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        if (el.type === 'content' || el.type === 'text') {
                          setEditingId(el.id);
                        }
                      }}
                    >
                      <div
                        className={`
                        w-full h-full border-2 transition-all duration-200 relative group
                        ${selectedElement === el.id ? 'border-blue-500 shadow-lg' : 'border-gray-300 hover:border-gray-400'}
                        ${el.type === 'photo' && el.style === 1 ? 'rounded-full overflow-hidden' : 'rounded'}
                        ${el.type === 'qr' || el.type === 'photo' ? 'bg-gray-50' : 'bg-white/90'}
                        ${editingId === el.id ? 'z-50 cursor-text' : 'cursor-move'}
                      `}
                        style={{
                          backgroundColor: el.backgroundColor || (el.type === 'content' ? 'transparent' : '#f9f9f9'),
                          border: el.border || undefined,
                        }}
                      >
                        {/* Move Handle - Visible when selected or hovered, allows dragging even in edit mode */}
                        {(selectedElement === el.id || editingId === el.id) && (
                          <div className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full p-1 cursor-move shadow-sm z-50 hover:bg-blue-600 transition-colors" title="Drag to move">
                            <Move className="w-3 h-3" />
                          </div>
                        )}

                        {el.type === 'image' ? (
                          <img src={el.src} alt={el.alt || el.id} className="w-full h-full object-contain" />
                        ) : (el.type === 'content' || el.type === 'text') ? (
                          editingId === el.id ? (
                            <div className="no-drag h-full">
                              <ReactQuill
                                theme="bubble"
                                value={el.text}
                                onChange={(val) => handleInlineChange(el.id, val)}
                                modules={{
                                  toolbar: [
                                    [{ 'font': [] }],
                                    [{ 'size': ['10px', '11px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '60px', '72px'] }],
                                    ['bold', 'italic', 'underline'],
                                    [{ 'align': [] }],
                                    [{ 'color': [] }]
                                  ]
                                }}
                                style={{ height: '100%', fontFamily: el.fontFamily || 'Arial' }}
                              />
                            </div>
                          ) : (
                            <div
                              className="w-full h-full p-2 overflow-hidden"
                              style={{
                                fontSize: `${(el.fontSize || 16) * zoom}px`,
                                fontFamily: el.fontFamily || 'Arial',
                                color: el.color || '#000000',
                                textAlign: el.textAlign || 'center',
                                lineHeight: 1.2,
                              }}
                              dangerouslySetInnerHTML={{ __html: el.text }}
                            />
                          )
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                            {el.type === 'qr' && <QrCode className="w-6 h-6 mb-1" />}
                            {el.type === 'photo' && <User className="w-6 h-6 mb-1" />}
                            <div className="text-center">{el.text}</div>
                          </div>
                        )}
                      </div>
                    </Rnd>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Modal */}
          {showPreview && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-auto max-h-[90vh] overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-900">Certificate Preview</h2>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => {
                        const element = document.createElement('a');
                        const file = new Blob([previewHtml], { type: 'text/html' });
                        element.href = URL.createObjectURL(file);
                        element.download = `${editData?.name || 'certificate'}-preview.html`;
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button onClick={() => setShowPreview(false)} variant="outline" size="sm">
                      Close
                    </Button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="flex-1 flex items-center justify-center overflow-hidden p-4">
                  <div
                    className="relative bg-white border border-gray-300 shadow-md"
                    style={{
                      width: '297mm',
                      height: '210mm',
                      transform: `scale(${calculateScale(297, 210)})`,
                      transformOrigin: 'center center',
                    }}
                  >
                    <div
                      className="w-full h-full"
                      dangerouslySetInnerHTML={{ __html: previewHtml }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}


        </div>
      </div>
    </AdminAuthenticatedLayout>
  );
}
