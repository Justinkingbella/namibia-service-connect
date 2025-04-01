
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
  SidebarMenuButton,
  useSidebar
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
  Smartphone,
  FileText,
  Clock
} from 'lucide-react';

export function AppSidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const { isMobile, state } = useSidebar();
  
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

  // Financial menu items for provider
  const providerFinancialItems = [
    { 
      title: 'Wallet Verifications', 
      path: '/dashboard/provider/wallet-verification', 
      icon: CheckSquare 
    },
    { 
      title: 'Payment Disputes', 
      path: '/dashboard/provider/disputes', 
      icon: AlertCircle 
    },
    { 
      title: 'Transaction History', 
      path: '/dashboard/provider/transactions', 
      icon: Wallet 
    },
  ];

  // Financial menu items for customer
  const customerFinancialItems = [
    { 
      title: 'My Verifications', 
      path: '/dashboard/customer/wallet-verifications', 
      icon: CheckSquare 
    },
    { 
      title: 'Payment History', 
      path: '/dashboard/customer/payment-history', 
      icon: CreditCard 
    },
    { 
      title: 'Disputes', 
      path: '/dashboard/customer/disputes', 
      icon: AlertCircle 
    },
  ];

  return (
    <Sidebar className="border-r bg-white shadow-sm z-20">
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
                    tooltip={state === "collapsed" ? item.title : undefined}
                  >
                    <Link to={item.path}>
                      <item.icon className="flex-shrink-0" />
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
                {providerFinancialItems.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === item.path}
                      tooltip={state === "collapsed" ? item.title : undefined}
                    >
                      <Link to={item.path}>
                        <item.icon className="flex-shrink-0" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        
        {user?.role === 'customer' && (
          <SidebarGroup>
            <SidebarGroupLabel>Payments</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {customerFinancialItems.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === item.path}
                      tooltip={state === "collapsed" ? item.title : undefined}
                    >
                      <Link to={item.path}>
                        <item.icon className="flex-shrink-0" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Only show the booking system group for provider and customer roles */}
        {(user?.role === 'provider' || user?.role === 'customer') && (
          <SidebarGroup>
            <SidebarGroupLabel>Booking System</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname.includes('/dashboard/bookings/')}
                    tooltip={state === "collapsed" ? "Manage Bookings" : undefined}
                  >
                    <Link to="/dashboard/bookings">
                      <Calendar className="flex-shrink-0" />
                      <span>Manage Bookings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === `/dashboard/${user?.role === 'provider' ? 'provider' : 'customer'}/upcoming`}
                    tooltip={state === "collapsed" ? "Upcoming" : undefined}
                  >
                    <Link to={`/dashboard/${user?.role === 'provider' ? 'provider' : 'customer'}/upcoming`}>
                      <Clock className="flex-shrink-0" />
                      <span>Upcoming</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === `/dashboard/${user?.role === 'provider' ? 'provider' : 'customer'}/history`}
                    tooltip={state === "collapsed" ? "History" : undefined}
                  >
                    <Link to={`/dashboard/${user?.role === 'provider' ? 'provider' : 'customer'}/history`}>
                      <FileText className="flex-shrink-0" />
                      <span>Booking History</span>
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
