
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Calendar, 
  Users, 
  Settings, 
  CreditCard, 
  Heart, 
  MessageSquare, 
  User,
  FileText,
  AlertTriangle,
  Clock,
  BarChart,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { type UserRole } from '@/types/auth';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarGroup, SidebarMenuItem, SidebarTrigger } from '@/components/ui/sidebar';

export function AppSidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine which navigation items to show based on user role
  const getNavItems = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return [
          { path: '/dashboard', label: 'Dashboard', icon: Home },
          { path: '/dashboard/users', label: 'Users', icon: Users },
          { path: '/dashboard/admin/providers/verification', label: 'Provider Verification', icon: Clock },
          { path: '/dashboard/services', label: 'Services', icon: Package },
          { path: '/dashboard/admin/wallet-verification', label: 'Wallet Verification', icon: CreditCard },
          { path: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
          { path: '/dashboard/admin/analytics', label: 'Analytics', icon: BarChart },
          { path: '/dashboard/admin/profile', label: 'My Profile', icon: User },
          { path: '/dashboard/settings', label: 'Settings', icon: Settings },
        ];
      case 'provider':
        return [
          { path: '/dashboard', label: 'Dashboard', icon: Home },
          { path: '/dashboard/services', label: 'My Services', icon: Package },
          { path: '/dashboard/bookings', label: 'Bookings', icon: Calendar },
          { path: '/dashboard/provider/transactions', label: 'Payments', icon: CreditCard },
          { path: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
          { path: '/dashboard/provider/reports', label: 'Reports', icon: FileText },
          { path: '/dashboard/provider/disputes', label: 'Disputes', icon: AlertTriangle },
          { path: '/dashboard/provider/profile', label: 'My Profile', icon: User },
          { path: '/dashboard/settings', label: 'Settings', icon: Settings },
        ];
      case 'customer':
      default:
        return [
          { path: '/dashboard', label: 'Dashboard', icon: Home },
          { path: '/dashboard/services', label: 'Find Services', icon: Package },
          { path: '/dashboard/bookings', label: 'My Bookings', icon: Calendar },
          { path: '/dashboard/customer/favorites', label: 'Favorites', icon: Heart },
          { path: '/dashboard/customer/payment-history', label: 'Payment History', icon: CreditCard },
          { path: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
          { path: '/dashboard/customer/disputes', label: 'Disputes', icon: AlertTriangle },
          { path: '/dashboard/customer/profile', label: 'My Profile', icon: User },
          { path: '/dashboard/settings', label: 'Settings', icon: Settings },
        ];
    }
  };
  
  const navItems = user ? getNavItems(user.role) : [];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="text-xl font-bold pl-4 py-2 flex items-center">
          <Briefcase className="mr-2 h-6 w-6" />
          <span>Namibia Services</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <div 
                  className={cn(
                    "flex items-center p-3 rounded-lg cursor-pointer", 
                    location.pathname === item.path ? "bg-primary/10 text-primary font-medium" : "hover:bg-gray-100"
                  )}
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Namibia Services
          </div>
          <SidebarTrigger className="h-7 w-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
