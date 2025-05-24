import { supabase } from '@/lib/supabase';
import { CivicAction, Verification, ActionImpact } from '@/lib/types';

export const actionService = {
  // Create a new civic action
  createAction: async (action: Omit<CivicAction, 'id' | 'created_at' | 'verification_status'>) => {
    // Note: user_id should already be included in the action parameter now
    
    const newAction = {
      ...action,
      verification_status: 'pending',
    };

    const { data, error } = await supabase
      .from('civic_actions')
      .insert(newAction)
      .select();

    if (error) {
      throw new Error(error.message);
    }
    return data[0] as CivicAction;
  },

  // Get all civic actions with pagination
  getActions: async (page = 1, limit = 10) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('civic_actions')
      .select('*, profiles(name, avatar_url)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      throw new Error(error.message);
    }
    return { data, count };
  },

  // Get user's civic actions
  getUserActions: async (userId: string) => {
    const { data, error } = await supabase
      .from('civic_actions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return data as CivicAction[];
  },

  // Get civic action details
  getActionById: async (actionId: string) => {
    const { data, error } = await supabase
      .from('civic_actions')
      .select('*, profiles(name, avatar_url, trust_score)')
      .eq('id', actionId)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data as CivicAction & { profiles: any };
  },

  // Add verification to an action
  addVerification: async (verification: Omit<Verification, 'id' | 'created_at'>) => {
    // Note: user_id should already be included in the verification parameter now

    const { data, error } = await supabase
      .from('verifications')
      .insert(verification)
      .select();

    if (error) {
      throw new Error(error.message);
    }
    return data[0] as Verification;
  },

  // Upload verification evidence (image)
  uploadVerificationImage: async (file: File, actionId: string) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User must be logged in to upload verification');
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload a JPEG, PNG, or GIF image.');
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        throw new Error('File size too large. Maximum size is 5MB.');
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const timestamp = new Date().getTime();
      const filePath = `${user.id}/${actionId}/${timestamp}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from('verifications')
        .upload(filePath, file, {
          upsert: false,
          cacheControl: '3600',
          contentType: file.type
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      const { data: urlData } = supabase.storage
        .from('verifications')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error in uploadVerificationImage:', error);
      throw error;
    }
  },

  // Get action categories
  getCategories: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  // Calculate and store impact for an action
  calculateImpact: async (actionId: string, actionType: string) => {
    // This is a simplified impact calculation - in a real app this would be more sophisticated
    const impactMap: Record<string, { type: string, score: number }[]> = {
      'sublet': [{ type: 'sustainability', score: 8 }, { type: 'urban_density', score: 9 }],
      'mutual-aid': [{ type: 'mutual_aid', score: 10 }],
      'childcare': [{ type: 'community_building', score: 8 }, { type: 'mutual_aid', score: 7 }],
      'food-sharing': [{ type: 'sustainability', score: 7 }, { type: 'mutual_aid', score: 8 }],
      'vacant-use': [{ type: 'urban_density', score: 10 }, { type: 'sustainability', score: 6 }],
      'community-event': [{ type: 'community_building', score: 9 }],
    };

    const impacts = impactMap[actionType] || [{ type: 'community_building', score: 5 }];

    // Insert impacts
    for (const impact of impacts) {
      await supabase.from('action_impacts').insert({
        action_id: actionId,
        impact_type: impact.type,
        impact_score: impact.score
      });
    }

    // Also update the user's trust score
    const { data: actionData } = await supabase
      .from('civic_actions')
      .select('user_id')
      .eq('id', actionId)
      .single();

    if (actionData?.user_id) {
      const totalImpact = impacts.reduce((sum, impact) => sum + impact.score, 0);
      await supabase.rpc('increment_trust_score', { 
        user_id: actionData.user_id, 
        increment_amount: totalImpact / impacts.length 
      });
    }
  },

  // Get impact data aggregated by type
  getImpactByType: async () => {
    const { data, error } = await supabase
      .from('action_impacts')
      .select('impact_type, impact_score')
      .order('impact_type');

    if (error) {
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

    return aggregated;
  }
};
