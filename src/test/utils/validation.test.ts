import { describe, it, expect } from 'vitest';
import { Validator, ValidationError } from '../../utils/validation';

describe('Validator', () => {
  describe('email validation', () => {
    it('should validate correct email addresses', () => {
      expect(Validator.email('test@example.com')).toBe(true);
      expect(Validator.email('user.name@domain.co.uk')).toBe(true);
      expect(Validator.email('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(Validator.email('invalid-email')).toBe(false);
      expect(Validator.email('test@')).toBe(false);
      expect(Validator.email('@example.com')).toBe(false);
      expect(Validator.email('test..test@example.com')).toBe(false);
    });
  });

  describe('phone validation', () => {
    it('should validate correct phone numbers', () => {
      expect(Validator.phone('+91 9876543210')).toBe(true);
      expect(Validator.phone('9876543210')).toBe(true);
      expect(Validator.phone('+1 (555) 123-4567')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(Validator.phone('123')).toBe(false);
      expect(Validator.phone('abcdefghij')).toBe(false);
      expect(Validator.phone('')).toBe(false);
    });
  });

  describe('required validation', () => {
    it('should pass for valid values', () => {
      expect(() => Validator.required('test', 'field')).not.toThrow();
      expect(() => Validator.required(123, 'field')).not.toThrow();
      expect(() => Validator.required(['item'], 'field')).not.toThrow();
    });

    it('should throw for invalid values', () => {
      expect(() => Validator.required('', 'field')).toThrow(ValidationError);
      expect(() => Validator.required(null, 'field')).toThrow(ValidationError);
      expect(() => Validator.required(undefined, 'field')).toThrow(ValidationError);
      expect(() => Validator.required([], 'field')).toThrow(ValidationError);
    });
  });

  describe('validateBooking', () => {
    it('should validate valid booking data', () => {
      const validBooking = {
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '+91 9876543210',
        totalAmount: 50000,
        commissionAmount: 2500,
        guests: 2,
        type: 'Cruise' as const,
        status: 'Confirmed' as const,
        paymentStatus: 'Paid' as const
      };

      expect(() => Validator.validateBooking(validBooking)).not.toThrow();
    });

    it('should throw error for invalid email', () => {
      const invalidBooking = {
        customerName: 'John Doe',
        customerEmail: 'invalid-email',
        customerPhone: '+91 9876543210'
      };

      expect(() => Validator.validateBooking(invalidBooking))
        .toThrow(ValidationError);
    });

    it('should throw error for excessive commission', () => {
      const highCommissionBooking = {
        totalAmount: 100000,
        commissionAmount: 30000 // 30%
      };

      expect(() => Validator.validateBooking(highCommissionBooking))
        .toThrow('Commission percentage cannot exceed 25%');
    });

    it('should sanitize customer name', () => {
      const booking = {
        customerName: 'John <script>alert("xss")</script> Doe'
      };

      Validator.validateBooking(booking);
      expect(booking.customerName).toBe('John  Doe');
    });
  });

  describe('sanitizeString', () => {
    it('should remove dangerous characters', () => {
      expect(Validator.sanitizeString('<script>alert("xss")</script>'))
        .toBe('alert("xss")');
      expect(Validator.sanitizeString('javascript:alert(1)'))
        .toBe('alert(1)');
      expect(Validator.sanitizeString('onclick=alert(1)'))
        .toBe('alert(1)');
    });

    it('should preserve safe content', () => {
      expect(Validator.sanitizeString('John Doe')).toBe('John Doe');
      expect(Validator.sanitizeString('Royal Caribbean Explorer')).toBe('Royal Caribbean Explorer');
    });
  });

  describe('validateSearchInput', () => {
    it('should sanitize and limit search input', () => {
      const longInput = 'a'.repeat(150);
      const result = Validator.validateSearchInput(longInput);
      expect(result.length).toBe(100);
    });

    it('should remove dangerous characters from search', () => {
      const dangerousInput = '<script>alert("xss")</script>';
      const result = Validator.validateSearchInput(dangerousInput);
      expect(result).toBe('alert("xss")');
    });
  });

  describe('validateFileUpload', () => {
    it('should validate allowed file types', () => {
      const validFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const result = Validator.validateFileUpload(validFile);
      expect(result.isValid).toBe(true);
    });

    it('should reject disallowed file types', () => {
      const invalidFile = new File(['content'], 'test.exe', { type: 'application/exe' });
      const result = Validator.validateFileUpload(invalidFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('File type not allowed');
    });

    it('should reject oversized files', () => {
      const largeContent = new Array(11 * 1024 * 1024).fill('a').join(''); // 11MB
      const largeFile = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });
      const result = Validator.validateFileUpload(largeFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('File size exceeds 10MB limit');
    });
  });
});