import React, { useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Plus, Pencil, FileEdit, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Separator } from '@/Components/ui/separator';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Badge } from '@/Components/ui/badge';
import { toast } from 'sonner';

export default function Index({ templates, auth }) {
  const { flash } = usePage().props;

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);
  const handleDelete = (templateId) => {
    if (window.confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      router.delete(route('admin.certificate.templates.destroy', templateId));
    }
  };

  return (
    <AdminAuthenticatedLayout user={auth.user}>
      <div className="container mx-auto py-6 px-4">
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <CardTitle className="text-2xl font-bold">Certificate Templates</CardTitle>
              <p className="text-muted-foreground mt-1">
                Manage your certificate templates and designs
              </p>
            </div>
            <Button asChild className="w-full md:w-auto" size="sm">
              <Link href={route('admin.certificate.templates.create')}>
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </Link>
            </Button>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <ScrollArea className="w-full">
              {templates.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No certificate templates found. Create your first template to get started.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <Card key={template.id} className="relative bg-card">
                      <CardContent className="pt-6">
                        <div className="flex flex-col space-y-3">
                          <div className="space-y-2">
                            <h3 className="font-semibold text-lg truncate">
                              {template.name}
                            </h3>
                            <Badge variant="secondary" className="max-w-fit">
                              {template.type?.name || 'No Type'}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="flex-1"
                            >
                              <Link href={route('admin.certificate.templates.edit', template.id)}>
                                <Pencil className="w-4 h-4 mr-1" />
                                Edit
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="flex-1"
                            >
                              <Link href={route('admin.certificate.templates.design', template.id)}>
                                <FileEdit className="w-4 h-4 mr-1" />
                                Design
                              </Link>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleDelete(template.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </AdminAuthenticatedLayout>
  );
}
