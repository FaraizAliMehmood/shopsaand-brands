import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../types';
import { productApi } from '../services/api';

// Product state interface
interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

// Product actions
type ProductAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PRODUCTS'; payload: { products: Product[]; pagination: any } }
  | { type: 'SET_CURRENT_PRODUCT'; payload: Product | null }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'SET_FILTERS'; payload: { search?: string; category?: string; sort?: string } }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'CLEAR_ERROR' };

// Product context interface
interface ProductContextType extends ProductState {
  // Product CRUD operations
  getProducts: (page?: number, limit?: number) => Promise<void>;
  getProduct: (id: string) => Promise<void>;
  createProduct: (productData: any) => Promise<Product | null>;
  updateProduct: (id: string, productData: any) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  
  // Product management
  updateProductStock: (id: string, stock: number) => Promise<boolean>;
  toggleProductStatus: (id: string) => Promise<boolean>;
  
  // Search and filtering
  searchProducts: (query: string) => Promise<void>;
  getFeaturedProducts: (query: string) => Promise<void>;
  getProductsByCategory: (category: string, params?: any) => Promise<void>;
  
  // Utility functions
  setFilters: (filters: { search?: string; category?: string; sort?: string }) => void;
  clearFilters: () => void;
  clearError: () => void;
}

// Initial state
const initialState: ProductState = {
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  pagination: {
    current: 1,
    limit: 10,
    total: 0,
    pages: 0,
  }
};

// Product reducer
const productReducer = (state: ProductState, action: ProductAction): ProductState => {
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
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload.products,
        pagination: action.payload.pagination,
        isLoading: false,
        error: null,
      };
    case 'SET_CURRENT_PRODUCT':
      return {
        ...state,
        currentProduct: action.payload,
        isLoading: false,
        error: null,
      };
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [action.payload, ...state.products],
      };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product._id === action.payload._id ? action.payload : product
        ),
        currentProduct: state.currentProduct?._id === action.payload._id 
          ? action.payload 
          : state.currentProduct,
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product._id !== action.payload),
        currentProduct: state.currentProduct?._id === action.payload 
          ? null 
          : state.currentProduct,
      };
    // case 'SET_FILTERS':
    //   return {
    //     ...state,
    //     filters: {
    //       ...state.filters,
    //       ...action.payload,
    //     },
    //   };
    // case 'CLEAR_FILTERS':
    //   return {
    //     ...state,
    //     filters: {
    //       search: '',
    //       category: '',
    //       sort: '',
    //     },
    //   };
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
const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Product provider component
interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Get products
  const getProducts = async (page?: number,limit?: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await productApi.getProducts(page,limit);
      if (response.success === true) {
        dispatch({
          type: 'SET_PRODUCTS',
          payload: {
            products: (response.data as any).products,
            pagination: (response as any).pagination || state.pagination,
          },
        });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to fetch products' });
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to fetch products' 
      });
    }
  };

  // Get single product
  const getProduct = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await productApi.getProduct(id);
      
      if (response.success === true) {
        dispatch({ type: 'SET_CURRENT_PRODUCT', payload: response.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to fetch product' });
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to fetch product' 
      });
    }
  };

  // Create product
  const createProduct = async (productData: any): Promise<Product | null> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      console.log('ProductContext - Creating product with data:', productData);
      const response = await productApi.createProduct(productData);
      
      if (response.success === true && response.data) {
        dispatch({ type: 'ADD_PRODUCT', payload: response.data });
        return response.data;
      } else {
        console.error('ProductContext - Create product failed:', response);
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to create product' });
        return null;
      }
    } catch (error) {
      console.error('ProductContext - Create product error:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to create product' 
      });
      return null;
    }
  };

  // Update product
  const updateProduct = async (id: string, productData: any): Promise<Product | null> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      console.log(productData,id)
      const response = await productApi.updateProduct(id, productData);
      
      if (response.success === true && response.data) {
        dispatch({ type: 'UPDATE_PRODUCT', payload: response.data });
        return response.data;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to update product' });
        return null;
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to update product' 
      });
      return null;
    }
  };

  // Delete product
  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await productApi.deleteProduct(id);
      
      if (response.success === true) {
        dispatch({ type: 'DELETE_PRODUCT', payload: id });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to delete product' });
        return false;
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to delete product' 
      });
      return false;
    }
  };

  // Update product stock
  const updateProductStock = async (id: string, stock: number): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await productApi.updateProductStock(id, stock);
      
      if (response.success === true) {
        // Refresh the current product or product list
        if (state.currentProduct?._id === id) {
          await getProduct(id);
        } else {
          await getProducts();
        }
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to update stock' });
        return false;
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to update stock' 
      });
      return false;
    }
  };

  // Toggle product status
  const toggleProductStatus = async (id: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await productApi.toggleProductStatus(id);
      
      if (response.success === true) {
        // Refresh the current product or product list
        if (state.currentProduct?._id === id) {
          await getProduct(id);
        } else {
          await getProducts(1,10);
        }
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to toggle status' });
        return false;
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to toggle status' 
      });
      return false;
    }
  };

  // Search products
  const searchProducts = async (query: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await productApi.searchProducts(query);
      
      if (response.success === true) {
        dispatch({
          type: 'SET_PRODUCTS',
          payload: {
            products: response.data || [],
            pagination: state.pagination,
          },
        });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Search failed' });
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Search failed' 
      });
    }
  };

  // Get featured products
  const getFeaturedProducts = async (query: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await productApi.getFeaturedProducts(query);
      if (response.success === true) {
        dispatch({
          type: 'SET_PRODUCTS',
          payload: {
            products: response.data.products || [],
            pagination: state.pagination,
          },
        });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to fetch featured products' });
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to fetch featured products' 
      });
    }
  };

  // Get products by category
  const getProductsByCategory = async (category: string, params?: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await productApi.getProductsByCategory(category, {
        // ...state.filters,
        ...params,
      });
      
      if (response.success === true) {
        dispatch({
          type: 'SET_PRODUCTS',
          payload: {
            products: response.data || [],
            pagination: (response as any).pagination || state.pagination,
          },
        });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to fetch products by category' });
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to fetch products by category' 
      });
    }
  };

  // Set filters
  const setFilters = (filters: { search?: string; category?: string; sort?: string }) => {
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

  const value: ProductContextType = {
    ...state,
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    toggleProductStatus,
    searchProducts,
    getFeaturedProducts,
    getProductsByCategory,
    setFilters,
    clearFilters,
    clearError,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to use product context
export const useProduct = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};

