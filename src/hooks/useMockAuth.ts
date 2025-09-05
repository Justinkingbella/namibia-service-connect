// Mock implementation for 2FA functionality 
// Since the user_2fa table doesn't exist in the schema, we provide mock data

export const useMock2FA = () => {
  return {
    isEnabled: false,
    userId: null,
    secret: null,
    backupCodes: [],
    lastUpdated: null,
    
    enable2FA: async () => {
      // Mock implementation
      return { success: false, message: "2FA table not configured" };
    },
    
    disable2FA: async () => {
      // Mock implementation  
      return { success: false, message: "2FA table not configured" };
    }
  };
};