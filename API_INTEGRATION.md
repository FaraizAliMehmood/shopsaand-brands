# Backend API Integration with Context API

This document outlines the integration of the Backend APIs with the Brands frontend using React Context API for state management.

## Overview

The Brands frontend has been successfully integrated with the Backend APIs using a comprehensive Context API setup that provides:

- **Centralized State Management**: All API data is managed through React Context providers
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Error Handling**: Built-in error handling and loading states
- **Authentication**: Complete auth flow with token management
- **Real-time Updates**: Context-based state updates across components

## Architecture

### 1. Type Definitions (`src/types/index.ts`)

Comprehensive TypeScript interfaces for all data models:
- User, Product, Order, Payment types
- API response wrappers
- Authentication types
- Dashboard and notification types

### 2. API Service Layer (`src/services/api.ts`)

Centralized API service with:
- Generic HTTP request methods
- Automatic token management
- Error handling and response parsing
- File upload support
- Organized endpoint groups (auth, products, orders, etc.)

### 3. Context Providers

#### AuthContext (`src/context/AuthContext.tsx`)
- User authentication state management
- Login/logout functionality
- Profile management
- Token refresh handling
- Automatic redirects

#### ProductContext (`src/context/ProductContext.tsx`)
- Product CRUD operations
- Search and filtering
- Stock management
- Product analytics

#### OrderContext (`src/context/OrderContext.tsx`)
- Order management
- Order statistics
- Status tracking

#### DashboardContext (`src/context/DashboardContext.tsx`)
- Dashboard statistics
- Recent data fetching
- Time range management

### 4. Combined Provider (`src/context/index.tsx`)

Wraps all contexts in a single provider for easy setup.

## API Endpoints Integration

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Product Endpoints
- `GET /api/products` - List products with pagination
- `POST /api/products` - Create product (brand only)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/search` - Search products
- `GET /api/products/featured` - Get featured products

### Order Endpoints
- `GET /api/orders` - List orders with pagination
- `GET /api/orders/stats` - Get order statistics
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order

### Payment Endpoints
- `GET /api/payments` - List payments
- `GET /api/payments/stats` - Get payment statistics
- `POST /api/payments/:id/process` - Process payment

### Dashboard Endpoints
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-orders` - Get recent orders
- `GET /api/dashboard/recent-products` - Get recent products
- `GET /api/dashboard/recent-payments` - Get recent payments

## Updated Components

### 1. App.tsx
- Wrapped with `AppProviders` for context access
- Added login route
- Proper routing structure

### 2. Login.tsx
- Integrated with AuthContext
- Form validation and error handling
- Automatic redirects after login
- Loading states

### 3. Register.tsx
- Integrated with AuthContext
- Complete registration form with validation
- Terms acceptance handling
- Error display

### 4. Dashboard.tsx
- Integrated with DashboardContext
- Real-time data fetching
- Dynamic time range selection
- Loading and error states

## Usage Examples

### Using Authentication Context

```tsx
import { useAuth } from '../context/AuthContext'

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth()
  
  const handleLogin = async () => {
    await login({ email, password })
  }
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.firstName}!</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  )
}
```

### Using Product Context

```tsx
import { useProduct } from '../context/ProductContext'

function ProductList() {
  const { products, getProducts, isLoading } = useProduct()
  
  useEffect(() => {
    getProducts()
  }, [])
  
  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      {products.map(product => (
        <div key={product._id}>{product.name}</div>
      ))}
    </div>
  )
}
```

### Using Dashboard Context

```tsx
import { useDashboard } from '../context/DashboardContext'

function Dashboard() {
  const { stats, recentOrders, getDashboardData, isLoading } = useDashboard()
  
  useEffect(() => {
    getDashboardData()
  }, [])
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Orders: {stats.totalOrders}</p>
      {/* Render other dashboard components */}
    </div>
  )
}
```

## Environment Configuration

Create a `.env` file in the Brands directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=ShopSand Brands
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=development
```

## Key Features

1. **Automatic Token Management**: Tokens are automatically stored and included in requests
2. **Error Handling**: Comprehensive error handling with user-friendly messages
3. **Loading States**: Built-in loading indicators for better UX
4. **Type Safety**: Full TypeScript support prevents runtime errors
5. **Centralized State**: All API data is managed in one place
6. **Real-time Updates**: Context updates trigger component re-renders
7. **Pagination Support**: Built-in pagination for large datasets
8. **Search and Filtering**: Advanced filtering capabilities

## Security Features

- JWT token authentication
- Automatic token refresh
- Secure token storage in localStorage
- CORS configuration
- Input validation and sanitization

## Next Steps

1. **Add Protected Routes**: Implement route protection based on authentication status
2. **Add More Contexts**: Create contexts for notifications, chat, and KYC
3. **Implement Caching**: Add data caching for better performance
4. **Add Offline Support**: Implement offline functionality with service workers
5. **Add Real-time Updates**: Integrate WebSocket for real-time data updates

## Testing

To test the integration:

1. Start the Backend server: `npm run dev` (in Backend directory)
2. Start the Brands frontend: `npm run dev` (in Brands directory)
3. Navigate to `http://localhost:5173`
4. Test login/register functionality
5. Verify dashboard data loading
6. Test product and order management

## Troubleshooting

### Common Issues

1. **API Connection Errors**: Ensure Backend server is running on port 5000
2. **CORS Errors**: Check Backend CORS configuration
3. **Token Issues**: Clear localStorage and try logging in again
4. **Type Errors**: Ensure all types are properly imported

### Debug Mode

Enable debug mode by setting `VITE_NODE_ENV=development` in your environment file.
