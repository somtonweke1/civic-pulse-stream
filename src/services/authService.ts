import { supabase } from '@/lib/supabase';
import { User } from '@/lib/types';

export const authService = {
  // Get current session
  getCurrentSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        throw new Error(`Session error: ${error.message}`);
      }
      return data;
    } catch (error: any) {
      console.error('Session error caught:', error);
      throw new Error(`Failed to get session: ${error.message}`);
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error getting user:', error);
        throw new Error(`User error: ${error.message}`);
      }
      return data.user;
    } catch (error: any) {
      console.error('Current user error caught:', error);
      throw new Error(`Failed to get user: ${error.message}`);
    }
  },

  // Sign up with email and password
  signUp: async (email: string, password: string, name: string) => {
    try {
      console.log('Attempting to sign up user:', { email, name });
      
      // Validate input
      if (!email || !password || !name) {
        throw new Error('Email, password, and name are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('Supabase signup error:', error);
        throw new Error(`Signup failed: ${error.message}`);
      }

      if (!data.user) {
        throw new Error('No user data returned from signup');
      }

      console.log('Sign up successful, creating profile...');
      
      // Create user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          name,
          email,
          trust_score: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Attempt to delete the user if profile creation fails
        await supabase.auth.admin.deleteUser(data.user.id);
        throw new Error(`Profile creation failed: ${profileError.message}`);
      }
      
      console.log('User profile created successfully');
      return data;
    } catch (error: any) {
      console.error('Sign up error caught:', error);
      throw new Error(`Signup failed: ${error.message}`);
    }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in user:', { email });
      
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase auth error:', error);
        throw new Error(`Sign in failed: ${error.message}`);
      }

      if (!data.user) {
        throw new Error('No user data returned from sign in');
      }
      
      // Get user profile
      const profile = await authService.getUserProfile(data.user.id);
      if (!profile) {
        throw new Error('User profile not found');
      }
      
      console.log('Sign in successful:', data);
      return { ...data, profile };
    } catch (error: any) {
      console.error('Sign in error caught:', error);
      throw new Error(`Sign in failed: ${error.message}`);
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw new Error(`Sign out failed: ${error.message}`);
      }
      // Clear any local storage items
      localStorage.removeItem('substance.auth.token');
    } catch (error: any) {
      console.error('Sign out error caught:', error);
      throw new Error(`Sign out failed: ${error.message}`);
    }
  },

  // Get user profile
  getUserProfile: async (userId: string): Promise<User | null> => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw new Error(`Failed to fetch profile: ${error.message}`);
      }

      return data as User;
    } catch (error: any) {
      console.error('Get profile error caught:', error);
      throw new Error(`Failed to get profile: ${error.message}`);
    }
  },

  // Update user profile
  updateUserProfile: async (userId: string, updates: Partial<User>) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select();

      if (error) {
        console.error('Update profile error:', error);
        throw new Error(`Failed to update profile: ${error.message}`);
      }

      return data;
    } catch (error: any) {
      console.error('Update profile error caught:', error);
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }
};
