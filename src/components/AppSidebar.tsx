import { useState } from "react";
import { 
  Home, 
  FileText, 
  Upload, 
  Eye, 
  Truck, 
  History, 
  LayoutDashboard,
  LogIn,
  LogOut,
  User
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Create Report", url: "/report-form", icon: FileText },
  { title: "Upload Reference", url: "/upload-reference", icon: Upload },
  { title: "Preview Reports", url: "/preview-report", icon: Eye },
  { title: "Track Delivery", url: "/track-delivery", icon: Truck },
  { title: "Download History", url: "/download-history", icon: History },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
];

// Remove auth items as we'll handle auth dynamically

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleAuthClick = () => {
    navigate('/auth');
  };

  return (
    <Sidebar
      className="border-r border-border/50 bg-card/50 backdrop-blur-lg"
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold text-muted-foreground px-3 py-2">
            {!isCollapsed && "Navigation"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={`
                      transition-all duration-200 hover:bg-accent/50 hover:text-accent-foreground
                      ${isActive(item.url) ? 'bg-primary/10 text-primary border-r-2 border-primary font-medium' : ''}
                    `}
                  >
                    <a href={item.url} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.title}</span>}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold text-muted-foreground px-3 py-2">
            {!isCollapsed && "Account"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {user ? (
                <>
                  <SidebarMenuItem>
                    <div className="flex items-center gap-3 px-3 py-2">
                      <Avatar className="h-4 w-4">
                        <AvatarFallback className="text-xs">
                          {user.email?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {!isCollapsed && (
                        <span className="truncate text-sm font-medium">
                          {user.email}
                        </span>
                      )}
                    </div>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={handleSignOut}
                      className="transition-all duration-200 hover:bg-accent/50 hover:text-accent-foreground"
                    >
                      <LogOut className="h-4 w-4 flex-shrink-0" />
                      {!isCollapsed && <span className="truncate">Sign Out</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              ) : (
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={handleAuthClick}
                    className="transition-all duration-200 hover:bg-accent/50 hover:text-accent-foreground"
                  >
                    <LogIn className="h-4 w-4 flex-shrink-0" />
                    {!isCollapsed && <span className="truncate">Sign In</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}