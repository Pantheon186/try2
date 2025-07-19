// Enhanced validation with comprehensive business rules
import { Validator, ValidationError } from './validation';
import { EnhancedBooking, CustomerDetails, TravelDetails, PaymentDetails } from '../types/enhanced';

export class EnhancedValidator extends Validator {
  static validateEnhancedBooking(booking: Partial<EnhancedBooking>): void {
    // Basic booking validation
    this.validateBooking(booking);

    // Enhanced customer details validation
    if (booking.customerDetails) {
      this.validateCustomerDetails(booking.customerDetails);
    }

    // Travel details validation
    if (booking.travelDetails) {
      this.validateTravelDetails(booking.travelDetails);
    }

    // Payment details validation
    if (booking.paymentDetails) {
      this.validatePaymentDetails(booking.paymentDetails);
    }

    // Business rule validations
    this.validateBusinessRules(booking);
  }

  static validateCustomerDetails(customer: Partial<CustomerDetails>): void {
    if (customer.name) {
      this.required(customer.name, 'customer name');
      this.minLength(customer.name, 2, 'customer name');
      this.maxLength(customer.name, 100, 'customer name');
      
      // Name should contain only letters, spaces, and common punctuation
      if (!/^[a-zA-Z\s\-\.\']+$/.test(customer.name)) {
        throw new ValidationError('customerName', 'Name contains invalid characters');
      }
    }

    if (customer.email) {
      this.required(customer.email, 'email');
      if (!this.email(customer.email)) {
        throw new ValidationError('email', 'Invalid email format');
      }
    }

    if (customer.phone) {
      this.required(customer.phone, 'phone');
      if (!this.phone(customer.phone)) {
        throw new ValidationError('phone', 'Invalid phone number format');
      }
    }

    if (customer.dateOfBirth) {
      const birthDate = new Date(customer.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 0 || age > 120) {
        throw new ValidationError('dateOfBirth', 'Invalid date of birth');
      }
      
      if (age < 18) {
        throw new ValidationError('dateOfBirth', 'Customer must be at least 18 years old');
      }
    }

    if (customer.passportNumber) {
      // Basic passport number validation (alphanumeric, 6-12 characters)
      if (!/^[A-Z0-9]{6,12}$/i.test(customer.passportNumber)) {
        throw new ValidationError('passportNumber', 'Invalid passport number format');
      }
    }

    if (customer.nationality) {
      this.required(customer.nationality, 'nationality');
      this.minLength(customer.nationality, 2, 'nationality');
    }

    // Address validation
    if (customer.address) {
      this.validateAddress(customer.address);
    }

    // Emergency contact validation
    if (customer.emergencyContact) {
      this.validateEmergencyContact(customer.emergencyContact);
    }
  }

  static validateAddress(address: any): void {
    this.required(address.street, 'street address');
    this.required(address.city, 'city');
    this.required(address.country, 'country');
    
    this.minLength(address.street, 5, 'street address');
    this.minLength(address.city, 2, 'city');
    this.minLength(address.country, 2, 'country');

    if (address.postalCode) {
      // Basic postal code validation (alphanumeric, 3-10 characters)
      if (!/^[A-Z0-9\s\-]{3,10}$/i.test(address.postalCode)) {
        throw new ValidationError('postalCode', 'Invalid postal code format');
      }
    }
  }

  static validateEmergencyContact(contact: any): void {
    this.required(contact.name, 'emergency contact name');
    this.required(contact.relationship, 'emergency contact relationship');
    this.required(contact.phone, 'emergency contact phone');

    this.minLength(contact.name, 2, 'emergency contact name');
    
    if (!this.phone(contact.phone)) {
      throw new ValidationError('emergencyContactPhone', 'Invalid emergency contact phone format');
    }

    if (contact.email && !this.email(contact.email)) {
      throw new ValidationError('emergencyContactEmail', 'Invalid emergency contact email format');
    }
  }

  static validateTravelDetails(travel: Partial<TravelDetails>): void {
    this.required(travel.departureDate, 'departure date');
    this.futureDate(travel.departureDate, 'departure date');

    if (travel.returnDate) {
      this.dateRange(travel.departureDate, travel.returnDate);
    }

    if (travel.duration !== undefined) {
      this.positiveNumber(travel.duration, 'duration');
      this.range(travel.duration, 1, 365, 'duration'); // Max 1 year
    }

    // Validate travelers
    if (travel.travelers) {
      if (travel.travelers.length === 0) {
        throw new ValidationError('travelers', 'At least one traveler is required');
      }

      if (travel.travelers.length > 20) {
        throw new ValidationError('travelers', 'Maximum 20 travelers allowed');
      }

      const mainTravelers = travel.travelers.filter(t => t.isMainTraveler);
      if (mainTravelers.length !== 1) {
        throw new ValidationError('travelers', 'Exactly one main traveler is required');
      }

      travel.travelers.forEach((traveler, index) => {
        this.validateTraveler(traveler, index);
      });
    }

    // Validate room assignments
    if (travel.rooms) {
      travel.rooms.forEach((room, index) => {
        this.validateRoomAssignment(room, index, travel.travelers || []);
      });
    }

    // Validate insurance
    if (travel.insurance) {
      this.validateTravelInsurance(travel.insurance);
    }
  }

  static validateTraveler(traveler: any, index: number): void {
    const prefix = `traveler ${index + 1}`;
    
    this.required(traveler.name, `${prefix} name`);
    this.required(traveler.age, `${prefix} age`);
    this.required(traveler.gender, `${prefix} gender`);
    this.required(traveler.documentType, `${prefix} document type`);
    this.required(traveler.documentNumber, `${prefix} document number`);
    this.required(traveler.documentExpiry, `${prefix} document expiry`);

    this.minLength(traveler.name, 2, `${prefix} name`);
    this.range(traveler.age, 0, 120, `${prefix} age`);

    const validGenders = ['male', 'female', 'other'];
    if (!validGenders.includes(traveler.gender)) {
      throw new ValidationError(`${prefix}Gender`, 'Invalid gender');
    }

    const validDocumentTypes = ['passport', 'id_card', 'driving_license'];
    if (!validDocumentTypes.includes(traveler.documentType)) {
      throw new ValidationError(`${prefix}DocumentType`, 'Invalid document type');
    }

    this.futureDate(traveler.documentExpiry, `${prefix} document expiry`);

    // Document number validation based on type
    if (traveler.documentType === 'passport') {
      if (!/^[A-Z0-9]{6,12}$/i.test(traveler.documentNumber)) {
        throw new ValidationError(`${prefix}DocumentNumber`, 'Invalid passport number format');
      }
    }
  }

  static validateRoomAssignment(room: any, index: number, travelers: any[]): void {
    const prefix = `room ${index + 1}`;
    
    this.required(room.roomType, `${prefix} type`);
    this.required(room.travelers, `${prefix} travelers`);

    if (!Array.isArray(room.travelers) || room.travelers.length === 0) {
      throw new ValidationError(`${prefix}Travelers`, 'Room must have at least one traveler');
    }

    if (room.travelers.length > 4) {
      throw new ValidationError(`${prefix}Travelers`, 'Maximum 4 travelers per room');
    }

    // Validate traveler IDs exist
    const travelerIds = travelers.map(t => t.id);
    room.travelers.forEach((travelerId: string) => {
      if (!travelerIds.includes(travelerId)) {
        throw new ValidationError(`${prefix}Travelers`, `Invalid traveler ID: ${travelerId}`);
      }
    });
  }

  static validateTravelInsurance(insurance: any): void {
    this.required(insurance.provider, 'insurance provider');
    this.required(insurance.policyNumber, 'insurance policy number');
    this.required(insurance.coverage, 'insurance coverage');
    this.required(insurance.premium, 'insurance premium');

    this.minLength(insurance.provider, 2, 'insurance provider');
    this.minLength(insurance.policyNumber, 5, 'insurance policy number');
    this.positiveNumber(insurance.premium, 'insurance premium');

    if (!Array.isArray(insurance.coverage) || insurance.coverage.length === 0) {
      throw new ValidationError('insuranceCoverage', 'Insurance coverage must be specified');
    }
  }

  static validatePaymentDetails(payment: Partial<PaymentDetails>): void {
    if (payment.method) {
      const validMethods = ['credit_card', 'debit_card', 'bank_transfer', 'wallet', 'cash'];
      if (!validMethods.includes(payment.method)) {
        throw new ValidationError('paymentMethod', 'Invalid payment method');
      }
    }

    if (payment.amount !== undefined) {
      this.positiveNumber(payment.amount, 'payment amount');
      this.range(payment.amount, 1, 10000000, 'payment amount'); // Max 1 crore
    }

    if (payment.currency) {
      const validCurrencies = ['INR', 'USD', 'EUR', 'GBP'];
      if (!validCurrencies.includes(payment.currency)) {
        throw new ValidationError('currency', 'Invalid currency');
      }
    }

    if (payment.status) {
      const validStatuses = ['pending', 'processing', 'completed', 'failed', 'refunded', 'partial_refund'];
      if (!validStatuses.includes(payment.status)) {
        throw new ValidationError('paymentStatus', 'Invalid payment status');
      }
    }

    // Validate installments if present
    if (payment.installments) {
      payment.installments.forEach((installment, index) => {
        this.validatePaymentInstallment(installment, index);
      });
    }
  }

  static validatePaymentInstallment(installment: any, index: number): void {
    const prefix = `installment ${index + 1}`;
    
    this.required(installment.amount, `${prefix} amount`);
    this.required(installment.dueDate, `${prefix} due date`);
    this.required(installment.status, `${prefix} status`);

    this.positiveNumber(installment.amount, `${prefix} amount`);
    this.futureDate(installment.dueDate, `${prefix} due date`);

    const validStatuses = ['pending', 'paid', 'overdue'];
    if (!validStatuses.includes(installment.status)) {
      throw new ValidationError(`${prefix}Status`, 'Invalid installment status');
    }
  }

  static validateBusinessRules(booking: Partial<EnhancedBooking>): void {
    // Minimum advance booking period
    if (booking.travelDetails?.departureDate) {
      const departureDate = new Date(booking.travelDetails.departureDate);
      const today = new Date();
      const daysInAdvance = Math.ceil((departureDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysInAdvance < 1) {
        throw new ValidationError('departureDate', 'Booking must be made at least 1 day in advance');
      }

      if (daysInAdvance > 365) {
        throw new ValidationError('departureDate', 'Booking cannot be made more than 1 year in advance');
      }
    }

    // Maximum booking value validation
    if (booking.totalAmount && booking.totalAmount > 5000000) { // 50 lakh
      throw new ValidationError('totalAmount', 'Booking amount exceeds maximum limit');
    }

    // Commission validation
    if (booking.totalAmount && booking.commissionAmount) {
      const commissionPercentage = (booking.commissionAmount / booking.totalAmount) * 100;
      if (commissionPercentage > 20) {
        throw new ValidationError('commissionAmount', 'Commission percentage cannot exceed 20%');
      }
    }

    // Guest count validation based on booking type
    if (booking.type === 'Cruise' && booking.guests && booking.guests > 8) {
      throw new ValidationError('guests', 'Maximum 8 guests allowed for cruise bookings');
    }

    if (booking.type === 'Hotel' && booking.guests && booking.guests > 6) {
      throw new ValidationError('guests', 'Maximum 6 guests allowed for hotel bookings');
    }

    // Travel duration validation
    if (booking.travelDetails?.duration) {
      if (booking.type === 'Cruise' && booking.travelDetails.duration > 30) {
        throw new ValidationError('duration', 'Cruise duration cannot exceed 30 nights');
      }

      if (booking.type === 'Hotel' && booking.travelDetails.duration > 90) {
        throw new ValidationError('duration', 'Hotel stay cannot exceed 90 nights');
      }
    }

    // Age restrictions for certain bookings
    if (booking.travelDetails?.travelers) {
      const hasMinors = booking.travelDetails.travelers.some(t => t.age < 18);
      const hasAdults = booking.travelDetails.travelers.some(t => t.age >= 18);
      
      if (hasMinors && !hasAdults) {
        throw new ValidationError('travelers', 'At least one adult (18+) is required when traveling with minors');
      }
    }

    // Document expiry validation
    if (booking.travelDetails?.travelers && booking.travelDetails.departureDate) {
      const departureDate = new Date(booking.travelDetails.departureDate);
      
      booking.travelDetails.travelers.forEach((traveler, index) => {
        const expiryDate = new Date(traveler.documentExpiry);
        const monthsUntilExpiry = (expiryDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
        
        if (monthsUntilExpiry < 6) {
          throw new ValidationError(
            `traveler${index}DocumentExpiry`,
            `Traveler ${index + 1}'s document expires within 6 months of travel date`
          );
        }
      });
    }
  }

  static validateReview(review: any): void {
    this.required(review.rating, 'rating');
    this.required(review.title, 'review title');
    this.required(review.comment, 'review comment');

    this.range(review.rating, 1, 5, 'rating');
    this.minLength(review.title, 5, 'review title');
    this.maxLength(review.title, 100, 'review title');
    this.minLength(review.comment, 10, 'review comment');
    this.maxLength(review.comment, 2000, 'review comment');

    // Validate aspects if present
    if (review.aspects) {
      if (!Array.isArray(review.aspects)) {
        throw new ValidationError('aspects', 'Review aspects must be an array');
      }

      review.aspects.forEach((aspect: any, index: number) => {
        this.required(aspect.name, `aspect ${index + 1} name`);
        this.required(aspect.rating, `aspect ${index + 1} rating`);
        this.range(aspect.rating, 1, 5, `aspect ${index + 1} rating`);
      });
    }

    // Content validation (basic profanity and spam detection)
    const inappropriateWords = ['spam', 'fake', 'scam']; // In real app, use comprehensive list
    const content = `${review.title} ${review.comment}`.toLowerCase();
    
    for (const word of inappropriateWords) {
      if (content.includes(word)) {
        throw new ValidationError('content', 'Review contains inappropriate content');
      }
    }
  }

  static validateSearchFilters(filters: any): void {
    if (filters.priceRange) {
      if (filters.priceRange.min < 0) {
        throw new ValidationError('priceRange', 'Minimum price cannot be negative');
      }
      
      if (filters.priceRange.max < filters.priceRange.min) {
        throw new ValidationError('priceRange', 'Maximum price must be greater than minimum price');
      }
      
      if (filters.priceRange.max > 10000000) {
        throw new ValidationError('priceRange', 'Maximum price limit exceeded');
      }
    }

    if (filters.dateRange) {
      this.dateRange(filters.dateRange.start, filters.dateRange.end);
      this.futureDate(filters.dateRange.start, 'start date');
    }

    if (filters.rating !== undefined) {
      this.range(filters.rating, 0, 5, 'rating');
    }

    if (filters.amenities && !Array.isArray(filters.amenities)) {
      throw new ValidationError('amenities', 'Amenities must be an array');
    }
  }
}