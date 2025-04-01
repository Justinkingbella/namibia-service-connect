
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileClock, 
  Settings, 
  BellRing, 
  User, 
  Users, 
  LineChart, 
  ShieldCheck, 
  FolderOpen, 
  HelpCircle, 
  CreditCard, 
  DollarSign,
  Landmark,
  Receipt
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const customerItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Services',
    href: '/dashboard/services',
    icon: FolderOpen,
  },
  {
    title: 'Bookings',
    href: '/dashboard/bookings',
    icon: FileClock,
  },
  {
    title: 'Messages',
    href: '/dashboard/messages',
    icon: MessageSquare,
  },
  {
    title: 'Favorites',
    href: '/dashboard/customer/favorites',
    icon: BellRing,
  },
  {
    title: 'Payment History',
    href: '/dashboard/customer/payment-history',
    icon: Receipt,
  },
  {
    title: 'Disputes',
    href: '/dashboard/customer/disputes',
    icon: HelpCircle,
  },
  {
    title: 'Profile',
    href: '/dashboard/customer/profile',
    icon: User,
  },
];

const providerItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'My Services',
    href: '/dashboard/services',
    icon: FolderOpen,
  },
  {
    title: 'Bookings',
    href: '/dashboard/bookings',
    icon: FileClock,
  },
  {
    title: 'Messages',
    href: '/dashboard/messages',
    icon: MessageSquare,
  },
  {
    title: 'Revenue Reports',
    href: '/dashboard/provider/reports',
    icon: LineChart,
  },
  {
    title: 'Subscription',
    href: '/dashboard/provider/subscription',
    icon: CreditCard,
  },
  {
    title: 'Transactions',
    href: '/dashboard/provider/transactions',
    icon: DollarSign,
  },
  {
    title: 'Payment Details',
    href: '/dashboard/provider/payment-details',
    icon: Landmark,
  },
  {
    title: 'Disputes',
    href: '/dashboard/provider/disputes',
    icon: HelpCircle,
  },
];

const adminItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'User Management',
    href: '/dashboard/users',
    icon: Users,
  },
  {
    title: 'Provider Verification',
    href: '/dashboard/admin/providers/verification',
    icon: ShieldCheck,
  },
  {
    title: 'Wallet Verification',
    href: '/dashboard/admin/wallet-verification',
    icon: CreditCard,
  },
  {
    title: 'Platform Analytics',
    href: '/dashboard/admin/analytics',
    icon: LineChart,
  },
  {
    title: 'Platform Controls',
    href: '/dashboard/admin/controls',
    icon: Settings,
  },
  {
    title: 'Subscription Plans',
    href: '/dashboard/admin/subscriptions',
    icon: Receipt,
  },
];

export function AppSidebar() {
  const { user } = useAuth();
  const location = useLocation();
  
  const items = user?.role === 'admin' ? adminItems : 
                user?.role === 'provider' ? providerItems : 
                customerItems;

  return (
    <div className="h-full flex flex-col border-r bg-card pt-2">
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 gap-2">
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                location.pathname === item.href && "bg-accent text-accent-foreground",
                (location.pathname.includes(item.href) && item.href !== '/dashboard') && "bg-accent/50 text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Separator className="mb-4" />
        <nav>
          <Link
            to="/dashboard/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
              location.pathname === '/dashboard/settings' && "bg-accent text-accent-foreground"
            )}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default AppSidebar;
