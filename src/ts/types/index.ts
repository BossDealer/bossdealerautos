// Type definitions for the Boss Dealer application

export interface QuoteFormData {
  carBrand: string;
  carModel: string;
  year: string;
  condition: 'new' | 'used' | 'certified';
  budgetRange: string;
  financingPreference: 'cash' | 'finance' | 'lease';
  name: string;
  phone: string;
  email: string;
  additionalNotes?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  preferredContact: 'email' | 'phone';
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface CarBrand {
  value: string;
  label: string;
}

export interface BudgetRange {
  value: string;
  label: string;
}

export interface TeamMember {
  name: string;
  position: string;
  image: string;
  bio: string;
  email?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  location: string;
  image?: string;
  verified: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string>;
}

// Google Maps Types
export interface MapConfig {
  center: google.maps.LatLngLiteral;
  zoom: number;
  mapTypeId: google.maps.MapTypeId;
}

export interface MarkerConfig {
  position: google.maps.LatLngLiteral;
  title: string;
  info: string;
}

// Animation Types
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

// Component State Types
export interface ModalState {
  isOpen: boolean;
  type: 'quote' | 'contact' | 'confirmation' | null;
}

export interface NavigationState {
  isMenuOpen: boolean;
  activeSection: string;
}

export interface FormState {
  isSubmitting: boolean;
  isValid: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

// Utility Types
export type EventCallback = (event: Event) => void;
export type ValidationRule = (value: string) => string | null;
export type FormField = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

// Constants
export const CAR_BRANDS: CarBrand[] = [
  { value: 'toyota', label: 'Toyota' },
  { value: 'honda', label: 'Honda' },
  { value: 'bmw', label: 'BMW' },
  { value: 'mercedes', label: 'Mercedes-Benz' },
  { value: 'audi', label: 'Audi' },
  { value: 'volkswagen', label: 'Volkswagen' },
  { value: 'nissan', label: 'Nissan' },
  { value: 'ford', label: 'Ford' },
  { value: 'chevrolet', label: 'Chevrolet' },
  { value: 'hyundai', label: 'Hyundai' },
  { value: 'kia', label: 'Kia' },
  { value: 'mazda', label: 'Mazda' },
  { value: 'subaru', label: 'Subaru' },
  { value: 'lexus', label: 'Lexus' },
  { value: 'infiniti', label: 'Infiniti' },
  { value: 'acura', label: 'Acura' },
  { value: 'other', label: 'Other' }
];

export const BUDGET_RANGES: BudgetRange[] = [
  { value: 'under-2m', label: 'Under ₦2,000,000' },
  { value: '2m-5m', label: '₦2,000,000 - ₦5,000,000' },
  { value: '5m-10m', label: '₦5,000,000 - ₦10,000,000' },
  { value: '10m-15m', label: '₦10,000,000 - ₦15,000,000' },
  { value: '15m-25m', label: '₦15,000,000 - ₦25,000,000' },
  { value: '25m-50m', label: '₦25,000,000 - ₦50,000,000' },
  { value: 'over-50m', label: 'Over ₦50,000,000' }
];

export const YEARS: string[] = Array.from({ length: 5 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return year.toString();
});

// SEO Meta Data Types
export interface SEOMetaData {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterSite?: string;
  canonicalUrl?: string;
  structuredData?: Record<string, any>;
}