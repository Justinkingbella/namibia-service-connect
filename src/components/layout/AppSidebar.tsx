
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
  Heart,
  AlertCircle,
  CheckSquare,
  DollarSign,
  PieChart,
  Smartphone
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
        { title: 'Wallet Verification', path: '/dashboard/admin/wallet-verification', icon: Smartphone },
        { title: 'Platform Analytics', path: '/dashboard/admin/analytics', icon: BarChart },
        { title: 'Platform Controls', path: '/dashboard/admin/controls', icon: Settings },
      ];
    }

    if (user?.role === 'provider') {
      return [
        ...commonItems,
        { title: 'Services', path: '/dashboard/services', icon: Package },
        { title: 'Bookings', path: '/dashboard/bookings', icon: Calendar },
        { title: 'Earnings', path: '/dashboard/provider/reports', icon: DollarSign },
        { title: 'Payment Details', path: '/dashboard/provider/payment-details', icon: CreditCard },
        { title: 'Performance', path: '/dashboard/provider/performance', icon: PieChart },
        { title: 'Profile', path: '/dashboard/profile', icon: User },
      ];
    }

    // Default for customers
    return [
      ...commonItems,
      { title: 'Services', path: '/dashboard/services', icon: Package },
      { title: 'My Bookings', path: '/dashboard/bookings', icon: Calendar },
      { title: 'Favorites', path: '/dashboard/customer/favorites', icon: Heart },
      { title: 'Payment Methods', path: '/dashboard/customer/payment-methods', icon: CreditCard },
      { title: 'Profile', path: '/dashboard/customer/profile', icon: User },
    ];
  };

  // Get menu items based on user role
  const menuItems = getMenuItems();

  return (
    <Sidebar className="border-r bg-white shadow-sm">
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
        
        {user?.role === 'provider' && (
          <SidebarGroup>
            <SidebarGroupLabel>Financial</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === '/dashboard/provider/wallet-verification'}
                    tooltip="Wallet Verifications"
                  >
                    <Link to="/dashboard/provider/wallet-verification">
                      <CheckSquare />
                      <span>Wallet Verifications</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === '/dashboard/provider/disputes'}
                    tooltip="Payment Disputes"
                  >
                    <Link to="/dashboard/provider/disputes">
                      <AlertCircle />
                      <span>Payment Disputes</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === '/dashboard/provider/transactions'}
                    tooltip="Transaction History"
                  >
                    <Link to="/dashboard/provider/transactions">
                      <Wallet />
                      <span>Transaction History</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        
        {user?.role === 'customer' && (
          <SidebarGroup>
            <SidebarGroupLabel>Payments</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === '/dashboard/customer/wallet-verifications'}
                    tooltip="My Verifications"
                  >
                    <Link to="/dashboard/customer/wallet-verifications">
                      <CheckSquare />
                      <span>My Verifications</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === '/dashboard/customer/payment-history'}
                    tooltip="Payment History"
                  >
                    <Link to="/dashboard/customer/payment-history">
                      <CreditCard />
                      <span>Payment History</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === '/dashboard/customer/disputes'}
                    tooltip="Payment Disputes"
                  >
                    <Link to="/dashboard/customer/disputes">
                      <AlertCircle />
                      <span>Disputes</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-xs text-center text-muted-foreground">
          © {new Date().getFullYear()} Service Marketplace
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
