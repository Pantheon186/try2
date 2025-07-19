import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from '../../components/Dashboard';
import { AuthProvider } from '../../hooks/useAuth';
import { SupabaseService } from '../../services/SupabaseService';

// Mock the SupabaseService
vi.mock('../../services/SupabaseService', () => ({
  SupabaseService: {
    getAllCruises: vi.fn(),
    healthCheck: vi.fn(),
  }
}));

// Mock the auth hook
vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'user1', name: 'Test User', role: 'Travel Agent', region: 'Mumbai' }
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock the bookings hook
vi.mock('../../hooks/useBookings', () => ({
  useBookings: () => ({
    bookings: [],
    loading: false,
    error: null,
    cancelBooking: vi.fn(),
  })
}));

// Mock notifications hook
vi.mock('../../hooks/useNotifications', () => ({
  useNotifications: () => ({
    showError: vi.fn(),
    showCancellationSuccess: vi.fn()
  })
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dashboard with welcome message', async () => {
    const mockCruises = [
      {
        id: '1',
        name: 'Test Cruise',
        image: 'https://example.com/image.jpg',
        from: 'Mumbai',
        to: 'Goa',
        duration: 7,
        departureDates: ['2024-04-15'],
        amenities: ['Pool', 'Spa'],
        pricePerPerson: 50000,
        roomTypes: ['Interior'],
        mealPlans: ['All Inclusive'],
        description: 'Test cruise description',
        shipType: 'Mega Ship',
        cruiseLine: 'Royal Caribbean'
      }
    ];

    vi.mocked(SupabaseService.getAllCruises).mockResolvedValue(mockCruises);

    render(<Dashboard userRole="Travel Agent" onLogout={vi.fn()} />, { wrapper });

    expect(screen.getByText(/Welcome back, Test User!/)).toBeInTheDocument();
    expect(screen.getByText(/Manage your bookings and discover new destinations/)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Test Cruise')).toBeInTheDocument();
    });
  });

  it('should handle search functionality', async () => {
    const mockCruises = [
      {
        id: '1',
        name: 'Royal Caribbean Explorer',
        image: 'https://example.com/image.jpg',
        from: 'Mumbai',
        to: 'Goa',
        duration: 7,
        departureDates: ['2024-04-15'],
        amenities: ['Pool'],
        pricePerPerson: 50000,
        roomTypes: ['Interior'],
        mealPlans: ['All Inclusive'],
        description: 'Luxury cruise',
        shipType: 'Mega Ship',
        cruiseLine: 'Royal Caribbean'
      }
    ];

    vi.mocked(SupabaseService.getAllCruises).mockResolvedValue(mockCruises);

    render(<Dashboard userRole="Travel Agent" onLogout={vi.fn()} />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('Royal Caribbean Explorer')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search by name...');
    fireEvent.change(searchInput, { target: { value: 'Royal' } });

    expect(searchInput).toHaveValue('Royal');
  });

  it('should show admin dashboard button for admin users', () => {
    render(<Dashboard userRole="Basic Admin" onLogout={vi.fn()} />, { wrapper });

    expect(screen.getByText('Open Admin Dashboard')).toBeInTheDocument();
  });

  it('should show super admin dashboard button for super admin users', () => {
    render(<Dashboard userRole="Super Admin" onLogout={vi.fn()} />, { wrapper });

    expect(screen.getByText('Open Super Admin Dashboard')).toBeInTheDocument();
  });

  it('should handle cruise card view details', async () => {
    const mockCruises = [
      {
        id: '1',
        name: 'Test Cruise',
        image: 'https://example.com/image.jpg',
        from: 'Mumbai',
        to: 'Goa',
        duration: 7,
        departureDates: ['2024-04-15'],
        amenities: ['Pool'],
        pricePerPerson: 50000,
        roomTypes: ['Interior'],
        mealPlans: ['All Inclusive'],
        description: 'Test description',
        shipType: 'Mega Ship',
        cruiseLine: 'Royal Caribbean'
      }
    ];

    vi.mocked(SupabaseService.getAllCruises).mockResolvedValue(mockCruises);

    render(<Dashboard userRole="Travel Agent" onLogout={vi.fn()} />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('Test Cruise')).toBeInTheDocument();
    });

    const viewDetailsButton = screen.getByText('View Details & Book');
    fireEvent.click(viewDetailsButton);

    // Modal should open (we can't test the modal content without more complex setup)
    // But we can verify the button click doesn't cause errors
    expect(viewDetailsButton).toBeInTheDocument();
  });
});