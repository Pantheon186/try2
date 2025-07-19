// Data Formatting Utilities
export class Formatters {
  // Currency formatting
  static currency(amount: number, currency: string = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Date formatting
  static date(dateString: string, options?: Intl.DateTimeFormatOptions): string {
    const date = new Date(dateString);
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-IN', options || defaultOptions);
  }

  static dateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  static relativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return this.date(dateString);
  }

  // Number formatting
  static number(num: number): string {
    return new Intl.NumberFormat('en-IN').format(num);
  }

  static percentage(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`;
  }

  // Text formatting
  static truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  static capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  static initials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  // Phone formatting
  static phone(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+91 ${cleaned.substring(0, 5)} ${cleaned.substring(5)}`;
    }
    return phoneNumber;
  }

  // Status formatting
  static statusColor(status: string): string {
    const statusColors: Record<string, string> = {
      'Active': 'green',
      'Inactive': 'red',
      'Pending': 'orange',
      'Confirmed': 'green',
      'Cancelled': 'red',
      'Completed': 'blue',
      'Open': 'red',
      'In Progress': 'orange',
      'Resolved': 'green',
      'Escalated': 'purple',
      'Paid': 'green',
      'Failed': 'red',
      'Refunded': 'blue'
    };
    return statusColors[status] || 'gray';
  }

  // File size formatting
  static fileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Duration formatting
  static duration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  }

  // Commission calculation
  static calculateCommission(amount: number, rate: number = 5): number {
    return Math.round(amount * (rate / 100));
  }

  // Booking reference generator
  static generateBookingReference(type: 'Cruise' | 'Hotel'): string {
    const prefix = type === 'Cruise' ? 'CR' : 'HT';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }
}