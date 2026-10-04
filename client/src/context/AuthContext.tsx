import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AccessibilityPreference, TravelStyle } from '../types';
import { authApi, ApiError } from '../lib/api';
import {
  signInWithGoogle,
  firebaseSignOut,
  onFirebaseAuthStateChanged,
  type FirebaseUser,
} from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  backendConnected: boolean;
  login: (email: string, password?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Map a Firebase user → local User shape
const mapFirebaseUser = (fbUser: FirebaseUser): User => ({
  id: fbUser.uid,
  name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Traveler',
  email: fbUser.email || '',
  avatar: fbUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(fbUser.displayName || 'T')}&background=6C63FF&color=fff`,
  role: 'user',
  travelPreferences: [],
  accessibilityPreferences: [],
  travelStyle: 'Peaceful',
  budgetPreference: 'Moderate',
  preferredEnvironment: 'Any',
  xp: 0,
  level: 1,
  createdAt: new Date().toISOString(),
});

// Map a backend server user → local User shape
const mapServerUser = (serverUser: any): User => ({
  id: serverUser._id || serverUser.id,
  name: serverUser.name,
  email: serverUser.email,
  avatar: serverUser.avatar,
  role: serverUser.role || 'user',
  travelPreferences: serverUser.travelPreferences || [],
  accessibilityPreferences: serverUser.accessibilityPreferences || [],
  travelStyle: serverUser.travelStyle || 'Peaceful',
  budgetPreference: serverUser.budgetPreference || 'Moderate',
  preferredEnvironment: serverUser.preferredEnvironment || 'Any',
  xp: serverUser.xp || 0,
  level: Math.floor((serverUser.xp || 0) / 500) + 1,
  createdAt: serverUser.createdAt || new Date().toISOString(),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [backendConnected, setBackendConnected] = useState<boolean>(false);

  // ── Firebase auth state listener ─────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onFirebaseAuthStateChanged(async (fbUser) => {
      if (fbUser) {
        // Persist to localStorage so offline reloads still show user
        const mapped = mapFirebaseUser(fbUser);
        setUser(mapped);
        localStorage.setItem('traveltwin_user', JSON.stringify(mapped));
      } else {
        // No Firebase session — try restoring from localStorage
        const saved = localStorage.getItem('traveltwin_user');
        if (saved) {
          try { setUser(JSON.parse(saved)); } catch { setUser(null); }
        } else {
          setUser(null);
        }
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  // ── Check backend health on mount ────────────────────────────────────────
  useEffect(() => {
    const checkBackend = async () => {
      const token = localStorage.getItem('traveltwin_token');
      if (token) {
        try {
          const data = await authApi.me();
          if (data.success && data.user) {
            setUser(prev => prev ? { ...prev, ...mapServerUser(data.user) } : mapServerUser(data.user));
            setBackendConnected(true);
            return;
          }
        } catch {
          localStorage.removeItem('traveltwin_token');
        }
      }
      try {
        const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/api\/?$/, '');
        const res = await fetch(`${baseUrl}/health`);
        if (res.ok) setBackendConnected(true);
      } catch {
        setBackendConnected(false);
      }
    };
    checkBackend();
  }, []);

  // ── Persist user to localStorage on change ───────────────────────────────
  useEffect(() => {
    if (user) {
      localStorage.setItem('traveltwin_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('traveltwin_user');
    }
  }, [user]);

  // ── Google Sign-In ───────────────────────────────────────────────────────
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      // Firebase auth state listener will pick this up automatically
      // Optionally sync with your backend here:
      // await authApi.syncFirebaseUser(result.user.uid, result.user.email, ...)
    } catch (err: any) {
      console.error('Google sign-in failed:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ── Email/password login (backend or demo fallback) ──────────────────────
  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      if (backendConnected && password) {
        const data = await authApi.login(email, password);
        if (data.success) {
          localStorage.setItem('traveltwin_token', data.token);
          setUser(mapServerUser(data.user));
          return;
        }
      }
      // Demo fallback
      setUser(prev => prev && prev.email === email ? prev : {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=6C63FF&color=fff`,
        role: 'user',
        travelPreferences: [],
        accessibilityPreferences: [],
        travelStyle: 'Peaceful',
        budgetPreference: 'Moderate',
        preferredEnvironment: 'Any',
        xp: 0,
        level: 1,
        createdAt: new Date().toISOString(),
      });
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 401) throw err;
      setUser({
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=6C63FF&color=fff`,
        role: 'user',
        travelPreferences: [],
        accessibilityPreferences: [],
        travelStyle: 'Peaceful',
        budgetPreference: 'Moderate',
        preferredEnvironment: 'Any',
        xp: 0,
        level: 1,
        createdAt: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Register ─────────────────────────────────────────────────────────────
  const register = async (name: string, email: string, password?: string) => {
    setIsLoading(true);
    try {
      if (backendConnected && password) {
        const data = await authApi.register(name, email, password);
        if (data.success) {
          localStorage.setItem('traveltwin_token', data.token);
          setUser(mapServerUser(data.user));
          return;
        }
      }
      setUser({
        id: `user-${Date.now()}`,
        name,
        email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6C63FF&color=fff`,
        role: 'user',
        travelPreferences: [],
        accessibilityPreferences: [],
        travelStyle: 'Peaceful',
        budgetPreference: 'Moderate',
        preferredEnvironment: 'Any',
        xp: 100,
        level: 1,
        createdAt: new Date().toISOString(),
      });
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 409) throw err;
      setUser({
        id: `user-${Date.now()}`,
        name,
        email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6C63FF&color=fff`,
        role: 'user',
        travelPreferences: [],
        accessibilityPreferences: [],
        travelStyle: 'Peaceful',
        budgetPreference: 'Moderate',
        preferredEnvironment: 'Any',
        xp: 100,
        level: 1,
        createdAt: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Update user ───────────────────────────────────────────────────────────
  const updateUser = async (data: Partial<User>) => {
    if (backendConnected && localStorage.getItem('traveltwin_token')) {
      try {
        const res = await authApi.updatePreferences(data);
        if (res.success) {
          setUser(prev => prev ? { ...prev, ...mapServerUser(res.user) } : null);
          return;
        }
      } catch {
        // fall through to local update
      }
    }
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      await firebaseSignOut();
    } catch {
      // ignore firebase signout errors
    }
    setUser(null);
    localStorage.removeItem('traveltwin_token');
    localStorage.removeItem('traveltwin_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        backendConnected,
        login,
        loginWithGoogle,
        register,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
