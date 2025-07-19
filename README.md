# Yorke Holidays - Cruise & Hotel Booking CRM

A comprehensive, production-ready travel booking and customer relationship management system built with React, TypeScript, Tailwind CSS, and Supabase. The application supports multiple user roles and provides a complete booking workflow for cruises and hotels with real-time data synchronization.

## 🚀 Features

### Core Functionality
- **Multi-role Authentication System** (Travel Agent, Basic Admin, Super Admin)
- **Cruise & Hotel Booking Management** with real-time updates
- **Advanced Search & Filtering** with input validation
- **Real-time Notifications System** with comprehensive error handling
- **Live Database Integration** with Supabase
- **Complaint Management System** with priority tracking
- **Offer & Promotion Management** with usage analytics
- **User Management & Permissions** with role-based access
- **Comprehensive Audit Trail** for all booking events
- **Performance Analytics Dashboard** with real-time metrics

### Security Features
- **Row Level Security (RLS)** policies for all database tables
- **Input Validation & Sanitization** to prevent XSS attacks
- **SQL Injection Prevention** with parameterized queries
- **File Upload Validation** with type and size restrictions
- **Rate Limiting** to prevent abuse
- **Comprehensive Error Handling** with proper logging
- **Session Management** with automatic cleanup

### User Roles

#### Travel Agent
- Browse and book cruises/hotels for customers
- Manage personal bookings and customer data
- View commission earnings and performance metrics
- Access to assigned offers and promotions
- Real-time booking status updates

#### Basic Admin
- Manage team of travel agents in assigned region
- Oversee regional bookings and performance
- Handle customer complaints and resolutions
- Create and distribute regional offers
- Manage inventory for assigned region
- Access to regional analytics

#### Super Admin
- Full system access and control
- Manage all users and permissions
- Global analytics and reporting
- System-wide offer management
- Performance incentive management
- Security monitoring and audit logs

## 🛠 Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Ant Design, Lucide React Icons
- **State Management**: React Hooks, Context API
- **Backend**: Supabase (PostgreSQL) with real-time subscriptions
- **Database**: PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth with role-based access
- **Build Tool**: Vite
- **Testing**: Vitest, React Testing Library
- **Deployment**: Netlify Ready

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd yorke-holidays-crm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Set up Supabase**
   - Create a new Supabase project at https://supabase.com
   - Copy your project URL and anon key to the .env file
   - Run the migration files in your Supabase SQL editor:
     - First: `supabase/migrations/create_complete_schema.sql`
     - Then: `supabase/migrations/seed_sample_data.sql`
   - The app will automatically work with or without Supabase

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Database Setup

### Option 1: With Supabase (Recommended)

1. **Create Supabase Project**
   - Go to https://supabase.com and create a new project
   - Wait for the project to be fully initialized

2. **Get Credentials**
   - Go to Settings > API in your Supabase dashboard
   - Copy the Project URL and anon/public key

3. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your Supabase credentials:
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Run Database Migrations**
   - Go to your Supabase dashboard > SQL Editor
   - Create a new query and paste the contents of `supabase/migrations/create_complete_schema.sql`
   - Run the query to create all tables and policies
   - Create another new query and paste the contents of `supabase/migrations/seed_sample_data.sql`
   - Run the query to populate sample data

5. **Verify Setup**
   - Check the Tables section in your Supabase dashboard
   - You should see tables: users, cruises, hotels, bookings, complaints, offers, booking_events
   - Each table should have sample data

### Option 2: Demo Mode (No Setup Required)

If you don't set up Supabase, the application will automatically run in demo mode using localStorage for data persistence. This is perfect for testing and development.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Configuration
VITE_APP_NAME=Yorke Holidays CRM
VITE_APP_VERSION=1.0.0
VITE_ENABLE_REAL_TIME_UPDATES=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_FILE_UPLOADS=false

# API Configuration
VITE_API_TIMEOUT=10000
VITE_MAX_RETRIES=3

# UI Configuration
VITE_ITEMS_PER_PAGE=10
VITE_NOTIFICATION_DURATION=5000
VITE_AUTO_SAVE_INTERVAL=30000
```

### Configuration Notes

- If `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are provided, the app will use Supabase
- If not provided, the app will automatically use demo mode with localStorage
- All environment variables are optional and have sensible defaults

### Demo Credentials

The application includes demo credentials for testing:

| Role | Email | Password |
|------|-------|----------|
| Travel Agent | agent_demo@example.com | demo123 |
| Basic Admin | admin_demo@example.com | admin123 |
| Super Admin | superadmin_demo@example.com | super123 |

## 🔍 Troubleshooting

### Database Issues

1. **"Database migration has not been applied correctly"**
   - Ensure you've run both migration files in the correct order
   - Check the Supabase dashboard for any error messages
   - Verify your Supabase project is fully initialized

2. **"Supabase client not initialized"**
   - Check your `.env` file has the correct Supabase credentials
   - Verify the credentials are valid in your Supabase dashboard
   - The app will fall back to demo mode if Supabase is not available

3. **"No data showing in the application"**
   - Run the seed data migration: `supabase/migrations/seed_sample_data.sql`
   - Check the Tables section in Supabase dashboard for data
   - In demo mode, data is automatically seeded to localStorage

### Development Issues

1. **Application not starting**
   ```bash
   # Clear node modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

2. **TypeScript errors**
   ```bash
   # Run type checking
   npm run type-check
   ```

3. **Build errors**
   ```bash
   # Clean build and rebuild
   npm run clean
   npm run build
   ```

## 🏗 Architecture

### Project Structure
```
src/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── LoginPage.tsx    # Authentication
│   ├── CruiseModal.tsx  # Booking modals
│   └── common/          # Reusable components
├── config/             # Configuration files
│   └── environment.ts  # Environment configuration
├── services/           # Backend services
│   └── SupabaseService.ts    # Supabase integration
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication
│   ├── useBookings.ts  # Booking management
│   └── useNotifications.ts # Notification system
├── utils/              # Utility functions
│   ├── validation.ts   # Input validation
│   ├── formatters.ts   # Data formatting
│   └── errorHandler.ts # Error handling
├── types/              # TypeScript definitions
├── data/               # Mock data for demo mode
├── test/               # Test files
└── test/               # Test files
```

### Database Schema

The application uses Supabase with the following main tables:

- **users**: User accounts and profiles with role-based permissions
- **cruises**: Cruise inventory with comprehensive details
- **hotels**: Hotel inventory with location and amenity data
- **bookings**: Customer bookings with payment tracking
- **complaints**: Customer complaint tracking with priority system
- **offers**: Promotional offers with usage analytics
- **booking_events**: Audit trail for all booking changes

### Real-time Features

- Live booking updates across all connected clients
- Real-time notification system with priority handling
- Instant data synchronization with conflict resolution
- Live complaint status updates
- Real-time analytics dashboard

## 🎯 Production Features

✅ **Complete Supabase Integration**
- Real-time database connectivity with connection pooling
- Automatic table creation via migrations
- Live data synchronization with optimistic updates
- Authentication with Supabase Auth and session management
- Graceful fallback to local storage when Supabase unavailable

✅ **Full CRUD Operations**
- Create, read, update, delete for all entities
- Real-time updates across all components
- Comprehensive data validation and sanitization
- Optimistic UI updates with rollback capability
- Batch operations for improved performance

✅ **Advanced Security**
- Row Level Security (RLS) for all database tables
- Input validation and XSS prevention
- SQL injection protection
- File upload security with type validation
- Rate limiting and abuse prevention
- Comprehensive audit logging

✅ **Robust Error Handling**
- Graceful fallbacks when services unavailable
- Comprehensive error boundaries with recovery
- User-friendly error messages with actionable guidance
- Automatic retry mechanisms with exponential backoff
- Performance monitoring and alerting

✅ **Testing & Quality Assurance**
- Unit tests for critical components
- Integration tests for user workflows
- Input validation testing
- Error handling verification
- Performance benchmarking

## 🚀 Getting Started

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd yorke-holidays-crm
   npm install
   ```

2. **Set up Supabase (Recommended)**
   - Create a new project at https://supabase.com
   - Copy your project URL and anon key
   - Update the .env file with your credentials
   - Run the migration SQL files in your Supabase dashboard

3. **Start the Application**
   ```bash
   npm run dev
   ```

4. **Automatic Setup**
   - The app works immediately with demo data
   - If Supabase is configured, it will use real database
   - Sample data is automatically available via migrations
   - You can immediately start using the demo credentials

## 📊 Data Flow

### With Supabase
1. **Authentication**: Supabase Auth handles login/logout with RLS policies
2. **Data Operations**: All CRUD operations go through SupabaseService with validation
3. **Real-time Updates**: Supabase subscriptions update UI instantly
4. **Security**: Row Level Security ensures data isolation
5. **Audit Trail**: All changes logged to booking_events table

### Demo Mode (localStorage)
1. **Authentication**: Mock credentials with localStorage session
2. **Data Operations**: localStorage with JSON serialization
3. **State Management**: React hooks manage local state
4. **Persistence**: Data persists across browser sessions
5. **Fallback**: Automatic fallback when Supabase unavailable

## 🔐 Security Implementation

### Database Security
- Row Level Security (RLS) enabled on all tables
- Role-based access control with granular permissions
- Secure foreign key relationships
- Input validation at database level
- Audit trails for all data changes

### Application Security
- XSS prevention with input sanitization
- SQL injection protection with parameterized queries
- File upload validation and restrictions
- Rate limiting to prevent abuse
- Secure session management
- CSRF protection

### Data Protection
- Encrypted data transmission (HTTPS)
- Secure password handling
- Personal data anonymization options
- GDPR compliance features
- Data retention policies

## 📊 Analytics & Monitoring

### Real-time Analytics
- Live booking statistics with trend analysis
- Real-time performance metrics
- Agent performance tracking with KPIs
- Revenue analytics with forecasting
- Customer satisfaction monitoring
- System health monitoring

### Business Intelligence
- Booking conversion funnel analysis
- Revenue optimization insights
- Customer behavior analytics
- Seasonal trend analysis
- Regional performance comparison
- Predictive analytics for demand forecasting

## 🚀 Deployment

The application is ready for production deployment:

```bash
# Build for production
npm run build

# Run tests
npm run test

# Type checking
npm run type-check

# Security audit
npm run security:audit
```

Deploy to any static hosting service (Netlify, Vercel, etc.) with your Supabase credentials as environment variables.

### Environment Variables for Production

```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_APP_NAME=Yorke Holidays CRM
VITE_ENABLE_REAL_TIME_UPDATES=true
VITE_ENABLE_ANALYTICS=true
```

## 🧪 Testing

### Available Test Commands

- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ui` - Run tests with UI interface

### Test Coverage

The application includes comprehensive tests for:
- Component rendering and interaction
- User authentication flows
- Booking creation and management
- Input validation and sanitization
- Error handling scenarios
- API integration points

## 📝 Development Guidelines

### Code Quality
- TypeScript strict mode enabled
- ESLint with security rules
- Prettier for code formatting
- Comprehensive error handling
- Input validation on all user inputs
- Performance optimization

### Best Practices
- Component composition over inheritance
- Custom hooks for business logic
- Proper error boundaries
- Accessibility compliance
- Mobile-responsive design
- SEO optimization

## 🔧 Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript checks
- `npm run test` - Run tests
- `npm run clean` - Clean build artifacts

## 🎯 Key Improvements Made

### 1. **Database Optimization**
- Complete schema redesign with proper relationships
- Comprehensive sample data with 12+ records per table
- Performance indexes for frequently queried columns
- Full-text search capabilities

### 2. **Security Enhancements**
- Row Level Security (RLS) policies for all tables
- Input validation and sanitization
- XSS and SQL injection prevention
- File upload security
- Rate limiting implementation

### 3. **Code Quality**
- Removed all unused/redundant code
- Consolidated service layer architecture
- Enhanced error handling with proper boundaries
- Comprehensive input validation
- Performance optimizations

### 4. **Testing Infrastructure**
- Unit tests for critical components
- Integration tests for user workflows
- Mocking strategies for external dependencies
- Coverage reporting
- Continuous integration ready

### 5. **Production Readiness**
- Environment configuration management
- Build optimization
- Error monitoring integration points
- Performance monitoring
- Deployment automation ready

### 6. **Database Migration Fixes**
- Fixed migration file structure and naming
- Added comprehensive schema with all required tables
- Implemented proper RLS policies for security
- Added sample data seeding for immediate functionality
- Created fallback mechanisms for demo mode

### 7. **Service Layer Improvements**
- Enhanced SupabaseService with better error handling
- Automatic fallback to localStorage when Supabase unavailable
- Improved configuration management
- Better health checking and status reporting

## 📄 License

This project is proprietary software developed for Yorke Holidays.

## 🤝 Contributing

This is a private project. For development questions or feature requests, please contact the development team.

---

**The application is now fully functional, production-ready, and can work both with and without Supabase backend. All database migration issues have been resolved, security vulnerabilities have been addressed, performance has been optimized, and the codebase is clean and maintainable.**