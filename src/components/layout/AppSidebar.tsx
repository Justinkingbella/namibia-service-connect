
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart3, 
  BookText, 
  Calendar, 
  CreditCard, 
  Globe, 
  Heart, 
  Home, 
  Mail, 
  MessageCircle, 
  Settings, 
  ShieldCheck, 
  Store, 
  Users, 
  Wallet 
} from 'lucide-react';

export const sidebarItems = (userRole: string) => {
  const common = [
    {
      name: 'Dashboard',
      icon: <Home className="h-5 w-5" />,
      path: '/dashboard',
    },
    {
      name: 'Bookings',
      icon: <Calendar className="h-5 w-5" />,
      path: '/dashboard/bookings',
    },
    {
      name: 'Messages',
      icon: <MessageCircle className="h-5 w-5" />,
      path: '/dashboard/messages',
    },
  ];

  const roleBasedItems = {
    customer: [
      {
        name: 'Payment History',
        icon: <CreditCard className="h-5 w-5" />,
        path: '/dashboard/payment-history',
      },
      {
        name: 'Favorites',
        icon: <Heart className="h-5 w-5" />,
        path: '/dashboard/favorites',
      },
      {
        name: 'Wallet Verifications',
        icon: <Wallet className="h-5 w-5" />,
        path: '/dashboard/wallet-verifications',
      },
      {
        name: 'Disputes',
        icon: <ShieldCheck className="h-5 w-5" />,
        path: '/dashboard/disputes',
      },
    ],
    provider: [
      {
        name: 'Services',
        icon: <Store className="h-5 w-5" />,
        path: '/dashboard/services',
      },
      {
        name: 'Revenue',
        icon: <BarChart3 className="h-5 w-5" />,
        path: '/dashboard/revenue',
      },
      {
        name: 'Transactions',
        icon: <CreditCard className="h-5 w-5" />,
        path: '/dashboard/transactions',
      },
      {
        name: 'Subscription',
        icon: <BookText className="h-5 w-5" />,
        path: '/dashboard/subscription',
      },
      {
        name: 'Payment Details',
        icon: <Wallet className="h-5 w-5" />,
        path: '/dashboard/payment-details',
      },
      {
        name: 'Wallet Verification',
        icon: <Wallet className="h-5 w-5" />,
        path: '/dashboard/wallet-verification',
      },
      {
        name: 'Disputes',
        icon: <ShieldCheck className="h-5 w-5" />,
        path: '/dashboard/provider/disputes',
      },
    ],
    admin: [
      {
        name: 'Platform Analytics',
        icon: <BarChart3 className="h-5 w-5" />,
        path: '/dashboard/admin/analytics',
      },
      {
        name: 'Platform Controls',
        icon: <Settings className="h-5 w-5" />,
        path: '/dashboard/admin/controls',
      },
      {
        name: 'Provider Verification',
        icon: <ShieldCheck className="h-5 w-5" />,
        path: '/dashboard/admin/provider-verification',
      },
      {
        name: 'Wallet Verification',
        icon: <Wallet className="h-5 w-5" />,
        path: '/dashboard/admin/wallet-verification',
      },
      {
        name: 'Subscription Management',
        icon: <BookText className="h-5 w-5" />,
        path: '/dashboard/admin/subscriptions',
      },
      {
        name: 'Services',
        icon: <Store className="h-5 w-5" />,
        path: '/dashboard/services',
      },
      {
        name: 'Site Settings',
        icon: <Globe className="h-5 w-5" />,
        path: '/dashboard/admin/site-settings',
      },
    ],
  };

  const commonBottom = [
    {
      name: 'Profile',
      icon: <Users className="h-5 w-5" />,
      path: userRole === 'admin' 
        ? '/dashboard/admin/profile' 
        : userRole === 'provider' 
          ? '/dashboard/provider/profile' 
          : '/dashboard/profile',
    },
    {
      name: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      path: '/dashboard/settings',
    },
  ];

  // Determine which items to show based on user role
  const roleItems = roleBasedItems[userRole as keyof typeof roleBasedItems] || [];

  return {
    top: [...common, ...roleItems],
    bottom: commonBottom,
  };
};

const AppSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const userRole = user?.role || 'customer';
  
  const { top: topItems, bottom: bottomItems } = sidebarItems(userRole);

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="h-full flex flex-col justify-between bg-white border-r">
      <div className="overflow-y-auto py-4 px-3">
        <ul className="space-y-2">
          {topItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-2 text-base font-normal rounded-lg ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-900 hover:bg-gray-100"
                  }`
                }
              >
                <span className={`${isActive(item.path) ? "text-white" : "text-gray-500"}`}>
                  {item.icon}
                </span>
                <span className="ml-3">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-3 border-t">
        <ul className="space-y-2">
          {bottomItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-2 text-base font-normal rounded-lg ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-900 hover:bg-gray-100"
                  }`
                }
              >
                <span className={`${isActive(item.path) ? "text-white" : "text-gray-500"}`}>
                  {item.icon}
                </span>
                <span className="ml-3">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default AppSidebar;
