
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/ui/badge';
import { User, CheckCircle, XCircle, MoreHorizontal, Loader2 } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserRole } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'pending' | 'inactive';
  joinDate: string;
  isVerified: boolean;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filter, setFilter] = useState<UserRole | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch users from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          const formattedUsers: UserData[] = data.map(user => ({
            id: user.id,
            name: user.name || 'Unnamed User',
            email: user.email,
            role: user.role,
            status: user.is_verified ? 'active' : 'pending',
            joinDate: new Date(user.created_at).toISOString().split('T')[0],
            isVerified: user.is_verified
          }));
          setUsers(formattedUsers);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to load users',
          description: 'There was an error loading the user data.'
        });
        
        // Fallback to mock data if Supabase fetch fails
        setUsers(mockUsers);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  // Mock users as fallback
  const mockUsers: UserData[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'customer',
      status: 'active',
      joinDate: '2023-05-15',
      isVerified: true
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'provider',
      status: 'active',
      joinDate: '2023-06-21',
      isVerified: true
    },
    {
      id: '3',
      name: 'Robert Johnson',
      email: 'robert@example.com',
      role: 'provider',
      status: 'pending',
      joinDate: '2023-07-03',
      isVerified: false
    },
    {
      id: '4',
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      role: 'customer',
      status: 'inactive',
      joinDate: '2023-04-12',
      isVerified: false
    },
    {
      id: '5',
      name: 'Admin User',
      email: 'admin@namibiaservice.com',
      role: 'admin',
      status: 'active',
      joinDate: '2023-01-01',
      isVerified: true
    },
  ];

  const filteredUsers = filter === 'all' 
    ? users 
    : users.filter(user => user.role === filter);

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'inactive') => {
    try {
      const isVerified = newStatus === 'active';
      
      // Update in Supabase
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_verified: isVerified })
        .eq('id', userId);
        
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, status: newStatus, isVerified } 
          : user
      ));
      
      toast({
        title: 'User status updated',
        description: `User status has been set to ${newStatus}.`
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: 'Failed to update user status. Please try again.'
      });
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'provider': return 'bg-blue-100 text-blue-800';
      case 'customer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Badge variant="outline" className="text-yellow-500 border-yellow-200 bg-yellow-50">Pending</Badge>;
      case 'inactive': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-semibold">User Management</h2>
          <p className="text-muted-foreground text-sm">Manage users and their permissions</p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button 
            size="sm" 
            variant={filter === 'all' ? 'primary' : 'outline'} 
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            size="sm" 
            variant={filter === 'admin' ? 'primary' : 'outline'} 
            onClick={() => setFilter('admin')}
          >
            Admins
          </Button>
          <Button 
            size="sm" 
            variant={filter === 'provider' ? 'primary' : 'outline'} 
            onClick={() => setFilter('provider')}
          >
            Providers
          </Button>
          <Button 
            size="sm" 
            variant={filter === 'customer' ? 'primary' : 'outline'} 
            onClick={() => setFilter('customer')}
          >
            Customers
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No users found matching the selected filter.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getRoleBadgeColor(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(user.status)}
                      <span className="text-sm capitalize ml-1">{user.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        {user.status === 'active' ? (
                          <DropdownMenuItem 
                            className="text-amber-600"
                            onClick={() => handleStatusChange(user.id, 'inactive')}
                          >
                            Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            className="text-green-600"
                            onClick={() => handleStatusChange(user.id, 'active')}
                          >
                            Activate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManagement;
