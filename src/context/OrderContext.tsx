import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { Order } from '../types';
import { orderApi } from '../services/api';

// Order state interface
interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: {
    status: string;
    sort: string;
  };
  stats: {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
  };
}

// Order actions
type OrderAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ORDERS'; payload: { orders: Order[]; pagination: any } }
  | { type: 'SET_CURRENT_ORDER'; payload: Order | null }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: Order }
  | { type: 'DELETE_ORDER'; payload: string }
  | { type: 'SET_FILTERS'; payload: { status?: string; sort?: string } }
  | { type: 'SET_STATS'; payload: any }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'CLEAR_ERROR' };

// Order context interface
interface OrderContextType extends OrderState {
  // Order CRUD operations
  getOrders: (params?: any) => Promise<void>;
  getOrder: (id: string) => Promise<void>;
  createOrder: (orderData: any) => Promise<Order | null>;
  updateOrder: (id: string, orderData: any) => Promise<Order | null>;
  deleteOrder: (id: string) => Promise<boolean>;
  
  // Order management
  getOrderStats: () => Promise<void>;
  
  // Utility functions
  setFilters: (filters: { status?: string; sort?: string }) => void;
  clearFilters: () => void;
  clearError: () => void;
}

// Initial state
const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  filters: {
    status: '',
    sort: '',
  },
  stats: {
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  },
};

// Order reducer
const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
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
    case 'SET_ORDERS':
      return {
        ...state,
        orders: action.payload.orders,
        pagination: action.payload.pagination,
        isLoading: false,
        error: null,
      };
    case 'SET_CURRENT_ORDER':
      return {
        ...state,
        currentOrder: action.payload,
        isLoading: false,
        error: null,
      };
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders],
      };
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order._id === action.payload._id ? action.payload : order
        ),
        currentOrder: state.currentOrder?._id === action.payload._id 
          ? action.payload 
          : state.currentOrder,
      };
    case 'DELETE_ORDER':
      return {
        ...state,
        orders: state.orders.filter(order => order._id !== action.payload),
        currentOrder: state.currentOrder?._id === action.payload 
          ? null 
          : state.currentOrder,
      };
    case 'SET_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    case 'SET_STATS':
      return {
        ...state,
        stats: action.payload,
      };
    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: {
          status: '',
          sort: '',
        },
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
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Order provider component
interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  // Get orders
  const getOrders = async (params?: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await orderApi.getOrders({
        ...state.filters,
        ...params,
      });
      
      if (response.status === 'success') {
        dispatch({
          type: 'SET_ORDERS',
          payload: {
            orders: response.data || [],
            pagination: response.pagination || state.pagination,
          },
        });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to fetch orders' });
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to fetch orders' 
      });
    }
  };

  // Get single order
  const getOrder = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await orderApi.getOrder(id);
      
      if (response.status === 'success') {
        dispatch({ type: 'SET_CURRENT_ORDER', payload: response.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to fetch order' });
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to fetch order' 
      });
    }
  };

  // Create order
  const createOrder = async (orderData: any): Promise<Order | null> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await orderApi.createOrder(orderData);
      
      if (response.status === 'success' && response.data) {
        dispatch({ type: 'ADD_ORDER', payload: response.data });
        return response.data;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to create order' });
        return null;
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to create order' 
      });
      return null;
    }
  };

  // Update order
  const updateOrder = async (id: string, orderData: any): Promise<Order | null> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await orderApi.updateOrder(id, orderData);
      
      if (response.status === 'success' && response.data) {
        dispatch({ type: 'UPDATE_ORDER', payload: response.data });
        return response.data;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to update order' });
        return null;
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to update order' 
      });
      return null;
    }
  };

  // Delete order
  const deleteOrder = async (id: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await orderApi.deleteOrder(id);
      
      if (response.status === 'success') {
        dispatch({ type: 'DELETE_ORDER', payload: id });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to delete order' });
        return false;
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to delete order' 
      });
      return false;
    }
  };

  // Get order stats
  const getOrderStats = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await orderApi.getOrderStats();
      
      if (response.status === 'success') {
        dispatch({ type: 'SET_STATS', payload: response.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to fetch order stats' });
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to fetch order stats' 
      });
    }
  };

  // Set filters
  const setFilters = (filters: { status?: string; sort?: string }) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  // Clear filters
  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: OrderContextType = {
    ...state,
    getOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder,
    getOrderStats,
    setFilters,
    clearFilters,
    clearError,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook to use order context
export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

