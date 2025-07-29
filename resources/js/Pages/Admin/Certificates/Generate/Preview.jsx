import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog';
import {
  ArrowLeft,
  Download,
  Eye,
  Save,
  Loader2,
  Award,
  User,
  CheckCircle,
} from 'lucide-react';
import html2canvas from 'html2canvas';

export default function Preview({ auth, template, certificates }) {
  const [saving, setSaving] = useState(false);
  const [previewCertificate, setPreviewCertificate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handlePreview = (certificate) => {
    setPreviewCertificate(certificate);
    setShowPreview(true);
  };

  const handleDownloadSingle = async (certificate) => {
    try {
      // Create a temporary div with the certificate content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = certificate.content;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = `${template.width?.replace('mm', '') || 297}mm`;
      tempDiv.style.height = `${template.height?.replace('mm', '') || 210}mm`;
      document.body.appendChild(tempDiv);

      // Convert to canvas and download
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      // Clean up
      document.body.removeChild(tempDiv);

      // Download
      const link = document.createElement('a');
      link.download = `${certificate.certificate_number}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      toast.error('Failed to download certificate');
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const certificateData = [];

      for (const certificate of certificates) {
        // Create a temporary div with the certificate content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = certificate.content;
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.width = `${template.width?.replace('mm', '') || 297}mm`;
        tempDiv.style.height = `${template.height?.replace('mm', '') || 210}mm`;
        document.body.appendChild(tempDiv);

        // Convert to canvas
        const canvas = await html2canvas(tempDiv, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });

        // Clean up
        document.body.removeChild(tempDiv);

        certificateData.push({
          user_id: certificate.user.id,
          template_id: template.id,
          certificate_number: certificate.certificate_number,
          image_data: canvas.toDataURL(),
        });
      }

      // Save to server
      const response = await axios.post(route('admin.certificate.generate.save'), {
        certificates: certificateData,
      });

      if (response.data.success) {
        toast.success('Certificates saved successfully');
        router.visit(route('admin.certificate.generate'));
      } else {
        toast.error(response.data.message || 'Failed to save certificates');
      }
    } catch (error) {
      toast.error('Failed to save certificates');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminAuthenticatedLayout user={auth.user}>
      <Head title="Certificate Preview" />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.visit(route('admin.certificate.generate'))}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Generate</span>
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Certificate Preview</h1>
                <p className="text-sm text-gray-500">{template.name} - {certificates.length} certificates</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Award className="w-4 h-4" />
                <span>{certificates.length} Certificates</span>
              </Badge>
              <Button 
                onClick={handleSaveAll}
                disabled={saving || certificates.length === 0}
                className="flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save All Certificates</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {certificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {certificates.map((certificate, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          {certificate.user.image ? (
                            <img 
                              src={`/storage/${certificate.user.image}`} 
                              alt={certificate.user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-sm font-semibold text-gray-900">
                            {certificate.user.name}
                          </CardTitle>
                          <p className="text-xs text-gray-600">{certificate.user.email}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="text-xs text-gray-600">
                          <div className="flex justify-between">
                            <span>Certificate No:</span>
                            <span className="font-mono">{certificate.certificate_number}</span>
                          </div>
                          {certificate.user.member_id && (
                            <div className="flex justify-between mt-1">
                              <span>Member ID:</span>
                              <span className="font-mono">{certificate.user.member_id}</span>
                            </div>
                          )}
                          {certificate.user.department && (
                            <div className="flex justify-between mt-1">
                              <span>Department:</span>
                              <span>{certificate.user.department}</span>
                            </div>
                          )}
                        </div>

                        {/* Certificate Preview Thumbnail */}
                        <div 
                          className="border rounded cursor-pointer hover:border-blue-500 transition-colors"
                          onClick={() => handlePreview(certificate)}
                        >
                          <div 
                            className="w-full h-24 bg-white rounded overflow-hidden"
                            style={{ fontSize: '4px', transform: 'scale(0.1)', transformOrigin: 'top left' }}
                            dangerouslySetInnerHTML={{ __html: certificate.content }}
                          />
                        </div>

                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => handlePreview(certificate)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Preview
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDownloadSingle(certificate)}
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Certificates Generated</h3>
                  <p className="text-gray-600 mb-4">No certificates were generated. This might be because all selected users already have certificates for this template.</p>
                  <Button onClick={() => router.visit(route('admin.certificate.generate'))}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Generate
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Preview Modal */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Certificate Preview - {previewCertificate?.user.name}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-auto p-6">
              <div className="flex justify-center">
                {previewCertificate && (
                  <div 
                    className="bg-white shadow-lg border"
                    style={{
                      width: `${template.width?.replace('mm', '') || 297}mm`,
                      height: `${template.height?.replace('mm', '') || 210}mm`,
                      maxWidth: '90vw',
                      maxHeight: '70vh',
                      transform: 'scale(0.8)',
                      transformOrigin: 'center',
                    }}
                    dangerouslySetInnerHTML={{ __html: previewCertificate.content }}
                  />
                )}
              </div>
            </div>

            <div className="border-t p-4 flex justify-between">
              <div className="text-sm text-gray-600">
                Certificate No: {previewCertificate?.certificate_number}
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => previewCertificate && handleDownloadSingle(previewCertificate)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button onClick={() => setShowPreview(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminAuthenticatedLayout>
  );
}
