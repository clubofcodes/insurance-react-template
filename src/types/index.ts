// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "master_admin" | "agency_admin" | "agent";
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  agencyId?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Agency Types
export interface Agency {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: "active" | "inactive";
  licenseNumber: string;
  createdAt: string;
  updatedAt: string;
}

// Agent Types
export interface Agent {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  agencyId: string;
  agencyName: string;
  status: "active" | "inactive";
  licenseNumber: string;
  commissionRate: number;
  createdAt: string;
  updatedAt: string;
}

// Customer Types
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

// Quote Types
export interface Quote {
  id: string;
  customerId: string;
  customerName: string;
  agentId: string;
  agentName: string;
  agencyId: string;
  agencyName: string;
  insuranceType: "auto" | "home" | "life" | "health" | "business";
  status: "draft" | "pending" | "approved" | "declined" | "expired";
  premium: number;
  deductible: number;
  coverageAmount: number;
  terms: string;
  validUntil: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalQuotes: number;
  totalPremium: number;
  totalAgencies: number;
  totalAgents: number;
  totalCustomers: number;
  recentQuotes: Quote[];
  monthlyStats: {
    month: string;
    quotes: number;
    premium: number;
  }[];
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface CreateAgencyFormData {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  licenseNumber: string;
}

export interface CreateAgentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  agencyId: string;
  licenseNumber: string;
  commissionRate: number;
}

export interface CreateQuoteFormData {
  customerId: string;
  insuranceType: "auto" | "home" | "life" | "health" | "business";
  premium: number;
  deductible: number;
  coverageAmount: number;
  terms: string;
  validUntil: string;
  notes?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter and Search Types
export interface QuoteFilters {
  status?: string;
  insuranceType?: string;
  agencyId?: string;
  agentId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface AgentFilters {
  agencyId?: string;
  status?: string;
  search?: string;
}

export interface CustomerFilters {
  status?: string;
  search?: string;
}
