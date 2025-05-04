
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/lib/types';
import { authService } from '@/services/authService';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      setLoading(true);
      try {
        // Get session
        const { session } = await authService.getCurrentSession();
        setSession(session);

        // Get user profile if session exists
        if (session?.user) {
          const profile = await authService.getUserProfile(session.user.id);
          setUser(profile);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (event === 'SIGNED_IN' && session) {
          const profile = await authService.getUserProfile(session.user.id);
          setUser(profile);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { session } = await authService.signIn(email, password);
      setSession(session);
      
      if (session?.user) {
        const profile = await authService.getUserProfile(session.user.id);
        setUser(profile);
      }
      
      toast.success('Signed in successfully');
    } catch (error: any) {
      toast.error('Sign in failed: ' + error.message);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      await authService.signUp(email, password, name);
      toast.success('Account created successfully! Please check your email to confirm your signup.');
    } catch (error: any) {
      toast.error('Sign up failed: ' + error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setSession(null);
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error('Sign out failed: ' + error.message);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!user?.id) throw new Error('User not authenticated');
      await authService.updateUserProfile(user.id, updates);
      setUser({ ...user, ...updates });
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error('Profile update failed: ' + error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
