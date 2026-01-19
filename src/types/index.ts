// User types
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'brand' | 'admin' | 'customer';
  isEmailVerified: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser extends User {
  token: string;
  refreshToken: string;
}



// Product types
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  image: string[];
  stock: number;
  status: string;
  isAvailable: string;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Order types
export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
  total: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Payment types
export interface Payment {
  _id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'credit_card' | 'paypal' | 'stripe' | 'bank_transfer';
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard types
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
  completedOrders: number;
  lowStockProducts: number;
  monthlyRevenue: number;
  weeklyRevenue: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    current: number;
    pages: number;
    limit: number;
    total: number;
   
  };
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  role: 'brand';
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
}

// Auth response types
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
  };
}

// Notification types
export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

// KYC types
export interface KycData {
  _id: string;
  businessName: string;
  businessType: string;
  registrationNumber: string;
  taxId: string;
  address: Address;
  contactPerson: {
    name: string;
    phone: string;
    email: string;
  };
  documents: {
    businessLicense: string;
    taxCertificate: string;
    bankStatement: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
}

// Chat types
export interface ChatMessage {
  _id: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  receiver: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  message: string;
  type: 'text' | 'image' | 'file';
  isRead: boolean;
  createdAt: string;
}

export interface ChatRoom {
  _id: string;
  participants: User[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}
