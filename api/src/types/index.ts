// Main types for the Telemax Pipes app
export interface Pipe {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: PipeCategory;
  material: PipeMaterial;
  brand: string;
  inStock: boolean;
  featured: boolean;
  specifications: PipeSpecifications;
  reviews: Review[];
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface PipeSpecifications {
  length: string;
  bowlDiameter: string;
  bowlDepth: string;
  weight: string;
  stemMaterial: string;
  finish: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  verified: boolean;
}

export type PipeCategory = 
  | 'briar'
  | 'meerschaum'
  | 'corn-cob'
  | 'clay'
  | 'artisan'
  | 'vintage'
  | 'beginner';

export type PipeMaterial = 
  | 'briar-wood'
  | 'meerschaum'
  | 'corn-cob'
  | 'clay'
  | 'cherry-wood'
  | 'olive-wood'
  | 'rosewood';

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  pipeCount: number;
  slug: string;
}

export interface CartItem {
  pipe: Pipe;
  quantity: number;
  addedAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  addresses: Address[];
  orders: Order[];
  wishlist: string[]; // pipe IDs
  preferences: UserPreferences;
  createdAt: string;
}

export interface Address {
  id: string;
  type: 'billing' | 'shipping';
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface UserPreferences {
  currency: 'USD' | 'EUR' | 'GBP';
  language: 'en' | 'fr' | 'de' | 'es';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  trackingNumber?: string;
  createdAt: string;
  estimatedDelivery?: string;
}

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple-pay' | 'google-pay';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}