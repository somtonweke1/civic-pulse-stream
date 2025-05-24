import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { BarChart, LineChart, PieChart, TrendingUp, Users, Target, Leaf } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ImpactMetric {
  category: string;
  value: number;
  target: number;
  unit: string;
  description: string;
  policyImplications: string[];
}

interface ActionTrend {
  date: string;
  count: number;
  impact: number;
}

const ImpactAnalytics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<ImpactMetric[]>([]);
  const [trends, setTrends] = useState<ActionTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching impact data
    const fetchImpactData = async () => {
      setLoading(true);
      try {
        // Mock data - replace with actual API calls
        const mockMetrics: ImpactMetric[] = [
          {
            category: 'Environmental Impact',
            value: 450,
            target: 1000,
            unit: 'kg CO2 saved',
            description: 'Carbon footprint reduction through recycling and sustainable practices',
            policyImplications: [
              'Contributes to local climate action plan goals',
              'Supports regional waste reduction targets',
              'Aligns with national sustainability initiatives'
            ]
          },
          {
            category: 'Community Engagement',
            value: 25,
            target: 50,
            unit: 'hours',
            description: 'Time spent on community service and civic activities',
            policyImplications: [
              'Strengthens social cohesion metrics',
              'Supports community resilience indicators',
              'Contributes to social capital development'
            ]
          },
          {
            category: 'Educational Impact',
            value: 15,
            target: 30,
            unit: 'workshops',
            description: 'Knowledge sharing and skill development sessions',
            policyImplications: [
              'Advances educational equity goals',
              'Supports workforce development initiatives',
              'Contributes to lifelong learning metrics'
            ]
          }
        ];

        const mockTrends: ActionTrend[] = [
          { date: '2024-01', count: 5, impact: 50 },
          { date: '2024-02', count: 8, impact: 85 },
          { date: '2024-03', count: 12, impact: 120 },
          { date: '2024-04', count: 15, impact: 150 }
        ];

        setMetrics(mockMetrics);
        setTrends(mockTrends);
      } catch (error) {
        console.error('Error fetching impact data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImpactData();
  }, []);

  const calculateProgress = (value: number, target: number) => {
    return (value / target) * 100;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Impact Analytics</CardTitle>
            <CardDescription>
              Quantifying your civic impact and its broader implications
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-accent rounded-lg">
              <BarChart className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-accent rounded-lg">
              <LineChart className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-accent rounded-lg">
              <PieChart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="policy">Policy Impact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {metric.category === 'Environmental Impact' && <Leaf className="h-5 w-5 text-civic-green" />}
                    {metric.category === 'Community Engagement' && <Users className="h-5 w-5 text-civic-purple" />}
                    {metric.category === 'Educational Impact' && <Target className="h-5 w-5 text-civic-orange" />}
                    <h3 className="font-medium">{metric.category}</h3>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {metric.value} / {metric.target} {metric.unit}
                  </span>
                </div>
                <Progress value={calculateProgress(metric.value, metric.target)} className="h-2" />
                <p className="text-sm text-muted-foreground">{metric.description}</p>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <div className="h-[300px] flex items-center justify-center border rounded-lg">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Trend visualization coming soon</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {trends.map((trend, index) => (
                <motion.div
                  key={trend.date}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg"
                >
                  <h4 className="font-medium mb-2">{trend.date}</h4>
                  <div className="space-y-1">
                    <p className="text-sm">Actions: {trend.count}</p>
                    <p className="text-sm">Impact Score: {trend.impact}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="policy" className="space-y-4">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border rounded-lg"
              >
                <h3 className="font-medium mb-2">{metric.category}</h3>
                <ul className="space-y-2">
                  {metric.policyImplications.map((implication, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="mt-1">•</span>
                      {implication}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ImpactAnalytics; 