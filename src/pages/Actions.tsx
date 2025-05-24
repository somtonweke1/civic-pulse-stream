import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ActionForm from '@/components/ActionForm';
import ActionSuggestions from '@/components/ActionSuggestions';
import ImpactAnalytics from '@/components/ImpactAnalytics';
import ImpactReport from '@/components/ImpactReport';
import { motion } from 'framer-motion';

const Actions = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/sign-in', { state: { from: '/actions' } });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow container py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto space-y-8"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-civic-green" />
                    <CardTitle className="text-2xl font-bold">Log Your Impact</CardTitle>
                  </div>
                  <CardDescription>
                    Every action counts. Share your civic engagement and inspire others to make a difference.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ActionForm />
                </CardContent>
              </Card>

              <ActionSuggestions />
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Need Ideas?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Not sure what to log? Here are some suggestions:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Attended a community meeting</li>
                    <li>• Volunteered at a local event</li>
                    <li>• Participated in a peaceful protest</li>
                    <li>• Contacted your representatives</li>
                  </ul>
                  <Button variant="link" className="mt-4 p-0">
                    Get more ideas <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            <ImpactAnalytics />
            <ImpactReport />
          </motion.div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Actions;
