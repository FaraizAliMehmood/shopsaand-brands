import React, { type ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { ProductProvider } from './ProductContext';
import { OrderProvider } from './OrderContext';
import { DashboardProvider } from './DashboardContext';

// Combined context provider component
interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <ProductProvider>
        <OrderProvider>
          <DashboardProvider>
            {children}
          </DashboardProvider>
        </OrderProvider>
      </ProductProvider>
    </AuthProvider>
  );
};

// Export all contexts and hooks
export { AuthProvider } from './AuthContext';
export { useAuth } from './AuthContext';
export { ProductProvider } from './ProductContext';
export { useProduct } from './ProductContext';
export { OrderProvider } from './OrderContext';
export { useOrder } from './OrderContext';
export { DashboardProvider } from './DashboardContext';
export { useDashboard } from './DashboardContext';

export default AppProviders;
