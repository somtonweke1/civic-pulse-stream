import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Suggestion {
  title: string;
  description: string;
  impact: string;
  category: string;
}

const ActionSuggestions = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const generateSuggestions = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      // Simulate AI response - replace with actual AI integration
      const mockSuggestions: Suggestion[] = [
        {
          title: 'Community Garden Initiative',
          description: 'Start or join a community garden project in your neighborhood.',
          impact: 'Environmental sustainability and community building',
          category: 'Environmental'
        },
        {
          title: 'Local Food Drive',
          description: 'Organize a food collection drive for local food banks.',
          impact: 'Food security and community support',
          category: 'Social Services'
        },
        {
          title: 'Digital Literacy Workshop',
          description: 'Teach basic computer skills to community members.',
          impact: 'Education and digital inclusion',
          category: 'Education'
        }
      ];
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuggestions(mockSuggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-civic-green" />
          <CardTitle>AI Action Suggestions</CardTitle>
        </div>
        <CardDescription>
          Get personalized suggestions for civic actions based on your interests and community needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="What are you interested in? (e.g., environment, education, community)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generateSuggestions()}
          />
          <Button 
            onClick={generateSuggestions}
            disabled={loading || !query.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Thinking...
              </>
            ) : (
              'Suggest'
            )}
          </Button>
        </div>

        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg hover:border-civic-green transition-colors"
                >
                  <h3 className="font-medium text-lg mb-1">{suggestion.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{suggestion.description}</p>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-civic-green/10 text-civic-green rounded-full">
                      {suggestion.category}
                    </span>
                    <span className="px-2 py-1 bg-civic-purple/10 text-civic-purple rounded-full">
                      {suggestion.impact}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default ActionSuggestions; 