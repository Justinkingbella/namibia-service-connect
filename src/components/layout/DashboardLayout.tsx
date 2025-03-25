
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/common/Logo';
import Container from '@/components/common/Container';
import { 
  Home, 
  Calendar, 
  Users, 
  Settings, 
  User, 
  LogOut, 
  Menu, 
  X,
  ChevronDown,
  Bell,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, active, onClick }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
      active 
        ? "bg-primary/10 text-primary font-medium" 
        : "text-gray-600 hover:bg-gray-100"
    )}
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Determine navigation items based on user role
  const getNavItems = () => {
    const commonItems = [
      { to: '/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
    ];

    if (user?.role === 'admin') {
      return [
        ...commonItems,
        { to: '/dashboard/users', icon: <Users size={20} />, label: 'Users' },
        { to: '/dashboard/services', icon: <Calendar size={20} />, label: 'Services' },
        { to: '/dashboard/settings', icon: <Settings size={20} />, label: 'Settings' },
      ];
    }

    if (user?.role === 'provider') {
      return [
        ...commonItems,
        { to: '/dashboard/bookings', icon: <Calendar size={20} />, label: 'Bookings' },
        { to: '/dashboard/messages', icon: <MessageSquare size={20} />, label: 'Messages' },
        { to: '/dashboard/profile', icon: <User size={20} />, label: 'Profile' },
      ];
    }

    // Customer
    return [
      ...commonItems,
      { to: '/dashboard/services', icon: <Calendar size={20} />, label: 'Book Services' },
      { to: '/dashboard/bookings', icon: <Calendar size={20} />, label: 'My Bookings' },
      { to: '/dashboard/profile', icon: <User size={20} />, label: 'Profile' },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <Container className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                className="md:hidden p-2 text-gray-600 hover:text-primary rounded-full hover:bg-gray-100"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label="Toggle menu"
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <Logo />
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-600 hover:text-primary rounded-full hover:bg-gray-100 relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="relative">
                <button 
                  className="flex items-center gap-2 py-1 px-2 rounded-full hover:bg-gray-100"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    {user?.name.charAt(0)}
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
                  <ChevronDown size={16} />
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link 
                      to="/dashboard/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link 
                      to="/dashboard/settings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button 
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      onClick={handleSignOut}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside 
          className={cn(
            "fixed inset-0 z-20 md:relative md:block transform transition-transform duration-300 ease-in-out",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
            "w-64 bg-white border-r md:bg-white md:border-r"
          )}
        >
          <div className="h-16 md:h-0 flex items-center px-4 md:hidden">
            <Logo />
          </div>
          
          <div className="p-4">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <SidebarLink 
                  key={item.label}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  onClick={() => setIsSidebarOpen(false)}
                />
              ))}
              
              <button 
                className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-red-600 hover:bg-red-50 w-full text-left"
                onClick={handleSignOut}
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-10 md:hidden" 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
