# My Project
# Yorke Holidays - Cruise & Hotel Booking CRM

A comprehensive travel booking and customer relationship management system built with React, TypeScript, and Tailwind CSS. The application supports multiple user roles (Travel Agents, Basic Admins, Super Admins) and provides a complete booking workflow for cruises and hotels.

## 🚀 Features

### Core Functionality
- **Multi-role Authentication System** (Travel Agent, Basic Admin, Super Admin)
- **Cruise & Hotel Booking Management**
- **Real-time Notifications System**
- **Performance Analytics Dashboard**
- **Complaint Management System**
- **Offer & Promotion Management**
- **User Management & Permissions**

### User Roles

#### Travel Agent
- Browse and book cruises/hotels for customers
- Manage personal bookings and customer data
- View commission earnings and performance metrics
- Access to assigned offers and promotions

#### Basic Admin
- Manage team of travel agents in assigned region
- Oversee regional bookings and performance
- Handle customer complaints and resolutions
- Create and distribute regional offers
- Manage inventory for assigned region

#### Super Admin
- Full system access and control
- Manage all users and permissions
- Global analytics and reporting
- System-wide offer management
- Performance incentive management

## 🛠 Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: Ant Design, Lucide React Icons
- **State Management**: React Hooks, Context API
- **Backend Ready**: Supabase (PostgreSQL) integration prepared
- **Build Tool**: Vite
- **Deployment**: Netlify

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
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration (for production)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Development Mode (use mock data)
VITE_USE_MOCK_DATA=true
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
│   └── ...
├── data/               # Mock data & types
│   ├── cruises.ts      # Cruise data
│   ├── hotels.ts       # Hotel data
│   ├── admins.ts       # User data
│   └── bookings.ts     # Booking data
├── services/           # API services
│   ├── mockDataService.ts    # Mock backend (current)
│   ├── supabaseService.ts    # Supabase integration (ready)
│   └── supabaseClient.ts     # Supabase configuration
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication
│   ├── useBookings.ts  # Booking management
│   └── useNotifications.ts # Notification system
└── App.tsx             # Main application
```

### Service Layer Architecture

The application is designed with a clean service layer that allows easy switching between mock data (for prototyping) and real Supabase backend:

- **Mock Data Service** (`mockDataService.ts`): Currently active, simulates all backend operations
- **Supabase Service** (`supabaseService.ts`): Ready for implementation, contains all necessary function signatures
- **Service Interface**: Both services implement the same interface for seamless switching

## 🔄 Backend Integration (Supabase)

The application is fully prepared for Supabase integration:

### Database Schema Ready
- User management tables
- Booking and transaction tables
- Complaint tracking system
- Offer and promotion management
- Analytics and reporting tables

### Migration Path
1. Set up Supabase project
2. Run database migrations (schemas provided)
3. Update environment variables
4. Switch from `mockDataService` to `supabaseService`
5. Test and deploy

### Supabase Features Utilized
- **Authentication**: Row Level Security (RLS)
- **Real-time**: Live booking updates
- **Storage**: File uploads for documents
- **Edge Functions**: Complex business logic
- **Analytics**: Performance reporting

## 🎯 Current Status: Fully Functional Prototype

✅ **Complete Internal Functionality**
- All components interact properly
- State management working across the app
- Data flows correctly between components
- User interactions fully functional

✅ **Simulated Backend Behavior**
- Mock data services simulate real API calls
- Realistic loading states and delays
- Error handling and validation
- Persistent state during session

✅ **Ready for Supabase Integration**
- Service layer abstraction complete
- Database schemas defined
- API function signatures ready
- Environment configuration prepared

✅ **Production-Ready Features**
- Authentication system
- Booking workflow
- Notification system
- Role-based access control
- Responsive design
- Error handling

## 🚀 Deployment

The application is deployed and accessible at: [Live Demo URL]

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
```bash
npm run deploy
```

## 🔮 Next Steps for Supabase Integration

1. **Set up Supabase Project**
   - Create new Supabase project
   - Configure authentication providers
   - Set up database tables

2. **Database Migration**
   - Run SQL migrations for all tables
   - Set up Row Level Security policies
   - Configure user roles and permissions

3. **Service Integration**
   - Replace mock services with Supabase calls
   - Implement real-time subscriptions
   - Add file upload capabilities

4. **Testing & Optimization**
   - Test all user flows with real data
   - Optimize database queries
   - Set up monitoring and analytics

## 📝 License

This project is proprietary software developed for Yorke Holidays.

## 🤝 Contributing

This is a private project. For development questions or feature requests, please contact the development team.
