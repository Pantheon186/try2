import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Calendar, Users, DollarSign, Info } from 'lucide-react';
import { DatePicker, Select, InputNumber, Tooltip } from 'antd';
import { PricingTier, OccupancyRate } from '../../types/enhanced';
import { Formatters } from '../../utils/formatters';
import dayjs, { Dayjs } from 'dayjs';

interface DynamicPricingProps {
  basePrice: number;
  roomTypes: string[];
  onPriceCalculated: (price: number, breakdown: PriceBreakdown) => void;
  className?: string;
}

interface PriceBreakdown {
  basePrice: number;
  seasonalAdjustment: number;
  occupancyAdjustment: number;
  roomTypeAdjustment: number;
  totalPrice: number;
  savings?: number;
  pricePerPerson: number;
}

const DynamicPricing: React.FC<DynamicPricingProps> = ({
  basePrice,
  roomTypes,
  onPriceCalculated,
  className = ''
}) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs().add(30, 'day'));
  const [selectedRoomType, setSelectedRoomType] = useState(roomTypes[0]);
  const [occupancy, setOccupancy] = useState(2);
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null);

  // Room type multipliers
  const roomTypeMultipliers: Record<string, number> = {
    'Interior': 1.0,
    'Ocean View': 1.25,
    'Balcony': 1.5,
    'Suite': 2.0,
    'Penthouse': 2.5,
    'Standard Room': 1.0,
    'Deluxe Room': 1.3,
    'Premium Room': 1.4,
    'Executive Room': 1.5,
    'Club Room': 1.6,
    'Executive Suite': 1.8,
    'Luxury Suite': 2.0,
    'Royal Suite': 2.2,
    'Presidential Suite': 2.5
  };

  // Occupancy rates
  const occupancyRates: OccupancyRate[] = [
    { occupancy: 1, multiplier: 1.5 },
    { occupancy: 2, multiplier: 1.0 },
    { occupancy: 3, multiplier: 0.85 },
    { occupancy: 4, multiplier: 0.75 }
  ];

  const calculateSeasonalMultiplier = (date: Dayjs): number => {
    const month = date.month() + 1; // 1-12
    const dayOfYear = date.dayOfYear();
    
    // Peak season (December, January, April, May)
    if ([12, 1, 4, 5].includes(month)) {
      return 1.3;
    }
    
    // High season (February, March, October, November)
    if ([2, 3, 10, 11].includes(month)) {
      return 1.15;
    }
    
    // Holiday periods
    const holidays = [
      { start: dayjs().month(11).date(20), end: dayjs().month(0).date(5) }, // Christmas/New Year
      { start: dayjs().month(2).date(15), end: dayjs().month(3).date(15) }, // Spring break
      { start: dayjs().month(9).date(15), end: dayjs().month(10).date(15) } // Diwali period
    ];
    
    for (const holiday of holidays) {
      if (date.isAfter(holiday.start) && date.isBefore(holiday.end)) {
        return 1.4;
      }
    }
    
    // Weekend premium
    if ([0, 6].includes(date.day())) {
      return 1.1;
    }
    
    // Low season
    return 0.85;
  };

  const calculatePrice = () => {
    if (!selectedDate) return;

    const seasonalMultiplier = calculateSeasonalMultiplier(selectedDate);
    const roomTypeMultiplier = roomTypeMultipliers[selectedRoomType] || 1.0;
    const occupancyRate = occupancyRates.find(rate => rate.occupancy === occupancy) || occupancyRates[1];

    const seasonalAdjustment = basePrice * (seasonalMultiplier - 1);
    const roomTypeAdjustment = basePrice * (roomTypeMultiplier - 1);
    const occupancyAdjustment = basePrice * (occupancyRate.multiplier - 1);

    const totalPrice = Math.round(
      basePrice * seasonalMultiplier * roomTypeMultiplier * occupancyRate.multiplier
    );

    const originalPrice = basePrice * roomTypeMultiplier;
    const savings = originalPrice > totalPrice ? originalPrice - totalPrice : 0;

    const breakdown: PriceBreakdown = {
      basePrice,
      seasonalAdjustment,
      occupancyAdjustment,
      roomTypeAdjustment,
      totalPrice,
      savings,
      pricePerPerson: Math.round(totalPrice / occupancy)
    };

    setPriceBreakdown(breakdown);
    onPriceCalculated(totalPrice, breakdown);
  };

  useEffect(() => {
    calculatePrice();
  }, [selectedDate, selectedRoomType, occupancy, basePrice]);

  const getPriceChangeIndicator = () => {
    if (!priceBreakdown) return null;

    const change = priceBreakdown.totalPrice - basePrice;
    const isIncrease = change > 0;
    const percentage = Math.abs((change / basePrice) * 100);

    if (Math.abs(change) < basePrice * 0.05) return null; // Less than 5% change

    return (
      <div className={`flex items-center gap-1 text-sm ${
        isIncrease ? 'text-red-600' : 'text-green-600'
      }`}>
        {isIncrease ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <span>{percentage.toFixed(0)}% {isIncrease ? 'higher' : 'lower'}</span>
      </div>
    );
  };

  return (
    <div className={`bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="text-green-600" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">Dynamic Pricing</h3>
        <Tooltip title="Prices adjust based on travel dates, room type, and occupancy">
          <Info size={16} className="text-gray-400" />
        </Tooltip>
      </div>

      {/* Selection Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Travel Date
          </label>
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            className="w-full"
            format="DD/MM/YYYY"
            disabledDate={(current) => current && current < dayjs().endOf('day')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room Type
          </label>
          <Select
            value={selectedRoomType}
            onChange={setSelectedRoomType}
            className="w-full"
          >
            {roomTypes.map(type => (
              <Select.Option key={type} value={type}>
                {type}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Occupancy
          </label>
          <InputNumber
            min={1}
            max={4}
            value={occupancy}
            onChange={(value) => setOccupancy(value || 2)}
            className="w-full"
            addonBefore={<Users size={14} />}
          />
        </div>
      </div>

      {/* Price Display */}
      {priceBreakdown && (
        <div className="space-y-4">
          {/* Main Price */}
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {Formatters.currency(priceBreakdown.totalPrice)}
            </div>
            <div className="text-sm text-gray-600">
              {Formatters.currency(priceBreakdown.pricePerPerson)} per person
            </div>
            {getPriceChangeIndicator()}
            {priceBreakdown.savings > 0 && (
              <div className="text-sm text-green-600 mt-1">
                You save {Formatters.currency(priceBreakdown.savings)}!
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">Price Breakdown</h4>
            
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Price:</span>
                <span>{Formatters.currency(priceBreakdown.basePrice)}</span>
              </div>
              
              {priceBreakdown.roomTypeAdjustment !== 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Room Type ({selectedRoomType}):</span>
                  <span className={priceBreakdown.roomTypeAdjustment > 0 ? 'text-red-600' : 'text-green-600'}>
                    {priceBreakdown.roomTypeAdjustment > 0 ? '+' : ''}
                    {Formatters.currency(priceBreakdown.roomTypeAdjustment)}
                  </span>
                </div>
              )}
              
              {priceBreakdown.seasonalAdjustment !== 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Seasonal Adjustment:</span>
                  <span className={priceBreakdown.seasonalAdjustment > 0 ? 'text-red-600' : 'text-green-600'}>
                    {priceBreakdown.seasonalAdjustment > 0 ? '+' : ''}
                    {Formatters.currency(priceBreakdown.seasonalAdjustment)}
                  </span>
                </div>
              )}
              
              {priceBreakdown.occupancyAdjustment !== 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Occupancy ({occupancy} guests):</span>
                  <span className={priceBreakdown.occupancyAdjustment > 0 ? 'text-red-600' : 'text-green-600'}>
                    {priceBreakdown.occupancyAdjustment > 0 ? '+' : ''}
                    {Formatters.currency(priceBreakdown.occupancyAdjustment)}
                  </span>
                </div>
              )}
              
              <hr className="my-2" />
              
              <div className="flex justify-between font-medium">
                <span>Total Price:</span>
                <span>{Formatters.currency(priceBreakdown.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Pricing Tips */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h5 className="font-medium text-blue-800 mb-2">💡 Pricing Tips</h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Book 60+ days in advance for early bird discounts</li>
              <li>• Consider shoulder season (June-September) for better rates</li>
              <li>• Interior rooms offer great value for money</li>
              <li>• Group bookings (3+ rooms) may qualify for additional discounts</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicPricing;