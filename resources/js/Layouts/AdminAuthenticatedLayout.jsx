import { AdminSidebar } from '@/components/admin-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Toaster } from '@/components/ui/sonner';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function AdminAuthenticatedLayout({ header, children, pendingUsersCount = 0 }) {
    const admin = usePage().props.auth.admin;

    useEffect(() => {
        if (!admin) {
            window.location.href = route('admin.login');
        }
    }, [admin]);

    return (
        <SidebarProvider>
            <AdminSidebar user={admin} pendingUsersCount={pendingUsersCount} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/admin/dashboard">
                                        Admin Dashboard
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-2 sm:gap-4 p-2 sm:p-4 pt-0">
                    {header && (
                        <div className="flex-1 rounded-lg sm:rounded-xl bg-muted/50">
                            <div className="p-3 sm:p-6">
                                {header}
                            </div>
                        </div>
                    )}
                    <main className="flex-1 rounded-lg sm:rounded-xl bg-muted/50">
                        <div className="p-3 sm:p-6">
                            {children}
                        </div>
                    </main>
                </div>
            </SidebarInset>
            <Toaster />
        </SidebarProvider>
    );
}
