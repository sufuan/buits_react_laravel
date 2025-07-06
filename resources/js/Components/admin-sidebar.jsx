import * as React from "react"
import {
  Users,
  UserPlus,
  UserCheck,
  Shield,
  ShieldPlus,
  Calendar,
  CalendarPlus,
  HandHeart,
  Settings,
  Cog,
  Heart,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { AdminNavUser } from "@/components/admin-nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Admin navigation data
const adminNavData = {
  navMain: [
    {
      title: "User Management",
      url: "#",
      icon: Users,
      isActive: false,
      items: [
        {
          title: "All Users",
          url: "/admin/users",
        },
        {
          title: "Add User",
          url: "/admin/users/create",
        },
        {
          title: "New User Requests",
          url: "/admin/users/pending",
        },
      ],
    },
    {
      title: "Admin Management",
      url: "#",
      icon: Shield,
      items: [
        {
          title: "All Admins",
          url: "/admin/admins",
        },
        {
          title: "Create Admin",
          url: "/admin/admins/create",
        },
      ],
    },
    {
      title: "Event Management",
      url: "#",
      icon: Calendar,
      items: [
        {
          title: "All Events",
          url: "/admin/events",
        },
        {
          title: "Create Event",
          url: "/admin/events/create",
        },
      ],
    },
    {
      title: "Volunteer Management",
      url: "#",
      icon: HandHeart,
      items: [
        {
          title: "Approve Volunteer Request",
          url: "/admin/volunteers/approve",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "CMS Settings",
          url: "/admin/settings/cms",
        },
        {
          title: "Volunteer Settings",
          url: "/admin/settings/volunteer",
        },
      ],
    },
  ],
}

export function AdminSidebar({ user, ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white">
            <Shield className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-red-600">Admin Panel</span>
            <span className="truncate text-xs text-gray-500">Management System</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={adminNavData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <AdminNavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
