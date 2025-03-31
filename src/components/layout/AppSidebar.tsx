
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';

import { 
  Home, 
  Calendar, 
  Settings, 
  User, 
  CreditCard, 
  MessageSquare, 
  Package, 
  Users, 
  BarChart, 
  Shield, 
  Wallet, 
  Heart
} from 'lucide-react';

export function AppSidebar() {
  const { user } = useAuth();
  const location = useLocation();
  
  // Determine which menu items to show based on user role
  const getMenuItems = () => {
    // Common items for all users
    const commonItems = [
      { title: 'Dashboard', path: '/dashboard', icon: Home },
      { title: 'Messages', path: '/dashboard/messages', icon: MessageSquare },
      { title: 'Settings', path: '/dashboard/settings', icon: Settings },
    ];

    if (user?.role === 'admin') {
      return [
        ...commonItems,
        { title: 'Users', path: '/dashboard/users', icon: Users },
        { title: 'Provider Verification', path: '/dashboard/admin/providers/verification', icon: Shield },
        { title: 'Platform Analytics', path: '/dashboard/admin/analytics', icon: BarChart },
        { title: 'Platform Controls', path: '/dashboard/admin/controls', icon: Settings },
      ];
    }

    if (user?.role === 'provider') {
      return [
        ...commonItems,
        { title: 'Services', path: '/dashboard/services', icon: Package },
        { title: 'Bookings', path: '/dashboard/bookings', icon: Calendar },
        { title: 'Earnings', path: '/dashboard/provider/reports', icon: Wallet },
        { title: 'Profile', path: '/dashboard/profile', icon: User },
      ];
    }

    // Default for customers
    return [
      ...commonItems,
      { title: 'Services', path: '/dashboard/services', icon: Package },
      { title: 'My Bookings', path: '/dashboard/bookings', icon: Calendar },
      { title: 'Favorites', path: '/dashboard/customer/favorites', icon: Heart },
      { title: 'Profile', path: '/dashboard/customer/profile', icon: User },
    ];
  };

  // Get menu items based on user role
  const menuItems = getMenuItems();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="text-lg font-semibold">Service Marketplace</div>
        <div className="text-xs text-muted-foreground">{user?.role}</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.path}
                    tooltip={item.title}
                  >
                    <Link to={item.path}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-xs text-center text-muted-foreground">
          © {new Date().getFullYear()} Service Marketplace
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
