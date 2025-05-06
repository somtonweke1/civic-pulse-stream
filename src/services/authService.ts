
import { supabase } from '@/lib/supabase';
import { User } from '@/lib/types';

export const authService = {
  // Get current session
  getCurrentSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        throw new Error(error.message);
      }
      return data;
    } catch (error: any) {
      console.error('Session error caught:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error getting user:', error);
        throw new Error(error.message);
      }
      return data.user;
    } catch (error: any) {
      console.error('Current user error caught:', error);
      throw error;
    }
  },

  // Sign up with email and password
  signUp: async (email: string, password: string, name: string) => {
    try {
      console.log('Attempting to sign up user:', { email, name });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          }
        }
      });

      if (error) {
        console.error('Supabase signup error:', error);
        throw new Error(error.message);
      }

      console.log('Sign up successful, creating profile...');
      
      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name,
            email,
            trust_score: 0,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw new Error(profileError.message);
        }
        
        console.log('User profile created successfully');
      }

      return data;
    } catch (error: any) {
      console.error('Sign up error caught:', error);
      throw error;
    }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in user:', { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase auth error:', error);
        throw new Error(error.message);
      }
      
      console.log('Sign in successful:', data);
      return data;
    } catch (error: any) {
      console.error('Sign in error caught:', error);
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw new Error(error.message);
      }
    } catch (error: any) {
      console.error('Sign out error caught:', error);
      throw error;
    }
  },

  // Get user profile
  getUserProfile: async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return data as User;
    } catch (error: any) {
      console.error('Get profile error caught:', error);
      return null;
    }
  },

  // Update user profile
  updateUserProfile: async (userId: string, updates: Partial<User>) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select();

      if (error) {
        console.error('Update profile error:', error);
        throw new Error(error.message);
      }
      return data;
    } catch (error: any) {
      console.error('Update profile error caught:', error);
      throw error;
    }
  }
};
