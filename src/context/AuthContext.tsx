import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginCredentials, RegisterData, UpdateProfileData } from '../types';
import { authApi } from '../services/api';
import { auth, db } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updatePassword,
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';

// Auth state interface
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

// Auth actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string | null }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_SUCCESS_MESSAGE'; payload: string }
  | { type: 'CLEAR_SUCCESS_MESSAGE' }
  | { type: 'REGISTER_SUCCESS'; payload: string };

// Auth context interface
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  clearError: () => void;
  clearSuccessMessage: () => void;
  refreshToken: () => Promise<void>;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  successMessage: null,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
        successMessage: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        successMessage: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload || null,
        successMessage: null,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        successMessage: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_SUCCESS_MESSAGE':
      return {
        ...state,
        successMessage: action.payload,
        error: null,
      };
    case 'CLEAR_SUCCESS_MESSAGE':
      return {
        ...state,
        successMessage: null,
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isLoading: false,
        successMessage: action.payload,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Helper function to convert Firestore user data to User type
  const mapFirestoreUserToUser = (firestoreData: any, uid: string): User => {
    return {
      _id: uid,
      email: firestoreData.email || '',
      firstName: firestoreData.firstName || '',
      lastName: firestoreData.lastName || '',
      role: firestoreData.role || 'brand',
      isEmailVerified: firestoreData.isEmailVerified || false,
      avatar: firestoreData.avatar,
      createdAt: firestoreData.createdAt?.toDate?.()?.toISOString() || firestoreData.createdAt || new Date().toISOString(),
      updatedAt: firestoreData.updatedAt?.toDate?.()?.toISOString() || firestoreData.updatedAt || new Date().toISOString(),
    };
  };

  // Helper function to get or create user in Firestore
  const getOrCreateUserInFirestore = async (firebaseUser: FirebaseUser): Promise<User> => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      // User exists, return the data
      const userData = userSnap.data();
      return mapFirestoreUserToUser(userData, firebaseUser.uid);
    } else {
      // User doesn't exist, create a new document
      const newUserData = {
        email: firebaseUser.email || '',
        firstName: '',
        lastName: '',
        role: 'brand' as const,
        isEmailVerified: firebaseUser.emailVerified,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      await setDoc(userRef, newUserData);
      return mapFirestoreUserToUser(newUserData, firebaseUser.uid);
    }
  };

  // Check for existing Firebase auth state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          dispatch({ type: 'AUTH_START' });
          // Get ID token
          const token = await firebaseUser.getIdToken();
          
          // Get or create user in Firestore
          const user = await getOrCreateUserInFirestore(firebaseUser);
          
          localStorage.setItem('token', token);
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user,
              token,
            },
          });
        } catch (error) {
          console.error('Error getting user data:', error);
          dispatch({ 
            type: 'AUTH_FAILURE', 
            payload: error instanceof Error ? error.message : 'Authentication failed' 
          });
        }
      } else {
        // No user signed in
        localStorage.removeItem('token');
        dispatch({ 
          type: 'AUTH_FAILURE', 
          payload: null 
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Login function using Firebase Authentication
  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      
      const firebaseUser = userCredential.user;
      
      // Get ID token
      const token = await firebaseUser.getIdToken();
      
      // Get or create user in Firestore
      const user = await getOrCreateUserInFirestore(firebaseUser);
      
      // Update last login time in Firestore
      const userRef = doc(db, 'users', firebaseUser.uid);
      await updateDoc(userRef, {
        updatedAt: serverTimestamp(),
      });
      
      localStorage.setItem('token', token);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token },
      });
    } catch (error: any) {
      let errorMessage = 'Login failed';
      
      // Handle Firebase auth errors
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch({ 
        type: 'AUTH_FAILURE', 
        payload: errorMessage
      });
    }
  };

  // Register function
  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authApi.register(userData);
      
      if (response.success) {
        // Set success message and stop loading
        dispatch({
          type: 'REGISTER_SUCCESS',
          payload: response.message || 'User registered successfully. Please check your email for verification.'
        });
      } else {
        dispatch({ 
          type: 'AUTH_FAILURE', 
          payload: response.message || 'Registration failed' 
        });
      }
    } catch (error) {
      dispatch({ 
        type: 'AUTH_FAILURE', 
        payload: error instanceof Error ? error.message : 'Registration failed' 
      });
    }
  };

  // Logout function using Firebase
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  // Update profile function using Firestore
  const updateProfile = async (data: UpdateProfileData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      if (!state.user) {
        throw new Error('User not authenticated');
      }
      
      const userRef = doc(db, 'users', state.user._id);
      const updateData: any = {
        updatedAt: serverTimestamp(),
      };
      
      if (data.firstName !== undefined) updateData.firstName = data.firstName;
      if (data.lastName !== undefined) updateData.lastName = data.lastName;
      if (data.avatar !== undefined) updateData.avatar = data.avatar;
      
      await updateDoc(userRef, updateData);
      
      // Get updated user data
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const updatedUser = mapFirestoreUserToUser(userSnap.data(), state.user._id);
        dispatch({
          type: 'UPDATE_USER',
          payload: updatedUser,
        });
      }
    } catch (error) {
      dispatch({ 
        type: 'AUTH_FAILURE', 
        payload: error instanceof Error ? error.message : 'Profile update failed' 
      });
    }
  };

  // Change password function using Firebase
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const firebaseUser = auth.currentUser;
      if (!firebaseUser || !firebaseUser.email) {
        throw new Error('User not authenticated');
      }
      
      // Re-authenticate user with current password
      const credential = await signInWithEmailAndPassword(
        auth,
        firebaseUser.email,
        currentPassword
      );
      
      // Update password
      await updatePassword(credential.user, newPassword);
      
      dispatch({ type: 'CLEAR_ERROR' });
      dispatch({ 
        type: 'SET_SUCCESS_MESSAGE', 
        payload: 'Password changed successfully' 
      });
    } catch (error: any) {
      let errorMessage = 'Password change failed';
      
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Current password is incorrect.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'New password is too weak.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch({ 
        type: 'AUTH_FAILURE', 
        payload: errorMessage
      });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Clear success message function
  const clearSuccessMessage = () => {
    dispatch({ type: 'CLEAR_SUCCESS_MESSAGE' });
  };

  // Refresh token function using Firebase
  const refreshToken = async () => {
    try {
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        // Get fresh ID token
        const token = await firebaseUser.getIdToken(true); // Force refresh
        localStorage.setItem('token', token);
        // Update the token in the state without changing the user
        if (state.user) {
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: state.user,
              token,
            },
          });
        }
      }
    } catch (error) {
      // If refresh fails, logout the user
      localStorage.removeItem('token');
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
    clearSuccessMessage,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
