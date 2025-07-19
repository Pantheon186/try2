// Environment Configuration
export const config = {
  // Database configuration
  database: {
    useSupabase: import.meta.env.VITE_USE_SUPABASE === 'true',
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    supabaseServiceRoleKey: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '',
  },
  
  // Application settings
  app: {
    name: 'Yorke Holidays CRM',
    version: '1.0.0',
    environment: import.meta.env.MODE || 'development',
    apiTimeout: 10000, // 10 seconds
    maxRetries: 3,
  },
  
  // Feature flags
  features: {
    enableRealTimeUpdates: true,
    enableAnalytics: true,
    enableNotifications: true,
    enableFileUploads: false, // Will be enabled with Supabase
  },
  
  // UI Configuration
  ui: {
    itemsPerPage: 10,
    notificationDuration: 5000,
    autoSaveInterval: 30000, // 30 seconds
  }
};

// Validation
export const validateConfig = () => {
  if (config.database.useSupabase) {
    if (!config.database.supabaseUrl || !config.database.supabaseAnonKey) {
      throw new Error('Supabase URL and Anon Key are required when useSupabase is true');
    }
  }
};

// Initialize configuration
validateConfig();