import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Calendar, 
  Users, 
  Settings, 
  CreditCard, 
  BarChart3, 
  Clock,
  UserCircle,
  Heart,
  MessageSquare,
  HelpCircle,
  Wallet,
  DollarSign,
  Receipt,
  AlertTriangle,
  LineChart,
  FileText,
  PlusCircle,
  Globe,
  Sliders,
  Database,
  Layout,
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { AdminRoutes, ProviderRoutes, CustomerRoutes } from '@/types/routes';
import { 
  Sidebar, 
  SidebarContent,
  SidebarHeader,
  SidebarTrigger
} from '@/components/ui/sidebar';

const AppSidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getRoleTitle = () => {
    if (!user) return 'Dashboard';

    switch (user.role) {
      case 'admin':
        return 'Admin Dashboard';
      case 'provider':
        return 'Provider Dashboard';
      case 'customer':
        return 'Customer Dashboard';
      default:
        return 'Dashboard';
    }
  };

  const adminLinks = [
    { icon: Home, label: 'Dashboard', path: AdminRoutes.DASHBOARD },
    { icon: Users, label: 'Users', path: AdminRoutes.USERS },
    { icon: Package, label: 'Services', path: AdminRoutes.SERVICES },
    { icon: MessageSquare, label: 'Messages', path: AdminRoutes.MESSAGES },
    { icon: Clock, label: 'Wallet Verifications', path: AdminRoutes.WALLET_VERIFICATION },
    { icon: AlertTriangle, label: 'Disputes', path: AdminRoutes.DISPUTES },
    { icon: BarChart3, label: 'Analytics', path: AdminRoutes.ANALYTICS },
    { icon: Receipt, label: 'Subscriptions', path: AdminRoutes.SUBSCRIPTION_MANAGEMENT },
    { icon: FileText, label: 'Content Editor', path: AdminRoutes.CONTENT_EDITOR },
    { icon: Layout, label: 'Booking Settings', path: AdminRoutes.BOOKING_SETTINGS },
    { icon: Tag, label: 'Category Management', path: AdminRoutes.CATEGORY_MANAGEMENT },
    { icon: Database, label: 'Payment Settings', path: AdminRoutes.PAYMENT_SETTINGS },
    { icon: Sliders, label: 'Platform Controls', path: AdminRoutes.PLATFORM_CONTROLS },
    { icon: Globe, label: 'Site Settings', path: AdminRoutes.SITE_SETTINGS },
    { icon: UserCircle, label: 'Profile', path: AdminRoutes.PROFILE },
    { icon: Settings, label: 'Settings', path: AdminRoutes.SETTINGS },
  ];

  const providerLinks = [
    { icon: Home, label: 'Dashboard', path: ProviderRoutes.DASHBOARD },
    { icon: Package, label: 'Services', path: ProviderRoutes.SERVICES },
    { icon: PlusCircle, label: 'Create Service', path: ProviderRoutes.CREATE_SERVICE },
    { icon: Calendar, label: 'Bookings', path: ProviderRoutes.BOOKINGS },
    { icon: MessageSquare, label: 'Messages', path: ProviderRoutes.MESSAGES },
    { icon: DollarSign, label: 'Transactions', path: ProviderRoutes.TRANSACTIONS },
    { icon: LineChart, label: 'Revenue Reports', path: ProviderRoutes.REVENUE },
    { icon: Receipt, label: 'Subscription', path: ProviderRoutes.SUBSCRIPTION },
    { icon: Wallet, label: 'Wallet Verification', path: ProviderRoutes.WALLET_VERIFICATION },
    { icon: CreditCard, label: 'Payment Details', path: ProviderRoutes.PAYMENT_DETAILS },
    { icon: UserCircle, label: 'Profile', path: ProviderRoutes.PROFILE },
  ];

  const customerLinks = [
    { icon: Home, label: 'Dashboard', path: CustomerRoutes.DASHBOARD },
    { icon: Package, label: 'Services', path: CustomerRoutes.SERVICES },
    { icon: Calendar, label: 'Bookings', path: CustomerRoutes.BOOKINGS },
    { icon: MessageSquare, label: 'Messages', path: CustomerRoutes.MESSAGES },
    { icon: Heart, label: 'Favorites', path: CustomerRoutes.FAVORITES },
    { icon: CreditCard, label: 'Payment History', path: CustomerRoutes.PAYMENT_HISTORY },
    { icon: AlertTriangle, label: 'Disputes', path: CustomerRoutes.DISPUTES },
    { icon: UserCircle, label: 'Profile', path: CustomerRoutes.PROFILE },
  ];

  const getLinks = () => {
    if (!user) return [];

    if (user.role === 'admin') return adminLinks;
    if (user.role === 'provider') return providerLinks;
    return customerLinks;
  };

  return (
    <Sidebar className="border-r h-[calc(100vh-60px)] z-20 mt-[60px]">
      <SidebarHeader className="h-14 flex items-center px-4">
        <SidebarTrigger className="h-8 w-8 p-0" />
        <span className="ml-2 text-xl font-semibold">{getRoleTitle()}</span>
      </SidebarHeader>

      <SidebarContent className="pt-2">
        <nav className="space-y-1 px-2">
          {getLinks().map((link) => (
            <a
              key={link.path}
              href={link.path}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive(link.path)
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700 hover:bg-gray-100"
              )}
              onClick={(e) => {
                e.preventDefault();
                navigate(link.path);
              }}
            >
              <link.icon className="mr-3 h-5 w-5" />
              <span>{link.label}</span>
            </a>
          ))}
        </nav>

        <div className="mt-auto border-t pt-4 px-2 pb-2">
          <a
            href="/help"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
            onClick={(e) => {
              e.preventDefault();
              navigate('/help');
            }}
          >
            <HelpCircle className="mr-3 h-5 w-5" />
            <span>Help Center</span>
          </a>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
