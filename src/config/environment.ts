// Environment Configuration
export const config = {
  // Database configuration
  database: {
    useSupabase: import.meta.env.VITE_USE_SUPABASE === 'true' && 
                 import.meta.env.VITE_SUPABASE_URL && 
                 import.meta.env.VITE_SUPABASE_ANON_KEY,
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    supabaseServiceRoleKey: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '',
  },
  
  // Application settings
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Yorke Holidays CRM',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.MODE || 'development',
    apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
    maxRetries: parseInt(import.meta.env.VITE_MAX_RETRIES || '3'),
  },
  
  // Feature flags
  features: {
    enableRealTimeUpdates: import.meta.env.VITE_ENABLE_REAL_TIME_UPDATES !== 'false',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS !== 'false',
    enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== 'false',
    enableFileUploads: import.meta.env.VITE_ENABLE_FILE_UPLOADS === 'true',
  },
  
  // UI Configuration
  ui: {
    itemsPerPage: parseInt(import.meta.env.VITE_ITEMS_PER_PAGE || '10'),
    notificationDuration: parseInt(import.meta.env.VITE_NOTIFICATION_DURATION || '5000'),
    autoSaveInterval: parseInt(import.meta.env.VITE_AUTO_SAVE_INTERVAL || '30000'),
  }
};

// Validation
export const validateConfig = () => {
  // Log current configuration status
  console.log('🔧 Configuration Status:');
  console.log(`   Database Mode: ${config.database.useSupabase ? 'Supabase' : 'Demo Mode'}`);
  console.log(`   Supabase URL: ${config.database.supabaseUrl ? 'Configured' : 'Not configured'}`);
  console.log(`   Supabase Key: ${config.database.supabaseAnonKey ? 'Configured' : 'Not configured'}`);
  console.log(`   Real-time Updates: ${config.features.enableRealTimeUpdates ? 'Enabled' : 'Disabled'}`);
  
  if (config.database.useSupabase && (!config.database.supabaseUrl || !config.database.supabaseAnonKey)) {
    console.warn('⚠️ Supabase is enabled but URL and/or Anon Key are missing. Falling back to demo mode.');
    config.database.useSupabase = false;
  }
  
  return true;
};

// Initialize configuration
const isConfigValid = validateConfig();

if (!isConfigValid) {
  console.log('📦 Running in demo mode with mock data');
}

export { isConfigValid };