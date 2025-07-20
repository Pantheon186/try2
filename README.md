# Yorke Holidays CRM - Complete End-to-End Application

A comprehensive Customer Relationship Management system for travel agencies, built with modern web technologies and best practices.

## 🚀 Features

### Core Functionality
- **Multi-role Authentication** - Travel Agents, Basic Admins, Super Admins
- **Cruise & Hotel Booking Management** - Complete booking lifecycle
- **Real-time Updates** - Live notifications and data synchronization
- **Advanced Analytics** - Performance metrics and business insights
- **Customer Complaint Management** - Comprehensive support system
- **Promotional Offers** - Dynamic discount and offer management
- **Review System** - Customer feedback and ratings
- **Document Generation** - Automated invoices, vouchers, and reports

### Technical Features
- **Dark/Light Theme** - Automatic system theme detection
- **Responsive Design** - Mobile-first approach with desktop optimization
- **Performance Optimized** - Lazy loading, caching, and virtual scrolling
- **Security Hardened** - Input validation, rate limiting, and XSS protection
- **Error Handling** - Comprehensive error boundaries and logging
- **Testing Suite** - Unit tests with Vitest and React Testing Library
- **Real-time Sync** - Supabase real-time subscriptions

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Ant Design** for UI components
- **Lucide React** for icons
- **Day.js** for date manipulation
- **Vite** for build tooling

### Backend & Database
- **Supabase** for backend services
- **PostgreSQL** with Row Level Security (RLS)
- **Real-time subscriptions** for live updates
- **Edge Functions** for serverless computing

### Development & Testing
- **TypeScript** for type safety
- **ESLint** for code quality
- **Vitest** for unit testing
- **React Testing Library** for component testing

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm 8+
- Supabase account and project

### 1. Clone and Install
```bash
git clone <repository-url>
cd yorke-holidays-crm
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Configuration
VITE_APP_NAME=Yorke Holidays CRM
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_REAL_TIME_UPDATES=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true

# UI Configuration
VITE_ITEMS_PER_PAGE=10
VITE_NOTIFICATION_DURATION=5000
```

### 3. Database Setup

#### Run Migrations
Execute the SQL migrations in your Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration files in order:
   - `supabase/migrations/create_complete_schema.sql`
   - `supabase/migrations/insert_mock_data.sql`

#### Verify Setup
The migrations will create:
- 10 tables with proper relationships
- 15+ rows of realistic mock data per table
- Row Level Security policies
- Performance indexes
- Automated triggers

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔐 Authentication

### Demo Credentials

**Travel Agent:**
- Email: `agent_demo@example.com`
- Password: `demo123`

**Basic Admin:**
- Email: `admin_demo@example.com`
- Password: `admin123`

**Super Admin:**
- Email: `superadmin_demo@example.com`
- Password: `super123`

## 📊 Database Schema

### Core Tables
- **users** - User management with roles and regions
- **cruises** - Cruise inventory with detailed information
- **hotels** - Hotel inventory with amenities and pricing
- **bookings** - Booking management with status tracking
- **complaints** - Customer complaint management system
- **offers** - Promotional offers and discounts
- **reviews** - Customer reviews and ratings
- **notifications** - In-app notification system
- **audit_logs** - System audit trail
- **analytics** - Performance analytics data

### Key Features
- **Row Level Security (RLS)** - Role-based data access
- **Real-time Subscriptions** - Live data updates
- **Full-text Search** - Optimized search capabilities
- **Automated Triggers** - Data consistency and validation
- **Performance Indexes** - Optimized query performance

## 🎨 UI/UX Features

### Design System
- **Glassmorphism** - Modern glass-like UI elements
- **Responsive Grid** - Mobile-first responsive design
- **Dark/Light Themes** - Automatic theme switching
- **Micro-interactions** - Smooth animations and transitions
- **Accessibility** - WCAG 2.1 compliant design

### User Experience
- **Progressive Loading** - Skeleton screens and lazy loading
- **Real-time Feedback** - Live notifications and updates
- **Error Recovery** - Graceful error handling and recovery
- **Offline Support** - Basic offline functionality
- **Performance Monitoring** - Built-in performance tracking

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm run test

# Test with UI
npm run test:ui

# Coverage report
npm run test:coverage

# Run tests once
npm run test:run
```

### Test Coverage
- Component testing with React Testing Library
- Hook testing with custom test utilities
- Utility function testing
- Error boundary testing
- Performance testing

## 🚀 Deployment

### Build for Production
```bash
npm run build:production
```

### Environment Variables for Production
Ensure all environment variables are properly set:
- Supabase URL and keys
- Feature flags
- Analytics configuration
- Security settings

### Deployment Platforms
The application is ready for deployment on:
- **Netlify** (recommended)
- **Vercel**
- **AWS Amplify**
- **Firebase Hosting**

## 📈 Performance Optimizations

### Frontend Optimizations
- **Code Splitting** - Lazy loading of components
- **Image Optimization** - Automatic image compression
- **Caching Strategy** - Intelligent data caching
- **Virtual Scrolling** - Efficient large list rendering
- **Bundle Analysis** - Optimized bundle sizes

### Backend Optimizations
- **Database Indexes** - Optimized query performance
- **Connection Pooling** - Efficient database connections
- **Edge Functions** - Serverless computing
- **CDN Integration** - Global content delivery

## 🔒 Security Features

### Data Protection
- **Input Validation** - XSS and SQL injection prevention
- **Rate Limiting** - API abuse prevention
- **HTTPS Enforcement** - Secure data transmission
- **Row Level Security** - Database-level access control

### Monitoring
- **Security Events** - Suspicious activity detection
- **Audit Logging** - Complete action tracking
- **Error Monitoring** - Comprehensive error tracking
- **Performance Monitoring** - Real-time performance metrics

## 📚 API Documentation

### Authentication Endpoints
- `POST /auth/login` - User authentication
- `POST /auth/logout` - User logout
- `GET /auth/user` - Get current user

### Booking Endpoints
- `GET /bookings` - List user bookings
- `POST /bookings` - Create new booking
- `PUT /bookings/:id` - Update booking
- `DELETE /bookings/:id` - Cancel booking

### Admin Endpoints
- `GET /admin/users` - List all users
- `GET /admin/analytics` - System analytics
- `POST /admin/offers` - Create offers
- `GET /admin/complaints` - Manage complaints

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run the test suite
6. Submit a pull request

### Code Standards
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Conventional commits for git history

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Getting Help
- Check the documentation
- Review the test cases
- Open an issue on GitHub
- Contact the development team

### Common Issues
- **Supabase Connection**: Verify environment variables
- **Build Errors**: Check Node.js version compatibility
- **Performance Issues**: Enable production optimizations
- **Authentication Problems**: Verify Supabase RLS policies

## 🔄 Changelog

### Version 1.0.0
- Initial release with complete CRM functionality
- Supabase integration with real-time updates
- Multi-role authentication system
- Advanced analytics dashboard
- Comprehensive testing suite
- Production-ready deployment configuration

---

**Built with ❤️ by the Yorke Holidays Development Team**