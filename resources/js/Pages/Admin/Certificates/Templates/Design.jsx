import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { useState, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/Components/ui/button';
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
  const canvasRef = useRef(null);

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
  }, [editData]);

  const handleDragStop = (id, d) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, x: d.x, y: d.y } : el))
    );
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
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-gray-100 p-8 overflow-auto">
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
                      key={el.id}
                      position={{ x: el.x * zoom, y: el.y * zoom }}
                      size={{ width: el.width * zoom, height: el.height * zoom }}
                      onDragStop={(e, d) => handleDragStop(el.id, { x: d.x / zoom, y: d.y / zoom })}
                      onResize={(e, direction, ref, delta, position) =>
                        handleResize(el.id, ref, { x: position.x / zoom, y: position.y / zoom })
                      }
                      bounds="parent"
                      enableResizing={el.type !== 'qr' && el.type !== 'photo'}
                      onClick={() => setSelectedElement(el.id)}
                    >
                      <div
                        className={`
                          w-full h-full border-2 transition-all duration-200
                          ${selectedElement === el.id ? 'border-blue-500 shadow-lg' : 'border-gray-300 hover:border-gray-400'}
                          ${el.type === 'photo' && el.style === 1 ? 'rounded-full overflow-hidden' : 'rounded'}
                          ${el.type === 'qr' || el.type === 'photo' ? 'bg-gray-50' : 'bg-white/90'}
                          cursor-move
                        `}
                        style={{
                          backgroundColor: el.backgroundColor || (el.type === 'content' ? 'transparent' : '#f9f9f9'),
                          border: el.border || undefined,
                        }}
                      >
                        {el.type === 'image' ? (
                          <img src={el.src} alt={el.alt || el.id} className="w-full h-full object-contain" />
                        ) : el.type === 'content' ? (
                          <div
                            className="w-full h-full p-2 overflow-hidden"
                            style={{
                              fontSize: `${(el.fontSize || 16) * zoom}px`,
                              fontFamily: el.fontFamily || 'Arial',
                              color: el.color || '#000000',
                              textAlign: el.textAlign || 'center',
                            }}
                            dangerouslySetInnerHTML={{ __html: el.text }}
                          />
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
