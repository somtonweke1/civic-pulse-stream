import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { actionService } from '@/services/actionService';
import { CivicAction, Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { actionFormSchema } from "@/lib/schemas";
import { z } from "zod";

type ActionFormValues = z.infer<typeof actionFormSchema>;

const ActionForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [verificationImage, setVerificationImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ActionFormValues>({
    resolver: zodResolver(actionFormSchema),
    defaultValues: {
      title: "",
      details: "",
      location: "",
      action_type: "sublet",
      category_id: undefined,
    },
  });

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await actionService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories:', error);
        toast.error('Failed to load categories. Please try again.');
      }
    };
    loadCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValue(name, value);
  };

  const handleSelectChange = (name: string, value: string) => {
    setValue(name, name === 'category_id' ? (value ? parseInt(value) : undefined) : value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setVerificationImage(file);
  };

  const onSubmit = async (data: ActionFormValues) => {
    setLoading(true);
    setError(null);

    try {
      if (!user?.id) throw new Error("You must be logged in to create an action");

      // Convert category_id to number if it exists
      const formData = {
        ...data,
        category_id: data.category_id ? Number(data.category_id) : null,
      };

      console.log('Creating action with data:', { ...formData, user_id: user.id });

      // Create the action
      const action = await actionService.createAction({
        ...formData,
        user_id: user.id,
      });

      if (!action) {
        throw new Error('Failed to create action');
      }

      console.log('Action created successfully:', action);

      // Upload verification image if provided
      if (verificationImage) {
        try {
          const imageUrl = await actionService.uploadVerificationImage(verificationImage, action.id);
          console.log('Verification image uploaded:', imageUrl);
          
          // Update action with verification URL
          await actionService.updateAction(action.id, {
            verification_url: imageUrl,
            verification_method: 'photo'
          });
        } catch (error) {
          console.error('Error uploading verification image:', error);
          // Don't throw here, just log the error
        }
      }

      // Calculate impact
      try {
        await actionService.calculateImpact(action.id, action.action_type);
      } catch (error) {
        console.error('Error calculating impact:', error);
        // Don't throw here, just log the error
      }

      // Show success message
      toast.success('Your action has been created successfully.');

      // Reset form
      reset();
      setVerificationImage(null);

      // Navigate to actions page
      navigate('/actions');
    } catch (error: any) {
      console.error('Error creating action:', error);
      setError(error.message || 'Failed to create action');
      toast.error(error.message || 'Failed to create action');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-6">
      {error && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
          {error}
          </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title *
            </label>
            <Input 
              id="title" 
          {...register("title")}
          onChange={handleInputChange}
              required
          className="mt-1"
          placeholder="What did you do?"
          disabled={loading}
            />
        {errors.title && <div className="text-destructive">{errors.title.message}</div>}
          </div>

      <div>
        <label htmlFor="details" className="block text-sm font-medium text-gray-700">
          Details *
            </label>
            <Textarea 
              id="details" 
          {...register("details")}
          onChange={handleInputChange}
              required
          className="mt-1"
          placeholder="Tell us more about your action..."
          rows={4}
          disabled={loading}
            />
        {errors.details && <div className="text-destructive">{errors.details.message}</div>}
          </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <Input 
              id="location" 
          {...register("location")}
          onChange={handleInputChange}
          className="mt-1"
          placeholder="Where did this happen?"
          disabled={loading}
        />
        {errors.location && <div className="text-destructive">{errors.location.message}</div>}
          </div>

      <div>
        <label htmlFor="action_type" className="block text-sm font-medium text-gray-700">
          Action Type *
        </label>
        <Select
          {...register("action_type")}
          onValueChange={(value) => handleSelectChange('action_type', value)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an action type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sublet">Sublet</SelectItem>
            <SelectItem value="mutual-aid">Mutual Aid</SelectItem>
            <SelectItem value="childcare">Childcare</SelectItem>
            <SelectItem value="food-sharing">Food Sharing</SelectItem>
            <SelectItem value="vacant-use">Vacant Space Use</SelectItem>
            <SelectItem value="community-event">Community Event</SelectItem>
          </SelectContent>
        </Select>
        {errors.action_type && <div className="text-destructive">{errors.action_type.message}</div>}
                </div>

      <div>
        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <Select
          {...register("category_id")}
          onValueChange={(value) => handleSelectChange('category_id', value)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category_id && <div className="text-destructive">{errors.category_id.message}</div>}
                  </div>

      <div>
        <label htmlFor="verification" className="block text-sm font-medium text-gray-700">
          Verification Image
        </label>
        <Input
          id="verification"
                        type="file"
          accept="image/*"
                        onChange={handleFileChange}
          className="mt-1"
          disabled={loading}
                      />
        <p className="mt-1 text-sm text-gray-500">
          Upload an image to verify your action (max 5MB)
        </p>
                  </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Logging Action...' : 'Log Action'}
          </Button>
      </form>
  );
};

export default ActionForm;
