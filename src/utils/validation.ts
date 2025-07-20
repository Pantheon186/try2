import { User, Booking, Complaint, Offer } from '../types';

export class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class Validator {
  private static emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
  private static strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  static email(email: string): boolean {
    return this.emailRegex.test(email);
  }

  static phone(phone: string): boolean {
    const cleanPhone = phone.replace(/\s/g, '');
    return this.phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
  }

  static strongPassword(password: string): boolean {
    return this.strongPasswordRegex.test(password);
  }

  static required(value: any, fieldName: string): void {
    if (value === null || value === undefined || value === '' || 
        (Array.isArray(value) && value.length === 0)) {
      throw new ValidationError(fieldName, `${fieldName} is required`);
    }
  }

  static minLength(value: string, minLength: number, fieldName: string): void {
    if (value.length < minLength) {
      throw new ValidationError(fieldName, `${fieldName} must be at least ${minLength} characters`);
    }
  }

  static maxLength(value: string, maxLength: number, fieldName: string): void {
    if (value.length > maxLength) {
      throw new ValidationError(fieldName, `${fieldName} must not exceed ${maxLength} characters`);
    }
  }

  static positiveNumber(value: number, fieldName: string): void {
    if (typeof value !== 'number' || value <= 0) {
      throw new ValidationError(fieldName, `${fieldName} must be a positive number`);
    }
  }

  static range(value: number, min: number, max: number, fieldName: string): void {
    if (typeof value !== 'number' || value < min || value > max) {
      throw new ValidationError(fieldName, `${fieldName} must be between ${min} and ${max}`);
    }
  }

  static dateRange(startDate: string, endDate: string): void {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new ValidationError('dateRange', 'Invalid date format');
    }
    
    if (start >= end) {
      throw new ValidationError('dateRange', 'End date must be after start date');
    }
  }

  static futureDate(dateString: string, fieldName: string): void {
    const date = new Date(dateString);
    const now = new Date();
    
    if (isNaN(date.getTime())) {
      throw new ValidationError(fieldName, 'Invalid date format');
    }
    
    if (date <= now) {
      throw new ValidationError(fieldName, `${fieldName} must be in the future`);
    }
  }

  static sanitizeString(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  static validateUser(user: Partial<User>): void {
    if (user.email) {
      this.required(user.email, 'email');
      if (!this.email(user.email)) {
        throw new ValidationError('email', 'Invalid email format');
      }
    }

    if (user.name) {
      this.required(user.name, 'name');
      this.minLength(user.name, 2, 'name');
      this.maxLength(user.name, 100, 'name');
      user.name = this.sanitizeString(user.name);
    }

    if (user.role) {
      const validRoles = ['Travel Agent', 'Basic Admin', 'Super Admin'];
      if (!validRoles.includes(user.role)) {
        throw new ValidationError('role', 'Invalid user role');
      }
    }

    if (user.status) {
      const validStatuses = ['Active', 'Inactive', 'Pending'];
      if (!validStatuses.includes(user.status)) {
        throw new ValidationError('status', 'Invalid user status');
      }
    }

    if (user.phone && !this.phone(user.phone)) {
      throw new ValidationError('phone', 'Invalid phone number format');
    }
  }

  static validateBooking(booking: Partial<Booking>): void {
    if (booking.customerName) {
      this.required(booking.customerName, 'customerName');
      this.minLength(booking.customerName, 2, 'customerName');
      this.maxLength(booking.customerName, 100, 'customerName');
      booking.customerName = this.sanitizeString(booking.customerName);
    }

    if (booking.customerEmail) {
      this.required(booking.customerEmail, 'customerEmail');
      if (!this.email(booking.customerEmail)) {
        throw new ValidationError('customerEmail', 'Invalid customer email format');
      }
    }

    if (booking.customerPhone) {
      this.required(booking.customerPhone, 'customerPhone');
      if (!this.phone(booking.customerPhone)) {
        throw new ValidationError('customerPhone', 'Invalid phone number format');
      }
    }

    if (booking.totalAmount !== undefined) {
      this.positiveNumber(booking.totalAmount, 'totalAmount');
      this.range(booking.totalAmount, 1, 10000000, 'totalAmount'); // Max 1 crore
    }

    if (booking.commissionAmount !== undefined) {
      if (booking.commissionAmount < 0) {
        throw new ValidationError('commissionAmount', 'Commission amount cannot be negative');
      }
    }

    if (booking.guests !== undefined) {
      this.positiveNumber(booking.guests, 'guests');
      this.range(booking.guests, 1, 20, 'guests'); // Max 20 guests
    }

    if (booking.bookingDate && booking.travelDate) {
      this.dateRange(booking.bookingDate, booking.travelDate);
    }

    if (booking.type) {
      const validTypes = ['Cruise', 'Hotel'];
      if (!validTypes.includes(booking.type)) {
        throw new ValidationError('type', 'Invalid booking type');
      }
    }

    if (booking.status) {
      const validStatuses = ['Confirmed', 'Pending', 'Cancelled', 'Completed'];
      if (!validStatuses.includes(booking.status)) {
        throw new ValidationError('status', 'Invalid booking status');
      }
    }

    if (booking.paymentStatus) {
      const validPaymentStatuses = ['Paid', 'Pending', 'Failed', 'Refunded'];
      if (!validPaymentStatuses.includes(booking.paymentStatus)) {
        throw new ValidationError('paymentStatus', 'Invalid payment status');
      }
    }

    if (booking.specialRequests) {
      this.maxLength(booking.specialRequests, 500, 'specialRequests');
      booking.specialRequests = this.sanitizeString(booking.specialRequests);
    }

    // Business rule validations
    if (booking.totalAmount && booking.commissionAmount) {
      const commissionPercentage = (booking.commissionAmount / booking.totalAmount) * 100;
      if (commissionPercentage > 25) {
        throw new ValidationError('commissionAmount', 'Commission percentage cannot exceed 25%');
      }
    }
  }

  static validateComplaint(complaint: Partial<Complaint>): void {
    if (complaint.subject) {
      this.required(complaint.subject, 'subject');
      this.minLength(complaint.subject, 5, 'subject');
      this.maxLength(complaint.subject, 200, 'subject');
      complaint.subject = this.sanitizeString(complaint.subject);
    }

    if (complaint.description) {
      this.required(complaint.description, 'description');
      this.minLength(complaint.description, 10, 'description');
      this.maxLength(complaint.description, 2000, 'description');
      complaint.description = this.sanitizeString(complaint.description);
    }

    if (complaint.priority) {
      const validPriorities = ['Low', 'Medium', 'High', 'Critical'];
      if (!validPriorities.includes(complaint.priority)) {
        throw new ValidationError('priority', 'Invalid priority level');
      }
    }

    if (complaint.status) {
      const validStatuses = ['Open', 'In Progress', 'Resolved', 'Escalated'];
      if (!validStatuses.includes(complaint.status)) {
        throw new ValidationError('status', 'Invalid complaint status');
      }
    }

    if (complaint.customerName) {
      this.required(complaint.customerName, 'customerName');
      this.minLength(complaint.customerName, 2, 'customerName');
      this.maxLength(complaint.customerName, 100, 'customerName');
      complaint.customerName = this.sanitizeString(complaint.customerName);
    }

    if (complaint.resolution) {
      this.minLength(complaint.resolution, 10, 'resolution');
      this.maxLength(complaint.resolution, 1000, 'resolution');
      complaint.resolution = this.sanitizeString(complaint.resolution);
    }
  }

  static validateOffer(offer: Partial<Offer>): void {
    if (offer.title) {
      this.required(offer.title, 'title');
      this.minLength(offer.title, 3, 'title');
      this.maxLength(offer.title, 100, 'title');
      offer.title = this.sanitizeString(offer.title);
    }

    if (offer.description) {
      this.required(offer.description, 'description');
      this.minLength(offer.description, 10, 'description');
      this.maxLength(offer.description, 500, 'description');
      offer.description = this.sanitizeString(offer.description);
    }

    if (offer.discountValue !== undefined) {
      this.positiveNumber(offer.discountValue, 'discountValue');
      
      if (offer.discountType === 'Percentage') {
        this.range(offer.discountValue, 1, 100, 'discountValue');
      } else if (offer.discountType === 'Fixed Amount') {
        this.range(offer.discountValue, 1, 1000000, 'discountValue'); // Max 10 lakh discount
      }
    }

    if (offer.discountType) {
      const validTypes = ['Percentage', 'Fixed Amount'];
      if (!validTypes.includes(offer.discountType)) {
        throw new ValidationError('discountType', 'Invalid discount type');
      }
    }

    if (offer.validFrom && offer.validTo) {
      this.dateRange(offer.validFrom, offer.validTo);
    }

    if (offer.applicableFor) {
      const validApplicableFor = ['Cruises', 'Hotels', 'Both'];
      if (!validApplicableFor.includes(offer.applicableFor)) {
        throw new ValidationError('applicableFor', 'Invalid applicable service type');
      }
    }

    if (offer.status) {
      const validStatuses = ['Active', 'Inactive', 'Expired'];
      if (!validStatuses.includes(offer.status)) {
        throw new ValidationError('status', 'Invalid offer status');
      }
    }

    if (offer.maxUsage !== undefined && offer.maxUsage <= 0) {
      throw new ValidationError('maxUsage', 'Maximum usage must be a positive number');
    }

    if (offer.usageCount !== undefined && offer.usageCount < 0) {
      throw new ValidationError('usageCount', 'Usage count cannot be negative');
    }

    if (offer.maxUsage !== undefined && offer.usageCount !== undefined && offer.usageCount > offer.maxUsage) {
      throw new ValidationError('usageCount', 'Usage count cannot exceed maximum usage');
    }
  }

  // Enhanced validation for search inputs
  static validateSearchInput(input: string): string {
    if (!input) return '';
    
    // Remove potentially dangerous characters
    const sanitized = input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .replace(/['"\\;]/g, '')
      .trim();
    
    // Limit length
    return sanitized.substring(0, 100);
  }

  // Validate file uploads
  static validateFileUpload(file: File): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf'
    ];

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size exceeds 10MB limit'
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'File type not allowed'
      };
    }

    return { isValid: true };
  }
}