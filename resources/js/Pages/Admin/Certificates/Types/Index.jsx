import React from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus as PlusIcon, Pencil as PencilIcon, Trash as TrashIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function CertificateTypeIndex({ types }) {
  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this certificate type?')) {
      router.delete(route('admin.certificate.types.delete', id), {
        onSuccess: () => {
          alert('Deleted successfully.');
        },
        onError: (errors) => {
          if (errors.error) {
            alert(errors.error);
          } else {
            alert('Failed to delete.');
          }
        },
      });
    }
  };

  return (
    <AdminAuthenticatedLayout header="Certificate Types">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Certificate Types</h1>
            <p className="text-muted-foreground">
              Manage and organize different types of certificates in the system
            </p>
          </div>
          <Button asChild className="gap-2">
            <a href={route('admin.certificate.types.create')}>
              <PlusIcon className="h-4 w-4" />
              Add New Type
            </a>
          </Button>
        </div>
        
        <Separator />

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>All Certificate Types</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>User Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {types.map((type, index) => (
                  <TableRow key={type.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{type.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {type.usertype}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="gap-1"
                        >
                          <a href={route('admin.certificate.types.edit', type.id)}>
                            <PencilIcon className="h-3 w-3" />
                            Edit
                          </a>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(type.id)}
                          className="gap-1"
                        >
                          <TrashIcon className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminAuthenticatedLayout>
  );
}
