
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { User } from '@/lib/types';
import { actionService } from '@/services/actionService';
import { CivicAction } from '@/lib/types';
import { ArrowRight, Save, UserCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const Profile = () => {
  const { user, updateProfile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userActions, setUserActions] = useState<CivicAction[]>([]);
  const [loadingActions, setLoadingActions] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    bio: '',
    avatar_url: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        avatar_url: user.avatar_url || '',
      });

      // Fetch user's civic actions
      const fetchUserActions = async () => {
        setLoadingActions(true);
        try {
          const actions = await actionService.getUserActions(user.id);
          setUserActions(actions);
        } catch (error) {
          console.error('Error fetching user actions:', error);
          toast.error('Failed to load your actions');
        } finally {
          setLoadingActions(false);
        }
      };

      fetchUserActions();
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(formData);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Not Logged In</CardTitle>
            <CardDescription>You need to sign in to view your profile</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <a href="/sign-in">Sign In</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container py-8 flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center mb-4">
                {user.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt={user.name} 
                    className="w-24 h-24 rounded-full object-cover mb-2" 
                  />
                ) : (
                  <UserCircle className="w-24 h-24 text-muted-foreground" />
                )}
                <CardTitle className="text-xl mt-4">{user.name}</CardTitle>
              </div>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="px-3 py-1 bg-civic-green/10 text-civic-green rounded-full text-xs font-medium">
                  {user.trust_score ? `Trust Score: ${Math.round(user.trust_score)}` : 'New Member'}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {!editMode ? (
                <>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                      <p>{user.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Bio</h3>
                      <p>{user.bio || 'No bio yet'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Member Since</h3>
                      <p>{new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                    
                    {user.trust_score && (
                      <div className="pt-4">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Trust Level Progress</h3>
                        <Progress value={Math.min((user.trust_score / 100) * 100, 100)} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {user.trust_score < 25 ? 'New Member' :
                           user.trust_score < 50 ? 'Active Contributor' :
                           user.trust_score < 75 ? 'Trusted Member' : 'Community Leader'}
                        </p>
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-6"
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </Button>
                </>
              ) : (
                <form onSubmit={handleSaveProfile}>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium" htmlFor="name">Name</label>
                      <Input 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium" htmlFor="avatar_url">Profile Image URL</label>
                      <Input 
                        id="avatar_url"
                        name="avatar_url"
                        value={formData.avatar_url}
                        onChange={handleChange}
                        placeholder="https://example.com/your-image.jpg"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium" htmlFor="bio">Bio</label>
                      <Textarea 
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex gap-4">
                    <Button 
                      variant="outline" 
                      type="button" 
                      onClick={() => setEditMode(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="flex-1"
                    >
                      {loading ? 'Saving...' : 'Save'} 
                      {!loading && <Save size={16} className="ml-2" />}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="md:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>My Actions</CardTitle>
              <CardDescription>
                A record of your civic contributions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingActions ? (
                <div className="text-center py-8">Loading your actions...</div>
              ) : userActions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="mb-4">You haven't logged any civic actions yet.</p>
                  <Button asChild>
                    <a href="/actions">Log Your First Action <ArrowRight size={16} className="ml-2" /></a>
                  </Button>
                </div>
              ) : (
                <div className="divide-y">
                  {userActions.map((action) => (
                    <div key={action.id} className="py-4">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{action.title}</h3>
                        <span className="text-xs bg-muted px-2 py-1 rounded-full">
                          {action.action_type.replace('-', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{action.details}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">{new Date(action.created_at).toLocaleDateString()}</span>
                        <span className="text-xs bg-muted px-2 py-1 rounded-full">
                          {action.verification_status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
