
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { ArrowRight, Upload } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { actionService } from '@/services/actionService';

const ActionForm = () => {
  const [actionType, setActionType] = useState('');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string>('');
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const cats = await actionService.getCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to log an action');
      navigate('/sign-in');
      return;
    }
    
    if (!actionType) {
      toast.error('Please select an action type');
      return;
    }

    setLoading(true);
    
    try {
      // Create the civic action
      const newAction = await actionService.createAction({
        title,
        details,
        location,
        action_type: actionType,
      });

      // If there's a verification file, upload it
      if (uploadedFile && newAction.id) {
        const verificationUrl = await actionService.uploadVerificationImage(
          uploadedFile, 
          newAction.id
        );

        // Add verification record
        await actionService.addVerification({
          action_id: newAction.id,
          method: 'photo',
          status: 'pending',
          evidence_url: verificationUrl
        });
      }

      // Calculate impact
      if (newAction.id) {
        await actionService.calculateImpact(newAction.id, actionType);
      }

      toast.success('Action logged successfully', {
        description: 'Your civic action has been recorded and will contribute to your community impact score.',
        position: 'bottom-right',
      });

      // Reset form
      setActionType('');
      setTitle('');
      setDetails('');
      setLocation('');
      setUploadedFile(null);
      setUploadPreview('');

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting action:', error);
      toast.error('Failed to submit action. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Log Your Action</CardTitle>
          <CardDescription>
            Sign in to record your civic action and build community impact.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="mb-6">You need to sign in to log actions and contribute to your community.</p>
          <Button asChild>
            <a href="/sign-in">Sign In <ArrowRight size={16} className="ml-2" /></a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Log Your Action</CardTitle>
        <CardDescription>
          Record a civic action you've taken to help quantify community impact.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="action-type">
              Action Type
            </label>
            <Select value={actionType} onValueChange={setActionType}>
              <SelectTrigger id="action-type">
                <SelectValue placeholder="Select action type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sublet">Housing - Room Subletting</SelectItem>
                <SelectItem value="mutual-aid">Mutual Aid</SelectItem>
                <SelectItem value="childcare">Pop-up Childcare</SelectItem>
                <SelectItem value="food-sharing">Food Sharing</SelectItem>
                <SelectItem value="vacant-use">Vacant Space Utilization</SelectItem>
                <SelectItem value="community-event">Community Event</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="title">
              Title
            </label>
            <Input 
              id="title" 
              placeholder="Brief description of your action"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="details">
              Details
            </label>
            <Textarea 
              id="details" 
              placeholder="Provide more details about what you did..."
              className="min-h-[100px]"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="location">
              Location
            </label>
            <Input 
              id="location" 
              placeholder="ZIP code or neighborhood"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Verification</label>
            <div className="flex items-center justify-center border-2 border-dashed border-border rounded-md p-6 relative">
              {uploadPreview ? (
                <div className="space-y-2 text-center">
                  <img src={uploadPreview} alt="Verification" className="max-h-40 mx-auto" />
                  <p className="text-xs text-muted-foreground">
                    {uploadedFile?.name}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setUploadedFile(null);
                      setUploadPreview('');
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 text-center">
                  <div className="mx-auto h-10 w-10 text-muted-foreground flex items-center justify-center rounded-full bg-muted">
                    <Upload size={20} />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer text-primary underline-offset-4 hover:underline"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </label>{" "}
                    to verify your action (photo, receipt, etc.)
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" disabled={loading} type="submit">
            {loading ? 'Submitting...' : 'Log Action'} {!loading && <ArrowRight size={16} className="ml-2" />}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ActionForm;
