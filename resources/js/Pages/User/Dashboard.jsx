import { Head, Link, router } from '@inertiajs/react';
import { UserDashboardSidebar } from "@/components/user-dashboard-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  User,
  Bell,
  Calendar,
  Award,
  BookOpen,
  Users,
  Activity,
  MapPin,
  GraduationCap,
  CreditCard
} from 'lucide-react';

export default function Dashboard({ auth }) {

  const user = auth?.user;

  // Debug: Log the auth object to see what we're getting
  console.log('Auth object:', auth);
  console.log('User object:', user);

  const handleLogout = () => {
    router.post(route('logout'));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Show loading state if user data is not available
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head title="Dashboard" />

      <SidebarProvider>
        <UserDashboardSidebar user={user} onLogout={handleLogout} />
        <SidebarInset>
          {/* Header with User Info and Logout */}
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b bg-white">
            <div className="flex items-center justify-between w-full px-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbPage className="font-semibold">Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              {/* Notification */}
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
                </Button>

                <div className="text-sm text-gray-600">
                  Welcome, <span className="font-semibold">{user?.name?.split(' ')[0]}</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex flex-1 flex-col gap-6 p-6 bg-gray-50">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-2">
                    Welcome back, {user?.name?.split(' ')[0]}! 👋
                  </h1>
                  <p className="text-blue-100">
                    Here's what's happening with your account today.
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="bg-white/20 rounded-lg p-4">
                    <Calendar className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Active</div>
                  <p className="text-xs text-muted-foreground">
                    Account approved and verified
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Member ID</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user?.member_id || 'N/A'}</div>
                  <p className="text-xs text-muted-foreground">
                    Your unique identifier
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Department</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user?.department || 'N/A'}</div>
                  <p className="text-xs text-muted-foreground">
                    Your academic department
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Session</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user?.session || 'N/A'}</div>
                  <p className="text-xs text-muted-foreground">
                    Academic session
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Profile Information */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-sm font-semibold">{user?.name || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm font-semibold">{user?.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-sm font-semibold">{user?.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Gender</label>
                      <p className="text-sm font-semibold capitalize">{user?.gender || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                      <p className="text-sm font-semibold">{formatDate(user?.date_of_birth)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Blood Group</label>
                      <p className="text-sm font-semibold">{user?.blood_group || 'Not provided'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Academic Information
                  </CardTitle>
                  <CardDescription>
                    Your educational background and details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Department</label>
                      <p className="text-sm font-semibold">{user?.department || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Session</label>
                      <p className="text-sm font-semibold">{user?.session || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Class Roll</label>
                      <p className="text-sm font-semibold">{user?.class_roll || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">User Type</label>
                      <p className="text-sm font-semibold capitalize">{user?.usertype || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Father's Name</label>
                      <p className="text-sm font-semibold">{user?.father_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Mother's Name</label>
                      <p className="text-sm font-semibold">{user?.mother_name || 'Not provided'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Address Information */}
            {(user?.current_address || user?.permanent_address) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Address Information
                  </CardTitle>
                  <CardDescription>
                    Your residential address details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user?.current_address && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Current Address</label>
                        <p className="text-sm font-semibold mt-1 p-3 bg-green-50 rounded-lg border border-green-200">
                          {user.current_address}
                        </p>
                      </div>
                    )}
                    {user?.permanent_address && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Permanent Address</label>
                        <p className="text-sm font-semibold mt-1 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          {user.permanent_address}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button asChild className="h-auto p-4 flex flex-col items-center gap-2">
                    <Link href={route('profile.edit')}>
                      <User className="h-6 w-6" />
                      <span className="text-sm">Edit Profile</span>
                    </Link>
                  </Button>

                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                    <Award className="h-6 w-6" />
                    <span className="text-sm">Certificates</span>
                  </Button>

                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                    <BookOpen className="h-6 w-6" />
                    <span className="text-sm">Resources</span>
                  </Button>

                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                    <Users className="h-6 w-6" />
                    <span className="text-sm">Community</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
