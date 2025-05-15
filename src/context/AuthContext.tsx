import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/lib/types';
import { authService } from '@/services/authService';
import { toast } from 'sonner';

// Define the context type
interface AuthContextType {
  user: User | null;
  session: any | null;
  loading: boolean;
  signIn: (data: { email: string; password: string }) => Promise<any>;
  signUp: (data: { email: string; password: string; name: string }) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
});

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Create the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth state...');
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          console.log('Found existing session, fetching user profile...');
          const profile = await authService.getUserProfile(currentSession.user.id);
          setSession(currentSession);
          setUser(profile);
        } else {
          console.log('No existing session found');
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Error initializing auth state:', error);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession ? 'Session exists' : 'No session');
        
        if (event === 'SIGNED_IN' && currentSession) {
          try {
            console.log('User signed in, fetching profile...');
            const profile = await authService.getUserProfile(currentSession.user.id);
            setUser(profile);
            setSession(currentSession);
          } catch (error) {
            console.error('Error handling sign in:', error);
            setUser(null);
            setSession(null);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing state...');
          setUser(null);
          setSession(null);
        }
      }
    );

    return () => {
      console.log('Cleaning up auth listener...');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (data: { email: string; password: string }) => {
    try {
      console.log('Starting sign in process in AuthContext...');
      setLoading(true);
      
      const result = await authService.signIn(data);
      
      if (!result.session || !result.user) {
        console.error('Invalid sign in result:', result);
        throw new Error('Invalid sign in result');
      }
      
      console.log('Sign in successful, updating state...');
      setSession(result.session);
      setUser(result.user);
      
      return result;
    } catch (error: any) {
      console.error('Sign in error in AuthContext:', error);
      setUser(null);
      setSession(null);
      toast.error(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: { email: string; password: string; name: string }) => {
    try {
      setLoading(true);
      await authService.signUp(data);
      toast.success('Account created successfully! Please check your email to verify your account.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await authService.signOut();
      setUser(null);
      setSession(null);
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      setLoading(true);
      if (!user) throw new Error('No user logged in');
      const updatedProfile = await authService.updateUserProfile(user.id, updates);
      setUser(updatedProfile);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
