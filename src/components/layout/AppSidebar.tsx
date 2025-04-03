
import React from 'react';
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
  PlusCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
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
    if ((path === '/dashboard/admin' && location.pathname === '/dashboard/admin') ||
        (path === '/dashboard/provider' && location.pathname === '/dashboard/provider') ||
        (path === '/dashboard/customer' && location.pathname === '/dashboard/customer')) {
      return true;
    }
    return location.pathname.startsWith(path) && 
           path !== '/dashboard/admin' && 
           path !== '/dashboard/provider' && 
           path !== '/dashboard/customer';
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

  const getLinks = () => {
    const prefix = user?.role ? `/dashboard/${user.role}` : '/dashboard';
    
    const adminLinks = [
      { icon: Home, label: 'Dashboard', path: '/dashboard/admin' },
      { icon: Package, label: 'Services', path: '/dashboard/admin/services' },
      { icon: MessageSquare, label: 'Messages', path: '/dashboard/admin/messages' },
      { icon: Users, label: 'Users', path: '/dashboard/admin/users' },
      { icon: Clock, label: 'Verifications', path: '/dashboard/admin/wallet-verification' },
      { icon: AlertTriangle, label: 'Disputes', path: '/dashboard/admin/disputes' },
      { icon: BarChart3, label: 'Analytics', path: '/dashboard/admin/analytics' },
      { icon: Receipt, label: 'Subscriptions', path: '/dashboard/admin/subscription-management' },
      { icon: FileText, label: 'Content Editor', path: '/dashboard/admin/content-editor' },
      { icon: Settings, label: 'Site Settings', path: '/dashboard/admin/site-settings' },
      { icon: UserCircle, label: 'Profile', path: '/dashboard/admin/profile' },
    ];
    
    const providerLinks = [
      { icon: Home, label: 'Dashboard', path: '/dashboard/provider' },
      { icon: Package, label: 'Services', path: '/dashboard/provider/services' },
      { icon: PlusCircle, label: 'Create Service', path: '/dashboard/provider/services/create' },
      { icon: Calendar, label: 'Bookings', path: '/dashboard/provider/bookings' },
      { icon: MessageSquare, label: 'Messages', path: '/dashboard/provider/messages' },
      { icon: DollarSign, label: 'Transactions', path: '/dashboard/provider/transactions' },
      { icon: LineChart, label: 'Revenue Reports', path: '/dashboard/provider/revenue' },
      { icon: Receipt, label: 'Subscription', path: '/dashboard/provider/subscription' },
      { icon: Wallet, label: 'Wallet Verification', path: '/dashboard/provider/wallet-verification' },
      { icon: CreditCard, label: 'Payment Details', path: '/dashboard/provider/payment-details' },
      { icon: UserCircle, label: 'Profile', path: '/dashboard/provider/profile' },
    ];
    
    const customerLinks = [
      { icon: Home, label: 'Dashboard', path: '/dashboard/customer' },
      { icon: Package, label: 'Services', path: '/dashboard/customer/services' },
      { icon: Calendar, label: 'Bookings', path: '/dashboard/customer/bookings' },
      { icon: MessageSquare, label: 'Messages', path: '/dashboard/customer/messages' },
      { icon: Heart, label: 'Favorites', path: '/dashboard/customer/favorites' },
      { icon: CreditCard, label: 'Payment History', path: '/dashboard/customer/payment-history' },
      { icon: AlertTriangle, label: 'Disputes', path: '/dashboard/customer/disputes' },
      { icon: UserCircle, label: 'Profile', path: '/dashboard/customer/profile' },
    ];
    
    if (user?.role === 'admin') return adminLinks;
    if (user?.role === 'provider') return providerLinks;
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
