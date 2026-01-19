import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { DashboardStats, Order, Product, Payment } from '../types';
import { dashboardApi } from '../services/api';

// Dashboard state interface
interface DashboardState {
  stats: DashboardStats;
  recentOrders: Order[];
  recentProducts: Product[];
  recentPayments: Payment[];
  isLoading: boolean;
  error: string | null;
  timeRange: '7d' | '30d' | '90d';
}

// Dashboard actions
type DashboardAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_STATS'; payload: DashboardStats }
  | { type: 'SET_RECENT_ORDERS'; payload: Order[] }
  | { type: 'SET_RECENT_PRODUCTS'; payload: Product[] }
  | { type: 'SET_RECENT_PAYMENTS'; payload: Payment[] }
  | { type: 'SET_TIME_RANGE'; payload: '7d' | '30d' | '90d' }
  | { type: 'CLEAR_ERROR' };

// Dashboard context interface
interface DashboardContextType extends DashboardState {
  // Dashboard data fetching
  getDashboardData: () => Promise<void>;
  getStats: () => Promise<void>;
  getRecentOrders: (limit?: number) => Promise<void>;
  getRecentProducts: (limit?: number) => Promise<void>;
  getRecentPayments: (limit?: number) => Promise<void>;
  
  // Utility functions
  setTimeRange: (range: '7d' | '30d' | '90d') => void;
  clearError: () => void;
}

// Initial state
const initialState: DashboardState = {
  stats: {
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
    completedOrders: 0,
    lowStockProducts: 0,
    monthlyRevenue: 0,
    weeklyRevenue: 0,
  },
  recentOrders: [],
  recentProducts: [],
  recentPayments: [],
  isLoading: false,
  error: null,
  timeRange: '30d',
};

// Dashboard reducer
const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'SET_STATS':
      return {
        ...state,
        stats: action.payload,
        isLoading: false,
        error: null,
      };
    case 'SET_RECENT_ORDERS':
      return {
        ...state,
        recentOrders: action.payload,
        isLoading: false,
        error: null,
      };
    case 'SET_RECENT_PRODUCTS':
      return {
        ...state,
        recentProducts: action.payload,
        isLoading: false,
        error: null,
      };
    case 'SET_RECENT_PAYMENTS':
      return {
        ...state,
        recentPayments: action.payload,
        isLoading: false,
        error: null,
      };
    case 'SET_TIME_RANGE':
      return {
        ...state,
        timeRange: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Dashboard provider component
interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  // Get dashboard data (all data at once)
  const getDashboardData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Fetch all dashboard data in parallel
      const [statsResponse, ordersResponse, productsResponse, paymentsResponse] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getRecentOrders(5),
        dashboardApi.getRecentProducts(5),
        dashboardApi.getRecentPayments(5),
      ]);

      if (statsResponse.success === true) {
        dispatch({ type: 'SET_STATS', payload: statsResponse.data });
      }

      if (ordersResponse.success === true) {
        dispatch({ type: 'SET_RECENT_ORDERS', payload: ordersResponse.data || [] });
      }

      if (productsResponse.success === true) {
        dispatch({ type: 'SET_RECENT_PRODUCTS', payload: productsResponse.data || [] });
      }

      if (paymentsResponse.success === true) {
        dispatch({ type: 'SET_RECENT_PAYMENTS', payload: paymentsResponse.data || [] });
      }

    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to fetch dashboard data' 
      });
    }
  };

  // Get stats
  const getStats = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await dashboardApi.getStats();
      
      if (response.success === true) {
        dispatch({ type: 'SET_STATS', payload: response.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to fetch stats' });
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to fetch stats' 
      });
    }
  };

  // Get recent orders
  const getRecentOrders = async (limit: number = 5) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await dashboardApi.getRecentOrders(limit);
      
      if (response.success === true) {
        dispatch({ type: 'SET_RECENT_ORDERS', payload: response.data || [] });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to fetch recent orders' });
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to fetch recent orders' 
      });
    }
  };

  // Get recent products
  const getRecentProducts = async (limit: number = 5) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await dashboardApi.getRecentProducts(limit);
      
      if (response.success === true) {
        dispatch({ type: 'SET_RECENT_PRODUCTS', payload: response.data || [] });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to fetch recent products' });
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to fetch recent products' 
      });
    }
  };

  // Get recent payments
  const getRecentPayments = async (limit: number = 5) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await dashboardApi.getRecentPayments(limit);
      
      if (response.success === true) {
        dispatch({ type: 'SET_RECENT_PAYMENTS', payload: response.data || [] });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to fetch recent payments' });
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to fetch recent payments' 
      });
    }
  };

  // Set time range
  const setTimeRange = (range: '7d' | '30d' | '90d') => {
    dispatch({ type: 'SET_TIME_RANGE', payload: range });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: DashboardContextType = {
    ...state,
    getDashboardData,
    getStats,
    getRecentOrders,
    getRecentProducts,
    getRecentPayments,
    setTimeRange,
    clearError,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

// Custom hook to use dashboard context
export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

