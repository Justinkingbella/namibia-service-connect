// Mock implementation for auth sync functionality
// Since some tables don't exist in the schema, we provide mock functionality

import { Customer, Provider, Admin } from '@/types/auth';

export const useMockAuthSync = () => {
  const syncUserProfile = async (userId: string, role: string): Promise<Customer | Provider | Admin | null> => {
    // Mock implementation - return null for now
    console.warn(`Mock auth sync for user ${userId} with role ${role} - tables don't exist in schema`);
    return null;
  };

  return {
    syncUserProfile
  };
};