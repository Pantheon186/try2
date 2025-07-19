import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EnhancedCruiseCard from '../../components/enhanced/EnhancedCruiseCard';
import { EnhancedCruise } from '../../types/enhanced';

const mockCruise: EnhancedCruise = {
  id: '1',
  name: 'Test Cruise',
  image: 'https://example.com/image.jpg',
  from: 'Mumbai',
  to: 'Goa',
  duration: 7,
  departureDates: ['2024-04-15'],
  amenities: ['Pool', 'Spa', 'Casino'],
  pricePerPerson: 50000,
  roomTypes: ['Interior', 'Balcony'],
  mealPlans: ['All Inclusive'],
  description: 'A wonderful cruise experience',
  shipType: 'Mega Ship',
  cruiseLine: 'Royal Caribbean',
  availability: [{
    date: '2024-04-15',
    available: true,
    price: 50000,
    roomsLeft: 5,
    specialOffers: ['Early Bird']
  }],
  pricing: [{
    roomType: 'Interior',
    basePrice: 50000,
    seasonalMultiplier: 1.0,
    occupancyRates: [{ occupancy: 2, multiplier: 1.0 }],
    inclusions: ['Meals'],
    exclusions: ['Drinks']
  }],
  reviews: [{
    id: '1',
    rating: 4.5,
    title: 'Great cruise',
    comment: 'Had a wonderful time',
    aspects: [],
    helpful: 5,
    createdAt: '2024-01-01',
    verified: true
  }],
  gallery: [],
  itinerary: [],
  policies: [],
  sustainability: {
    certifications: ['Green Marine'],
    initiatives: ['Waste Reduction'],
    carbonFootprint: 100,
    wasteReduction: ['Recycling']
  }
};

describe('EnhancedCruiseCard', () => {
  const mockProps = {
    cruise: mockCruise,
    onViewDetails: vi.fn(),
    onBookmark: vi.fn(),
    onCompare: vi.fn(),
    onShare: vi.fn(),
  };

  it('renders cruise information correctly', () => {
    render(<EnhancedCruiseCard {...mockProps} />);
    
    expect(screen.getByText('Test Cruise')).toBeInTheDocument();
    expect(screen.getByText('Mumbai → Goa')).toBeInTheDocument();
    expect(screen.getByText('7 nights')).toBeInTheDocument();
    expect(screen.getByText('Royal Caribbean')).toBeInTheDocument();
  });

  it('displays price correctly', () => {
    render(<EnhancedCruiseCard {...mockProps} />);
    
    expect(screen.getByText(/₹50,000/)).toBeInTheDocument();
    expect(screen.getByText('per person')).toBeInTheDocument();
  });

  it('shows availability information', () => {
    render(<EnhancedCruiseCard {...mockProps} />);
    
    expect(screen.getByText('Only 5 rooms left!')).toBeInTheDocument();
  });

  it('displays amenities', () => {
    render(<EnhancedCruiseCard {...mockProps} />);
    
    expect(screen.getByText('Pool')).toBeInTheDocument();
    expect(screen.getByText('Spa')).toBeInTheDocument();
    expect(screen.getByText('Casino')).toBeInTheDocument();
  });

  it('calls onViewDetails when view details button is clicked', () => {
    render(<EnhancedCruiseCard {...mockProps} />);
    
    const viewDetailsButton = screen.getByText('View Details & Book');
    fireEvent.click(viewDetailsButton);
    
    expect(mockProps.onViewDetails).toHaveBeenCalledWith(mockCruise);
  });

  it('calls onBookmark when bookmark button is clicked', () => {
    render(<EnhancedCruiseCard {...mockProps} />);
    
    const bookmarkButton = screen.getByRole('button', { name: /add to favorites/i });
    fireEvent.click(bookmarkButton);
    
    expect(mockProps.onBookmark).toHaveBeenCalledWith('1');
  });

  it('shows sustainability badge when certifications exist', () => {
    render(<EnhancedCruiseCard {...mockProps} />);
    
    expect(screen.getByText('Eco-Friendly')).toBeInTheDocument();
  });

  it('displays review rating', () => {
    render(<EnhancedCruiseCard {...mockProps} />);
    
    expect(screen.getByText('4.5 (1 reviews)')).toBeInTheDocument();
  });
});