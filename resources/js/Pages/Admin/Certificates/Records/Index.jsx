import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table';
import {
  Award,
  Search,
  Download,
  Eye,
  User,
  Calendar,
  FileText,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function Index({ auth, records }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = records.data.filter((record) =>
    record.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.certificate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.user.member_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (certificatePath) => {
    window.open(`/storage/${certificatePath}`, '_blank');
  };

  const handleVerify = (certificateNumber) => {
    window.open(route('certificate.verify', certificateNumber), '_blank');
  };

  return (
    <AdminAuthenticatedLayout user={auth.user}>
      <Head title="Certificate Records" />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Certificate Records</h1>
                  <p className="text-gray-600 mt-1">Manage and view all issued certificates</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="px-4 py-2 text-lg">
                  <FileText className="w-4 h-4 mr-2" />
                  {records.total} Total
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <Card className="mb-6 border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search by name, certificate number, or member ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                <Button variant="outline" className="h-12 px-6">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Records Table */}
          <Card className="border-none shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardTitle className="text-xl">Issued Certificates</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {filteredRecords.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="font-semibold">User</TableHead>
                        <TableHead className="font-semibold">Certificate No.</TableHead>
                        <TableHead className="font-semibold">Template</TableHead>
                        <TableHead className="font-semibold">Issued Date</TableHead>
                        <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record) => (
                        <TableRow key={record.id} className="hover:bg-blue-50/50 transition-colors">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                                {record.user.image ? (
                                  <img
                                    src={`/storage/${record.user.image}`}
                                    alt={record.user.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <User className="w-5 h-5 text-white" />
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{record.user.name}</p>
                                <p className="text-sm text-gray-500">{record.user.email}</p>
                                {record.user.member_id && (
                                  <p className="text-xs text-gray-400 font-mono">
                                    ID: {record.user.member_id}
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded-md">
                              {record.certificate_number}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Award className="w-4 h-4 text-blue-600" />
                              <span className="font-medium text-gray-900">
                                {record.template?.name || 'N/A'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(record.created_at).toLocaleDateString()}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleVerify(record.certificate_number)}
                                className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Verify
                              </Button>
                              {record.certificate_path && (
                                <Button
                                  size="sm"
                                  onClick={() => handleDownload(record.certificate_path)}
                                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  Download
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-16">
                  <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No certificates found</h3>
                  <p className="text-gray-500">
                    {searchTerm
                      ? 'Try adjusting your search criteria'
                      : 'No certificates have been issued yet'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {records.last_page > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {records.from} to {records.to} of {records.total} results
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!records.prev_page_url}
                  onClick={() => router.visit(records.prev_page_url)}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {records.current_page} of {records.last_page}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!records.next_page_url}
                  onClick={() => router.visit(records.next_page_url)}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminAuthenticatedLayout>
  );
}
