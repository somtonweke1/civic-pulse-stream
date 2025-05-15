import { supabase } from '../lib/supabase';
import { AuthError } from '@supabase/supabase-js';
import { User } from '@/lib/types';

interface SignUpData {
  email: string;
  password: string;
  name: string;
}

interface SignInData {
  email: string;
  password: string;
}

export const authService = {
  // Get current session
  getCurrentSession: async () => {
    try {
      console.log('Getting current session...');
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        throw new Error(`Session error: ${error.message}`);
      }
      console.log('Session retrieved successfully');
      return data;
    } catch (error: any) {
      console.error('Session error caught:', error);
      throw new Error(`Failed to get session: ${error.message}`);
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      console.log('Getting current user...');
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Get user error:', error);
        throw error;
      }

      if (!user) {
        console.log('No user found');
        return null;
      }

      console.log('Current user:', user.id);
      return user;
    } catch (error) {
      console.error('Get current user failed:', error);
      if (error instanceof AuthError) {
        throw new Error(error.message);
      }
      throw error;
    }
  },

  // Sign up with email and password
  async signUp({ email, password, name }: SignUpData) {
    try {
      console.log('Starting signup process...', { email, name });
      
      // Validate input
      if (!email || !password || !name) {
        console.error('Missing required fields');
        throw new Error('Email, password, and name are required');
      }

      if (password.length < 6) {
        console.error('Password too short');
        throw new Error('Password must be at least 6 characters');
      }

      // Sign up the user
      console.log('Signing up user...');
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        throw signUpError;
      }

      if (!authData.user) {
        console.error('No user data returned');
        throw new Error('Failed to create user');
      }

      console.log('User created successfully:', authData.user.id);
      return authData;
    } catch (error) {
      console.error('Signup failed:', error);
      if (error instanceof AuthError) {
        throw new Error(error.message);
      }
      throw error;
    }
  },

  // Sign in with email and password
  async signIn({ email, password }: SignInData) {
    try {
      console.log('Starting sign in process...', { email });
      
      // Validate input
      if (!email || !password) {
        console.error('Missing required fields');
        throw new Error('Email and password are required');
      }

      // Sign in the user
      console.log('Attempting to sign in with Supabase...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase sign in error:', error);
        throw error;
      }

      if (!data?.session) {
        console.error('No session returned from sign in');
        throw new Error('No session created');
      }

      if (!data?.user) {
        console.error('No user data returned from sign in');
        throw new Error('No user data returned');
      }

      console.log('Sign in successful, fetching user profile...');
      
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        // Create a basic profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name: data.user.user_metadata?.name || 'User',
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating user profile:', createError);
          // Don't throw here, just use the auth user data
          return {
            session: data.session,
            user: data.user
          };
        }

        return {
          session: data.session,
          user: newProfile
        };
      }

      console.log('User profile fetched successfully');
      return {
        session: data.session,
        user: profile
      };
    } catch (error) {
      console.error('Sign in failed:', error);
      if (error instanceof AuthError) {
        throw new Error(error.message);
      }
      throw error;
    }
  },

  // Sign out
  async signOut() {
    try {
      console.log('Starting sign out process...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Sign out failed:', error);
      if (error instanceof AuthError) {
        throw new Error(error.message);
      }
      throw error;
    }
  },

  // Get user profile
  getUserProfile: async (userId: string): Promise<User | null> => {
    try {
      console.log('Getting user profile...', { userId });
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Get profile error:', error);
        throw error;
      }

      console.log('Profile retrieved successfully');
      return data as User;
    } catch (error) {
      console.error('Get user profile failed:', error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (userId: string, updates: Partial<{ name: string; trust_score: number }>) => {
    try {
      console.log('Updating user profile...', { userId, updates });
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Update profile error:', error);
        throw error;
      }

      console.log('Profile updated successfully');
      return data;
    } catch (error) {
      console.error('Update user profile failed:', error);
      throw error;
    }
  }
};
