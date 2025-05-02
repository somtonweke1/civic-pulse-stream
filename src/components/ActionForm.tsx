
import { useState } from 'react';
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

const ActionForm = () => {
  const [actionType, setActionType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      toast.success('Action logged successfully', {
        description: 'Your civic action has been recorded and will contribute to your community impact score.',
        position: 'bottom-right',
      });
    }, 1500);
  };

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
            <Input id="title" placeholder="Brief description of your action" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="details">
              Details
            </label>
            <Textarea 
              id="details" 
              placeholder="Provide more details about what you did..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="location">
              Location
            </label>
            <Input id="location" placeholder="ZIP code or neighborhood" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Verification</label>
            <div className="flex items-center justify-center border-2 border-dashed border-border rounded-md p-6">
              <div className="space-y-2 text-center">
                <div className="mx-auto h-10 w-10 text-muted-foreground flex items-center justify-center rounded-full bg-muted">
                  <Upload size={20} />
                </div>
                <div className="text-xs text-muted-foreground">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer text-primary underline"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                    />
                  </label>{" "}
                  to verify your action (photo, receipt, etc.)
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" disabled={loading}>
            {loading ? 'Submitting...' : 'Log Action'} {!loading && <ArrowRight size={16} className="ml-2" />}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ActionForm;
