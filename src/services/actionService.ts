import { supabase } from '@/lib/supabase';
import { CivicAction, Verification, ActionImpact, Category } from '@/lib/types';

class ActionService {
  // Create a new civic action
  async createAction(action: Omit<CivicAction, 'id' | 'created_at' | 'verification_status'>): Promise<CivicAction> {
    try {
      console.log('Creating action:', action);

      // Ensure category_id is a number or null
      const actionData = {
        ...action,
        category_id: action.category_id ? Number(action.category_id) : null,
        verification_status: 'pending'
      };

      const { data, error } = await supabase
        .from('civic_actions')
        .insert([actionData])
        .select()
        .single();

      if (error) {
        console.error('Error creating action:', error);
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('No data returned after creating action');
      }

      console.log('Action created successfully:', data);
      return data;
    } catch (error: any) {
      console.error('Error in createAction:', error);
      throw new Error(error.message || 'Failed to create action');
    }
  }

  // Get all civic actions with pagination
  async getActions(): Promise<CivicAction[]> {
    try {
      console.log('Fetching actions...');

      const { data, error } = await supabase
        .from('civic_actions')
        .select('*, profiles:user_id (name, avatar_url)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching actions:', error);
        throw new Error(error.message);
      }

      if (!data) {
        console.log('No actions found');
        return [];
      }

      console.log('Actions fetched successfully:', data);
      return data;
    } catch (error: any) {
      console.error('Error in getActions:', error);
      throw new Error(error.message || 'Failed to fetch actions');
    }
  }

  // Get user's civic actions
  async getUserActions(userId: string): Promise<CivicAction[]> {
    try {
      console.log('Fetching user actions:', userId);
      
      const { data, error } = await supabase
        .from('civic_actions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user actions:', error);
        throw new Error(error.message);
      }

      console.log('User actions fetched successfully:', data.length);
      return data as CivicAction[];
    } catch (error) {
      console.error('Failed to fetch user actions:', error);
      throw error;
    }
  }

  // Get civic action details
  async getActionById(id: string): Promise<CivicAction | null> {
    try {
      console.log('Fetching action by ID:', id);

      const { data, error } = await supabase
        .from('civic_actions')
        .select('*, profiles:user_id (name, avatar_url)')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching action:', error);
        throw new Error(error.message);
      }

      if (!data) {
        console.log('Action not found');
        return null;
      }

      console.log('Action fetched successfully:', data);
      return data;
    } catch (error: any) {
      console.error('Error in getActionById:', error);
      throw new Error(error.message || 'Failed to fetch action');
    }
  }

  // Add verification to an action
  async addVerification(verification: Omit<Verification, 'id' | 'created_at'>): Promise<Verification> {
    try {
      console.log('Adding verification:', verification);
      
      const { data, error } = await supabase
        .from('verifications')
        .insert(verification)
        .select()
        .single();

      if (error) {
        console.error('Error adding verification:', error);
        throw new Error(error.message);
      }

      console.log('Verification added successfully');
      return data as Verification;
    } catch (error) {
      console.error('Failed to add verification:', error);
      throw error;
    }
  }

  // Upload verification evidence (image)
  async uploadVerificationImage(file: File, actionId: string): Promise<string> {
    try {
      console.log('Uploading verification image for action:', actionId);

      const fileExt = file.name.split('.').pop();
      const fileName = `${actionId}-${Date.now()}.${fileExt}`;
      const filePath = `verifications/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('verifications')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw new Error(uploadError.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('verifications')
        .getPublicUrl(filePath);

      console.log('Image uploaded successfully:', publicUrl);
      return publicUrl;
    } catch (error: any) {
      console.error('Error in uploadVerificationImage:', error);
      throw new Error(error.message || 'Failed to upload verification image');
    }
  }

  // Get action categories
  async getCategories(): Promise<Category[]> {
    try {
      console.log('Fetching categories...');

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        throw new Error(error.message);
      }

      if (!data) {
        console.log('No categories found');
        return [];
      }

      console.log('Categories fetched successfully:', data);
      return data;
    } catch (error: any) {
      console.error('Error in getCategories:', error);
      throw new Error(error.message || 'Failed to fetch categories');
    }
  }

  // Calculate impact for an action
  async calculateImpact(actionId: string, actionType: string): Promise<void> {
    try {
      console.log('Calculating impact for action:', { actionId, actionType });

      // This is a placeholder for impact calculation logic
      // In a real implementation, this would calculate various metrics
      // based on the action type and other factors
      console.log('Impact calculation completed');
    } catch (error: any) {
      console.error('Error in calculateImpact:', error);
      throw new Error(error.message || 'Failed to calculate impact');
    }
  }

  // Get impact data aggregated by type
  async getImpactByType(): Promise<Record<string, number>> {
    try {
      console.log('Fetching impact data by type');
      
      const { data, error } = await supabase
        .from('action_impacts')
        .select('impact_type, impact_score')
        .order('impact_type');

      if (error) {
        console.error('Error fetching impact data:', error);
        throw new Error(error.message);
      }

      // Aggregate the data
      const aggregated = data.reduce((acc: Record<string, number>, item) => {
        if (!acc[item.impact_type]) {
          acc[item.impact_type] = 0;
        }
        acc[item.impact_type] += item.impact_score;
        return acc;
      }, {});

      console.log('Impact data aggregated successfully');
      return aggregated;
    } catch (error) {
      console.error('Failed to get impact data:', error);
      throw error;
    }
  }

  // Update an action
  async updateAction(id: string, updates: Partial<CivicAction>): Promise<CivicAction> {
    try {
      console.log('Updating action:', { id, updates });

      const { data, error } = await supabase
        .from('civic_actions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating action:', error);
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('No data returned after updating action');
      }

      console.log('Action updated successfully:', data);
      return data;
    } catch (error: any) {
      console.error('Error in updateAction:', error);
      throw new Error(error.message || 'Failed to update action');
    }
  }

  // Delete an action
  async deleteAction(id: string): Promise<void> {
    try {
      console.log('Deleting action:', id);

      const { error } = await supabase
        .from('civic_actions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting action:', error);
        throw new Error(error.message);
      }

      console.log('Action deleted successfully');
    } catch (error: any) {
      console.error('Error in deleteAction:', error);
      throw new Error(error.message || 'Failed to delete action');
    }
  }
}

export const actionService = new ActionService();
