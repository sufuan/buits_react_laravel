import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table';
import { Checkbox } from '@/Components/ui/checkbox';
import {
  FileText,
  Users,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  Loader2,
  Award,
  Calendar,
  Building2,
  GraduationCap,
} from 'lucide-react';

export default function Index({ auth, templates, certificateTypes, departments, sessions }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [existingCertificates, setExistingCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [pagination, setPagination] = useState({});

  // Filters
  const [filters, setFilters] = useState({
    department: 'all',
    session: 'all',
    usertype: 'all',
    search: '',
  });

  const fetchUsers = async (page = 1) => {
    if (!selectedTemplate) return;

    setLoading(true);
    try {
      // Convert 'all' values to empty strings for the API
      const apiFilters = {
        department: filters.department === 'all' ? '' : filters.department,
        session: filters.session === 'all' ? '' : filters.session,
        usertype: filters.usertype === 'all' ? '' : filters.usertype,
        search: filters.search,
      };

      const response = await axios.get(route('admin.certificate.generate.users'), {
        params: {
          ...apiFilters,
          template_id: selectedTemplate.id,
          page,
        },
      });

      setUsers(response.data.users.data);
      setPagination(response.data.users);
      setExistingCertificates(response.data.existing_certificates);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTemplate && showUserModal) {
      fetchUsers();
    }
  }, [selectedTemplate, showUserModal, filters]);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setSelectedUsers([]);
    setShowUserModal(true);
  };

  const handleUserSelect = (userId, checked) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const availableUsers = users.filter(user => !existingCertificates.includes(user.id));
      setSelectedUsers(availableUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleGenerateCertificates = async () => {
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one user');
      return;
    }

    setGenerating(true);
    try {
      router.post(route('admin.certificate.generate.certificates'), {
        template_id: selectedTemplate.id,
        user_ids: selectedUsers,
      });
    } catch (error) {
      toast.error('Failed to generate certificates');
    } finally {
      setGenerating(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const availableUsers = users.filter(user => !existingCertificates.includes(user.id));
  const selectedCount = selectedUsers.length;
  const totalAvailable = availableUsers.length;

  return (
    <AdminAuthenticatedLayout user={auth.user}>
      <Head title="Generate Certificates" />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Generate Certificates</h1>
              <p className="text-sm text-gray-600 mt-1">Create and distribute certificates to users</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Award className="w-4 h-4" />
                <span>{templates?.length || 0} Templates</span>
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Templates Grid */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Certificate Template</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {templates?.map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-500"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base font-semibold text-gray-900 line-clamp-2">
                            {template.name}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{template.type?.name}</p>
                        </div>
                        <Badge
                          variant={template.status === 1 ? "default" : "secondary"}
                          className="ml-2"
                        >
                          {template.status === 1 ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <FileText className="w-4 h-4 mr-2" />
                          <span>{template.layout === 1 ? 'Portrait' : template.layout === 2 ? 'Landscape' : 'Custom'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-2" />
                          <span>{template.generated_certificates_count || 0} Generated</span>
                        </div>
                        {template.background_image && (
                          <div className="mt-3">
                            <img
                              src={`/storage/${template.background_image}`}
                              alt="Template preview"
                              className="w-full h-20 object-cover rounded border"
                            />
                          </div>
                        )}
                      </div>
                      <Button
                        className="w-full mt-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTemplateSelect(template);
                        }}
                      >
                        <Award className="w-4 h-4 mr-2" />
                        Generate Certificates
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {(!templates || templates.length === 0) && (
                <Card className="text-center py-12">
                  <CardContent>
                    <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Templates Available</h3>
                    <p className="text-gray-600 mb-4">Create certificate templates first to generate certificates.</p>
                    <Button onClick={() => router.visit(route('admin.certificate.templates.create'))}>
                      Create Template
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* User Selection Modal */}
        <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Generate Certificates - {selectedTemplate?.name}</span>
              </DialogTitle>
              <DialogDescription>
                Select users to generate certificates for. Users who already have certificates for this template are disabled.
              </DialogDescription>
            </DialogHeader>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 border-b">
              <div>
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search by name, email, or member ID..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Select value={filters.department} onValueChange={(value) => handleFilterChange('department', value === 'all' ? '' : value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments?.filter(dept => dept && dept.trim() !== '').map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="session">Session</Label>
                <Select value={filters.session} onValueChange={(value) => handleFilterChange('session', value === 'all' ? '' : value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="All Sessions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sessions</SelectItem>
                    {sessions?.filter(session => session && session.trim() !== '').map((session) => (
                      <SelectItem key={session} value={session}>{session}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="usertype">User Type</Label>
                <Select value={filters.usertype} onValueChange={(value) => handleFilterChange('usertype', value === 'all' ? '' : value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Selection Summary */}
            <div className="flex items-center justify-between py-3 bg-gray-50 px-4 rounded">
              <div className="flex items-center space-x-4">
                <Checkbox
                  checked={selectedCount === totalAvailable && totalAvailable > 0}
                  onCheckedChange={handleSelectAll}
                  disabled={totalAvailable === 0}
                />
                <span className="text-sm font-medium">
                  Select All Available ({totalAvailable} users)
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {selectedCount} of {totalAvailable} selected
              </div>
            </div>

            {/* Users Table */}
            <div className="flex-1 overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="ml-2">Loading users...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Select</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Member ID</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Session</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => {
                      const hasExisting = existingCertificates.includes(user.id);
                      const isSelected = selectedUsers.includes(user.id);

                      return (
                        <TableRow key={user.id} className={hasExisting ? 'opacity-50' : ''}>
                          <TableCell>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => handleUserSelect(user.id, checked)}
                              disabled={hasExisting}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                {user.image ? (
                                  <img
                                    src={`/storage/${user.image}`}
                                    alt={user.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <span className="text-xs font-medium text-gray-600">
                                    {user.name.charAt(0).toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-600">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{user.member_id || '-'}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.department || '-'}</Badge>
                          </TableCell>
                          <TableCell>{user.session || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={user.usertype === 'member' ? 'default' : 'secondary'}>
                              {user.usertype || '-'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {hasExisting ? (
                              <Badge variant="secondary" className="flex items-center space-x-1">
                                <CheckCircle className="w-3 h-3" />
                                <span>Generated</span>
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="flex items-center space-x-1">
                                <AlertCircle className="w-3 h-3" />
                                <span>Pending</span>
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}

              {!loading && users.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Found</h3>
                  <p className="text-gray-600">Try adjusting your filters to find users.</p>
                </div>
              )}
            </div>

            <DialogFooter className="border-t pt-4">
              <div className="flex items-center justify-between w-full">
                <div className="text-sm text-gray-600">
                  {selectedCount} user{selectedCount !== 1 ? 's' : ''} selected
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setShowUserModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleGenerateCertificates}
                    disabled={selectedCount === 0 || generating}
                  >
                    {generating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Award className="w-4 h-4 mr-2" />
                        Generate {selectedCount} Certificate{selectedCount !== 1 ? 's' : ''}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminAuthenticatedLayout>
  );
}
