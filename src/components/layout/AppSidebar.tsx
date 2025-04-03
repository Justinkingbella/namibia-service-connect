
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

  const getLinks = () => {
    if (!user) return [];

    const adminLinks = [
      { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
      { icon: Package, label: 'Services', path: '/admin/services' },
      { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
      { icon: Users, label: 'Users', path: '/admin/users' },
      { icon: Clock, label: 'Verifications', path: '/admin/wallet-verification' },
      { icon: AlertTriangle, label: 'Disputes', path: '/admin/disputes' },
      { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
      { icon: Receipt, label: 'Subscriptions', path: '/admin/subscription-management' },
      { icon: FileText, label: 'Content Editor', path: '/admin/content-editor' },
      { icon: Settings, label: 'Site Settings', path: '/admin/site-settings' },
      { icon: UserCircle, label: 'Profile', path: '/admin/profile' },
    ];
    
    const providerLinks = [
      { icon: Home, label: 'Dashboard', path: '/provider/dashboard' },
      { icon: Package, label: 'Services', path: '/provider/services' },
      { icon: PlusCircle, label: 'Create Service', path: '/provider/services/create' },
      { icon: Calendar, label: 'Bookings', path: '/provider/bookings' },
      { icon: MessageSquare, label: 'Messages', path: '/provider/messages' },
      { icon: DollarSign, label: 'Transactions', path: '/provider/transactions' },
      { icon: LineChart, label: 'Revenue Reports', path: '/provider/revenue' },
      { icon: Receipt, label: 'Subscription', path: '/provider/subscription' },
      { icon: Wallet, label: 'Wallet Verification', path: '/provider/wallet-verification' },
      { icon: CreditCard, label: 'Payment Details', path: '/provider/payment-details' },
      { icon: UserCircle, label: 'Profile', path: '/provider/profile' },
    ];
    
    const customerLinks = [
      { icon: Home, label: 'Dashboard', path: '/customer/dashboard' },
      { icon: Package, label: 'Services', path: '/customer/services' },
      { icon: Calendar, label: 'Bookings', path: '/customer/bookings' },
      { icon: MessageSquare, label: 'Messages', path: '/customer/messages' },
      { icon: Heart, label: 'Favorites', path: '/customer/favorites' },
      { icon: CreditCard, label: 'Payment History', path: '/customer/payment-history' },
      { icon: AlertTriangle, label: 'Disputes', path: '/customer/disputes' },
      { icon: UserCircle, label: 'Profile', path: '/customer/profile' },
    ];
    
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
