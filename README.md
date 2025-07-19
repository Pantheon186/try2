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
     - `supabase/migrations/create_complete_schema.sql`
     - `supabase/migrations/seed_sample_data.sql`
   - The app will automatically work with or without Supabase

5. **Start development server**
   ```bash
   npm run dev
   ```

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
VITE_USE_SUPABASE=true
VITE_ENABLE_REAL_TIME_UPDATES=true
```

### Demo Credentials

The application includes demo credentials for testing:

| Role | Email | Password |
|------|-------|----------|
| Travel Agent | agent_demo@example.com | demo123 |
| Basic Admin | admin_demo@example.com | admin123 |
| Super Admin | superadmin_demo@example.com | super123 |

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
- **reviews**: Customer feedback and ratings

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

## 🔄 Data Flow

1. **User Authentication**: Supabase Auth handles login/logout with session management
2. **Data Operations**: All CRUD operations go through SupabaseService with validation
3. **Real-time Updates**: Supabase subscriptions update UI instantly with conflict resolution
4. **State Management**: React hooks manage local state with Supabase sync
5. **Notifications**: Real-time notification system for user feedback
6. **Fallback Mode**: Automatic fallback to local storage when offline
7. **Error Handling**: Comprehensive error boundaries with recovery mechanisms

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
VITE_USE_SUPABASE=true
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
- Materialized views for analytics

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

## 📄 License

This project is proprietary software developed for Yorke Holidays.

## 🤝 Contributing

This is a private project. For development questions or feature requests, please contact the development team.

---

**The application is now fully functional, production-ready, and can work both with and without Supabase backend. All security vulnerabilities have been addressed, performance has been optimized, and the codebase is clean and maintainable.**