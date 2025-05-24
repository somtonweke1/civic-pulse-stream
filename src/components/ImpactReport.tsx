import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Download, FileText, Share2, BarChart2 } from 'lucide-react';

interface ReportSection {
  title: string;
  content: string;
  metrics: {
    label: string;
    value: string;
    change: string;
  }[];
}

const ImpactReport = () => {
  const [timeframe, setTimeframe] = useState('3m');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ReportSection[]>([]);

  const generateReport = async () => {
    setLoading(true);
    try {
      // Simulate report generation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockReport: ReportSection[] = [
        {
          title: 'Environmental Impact Summary',
          content: 'Your recycling efforts have contributed to significant environmental benefits. Through consistent recycling practices, you\'ve helped reduce landfill waste and conserve natural resources. This aligns with broader sustainability goals and demonstrates the power of individual actions in addressing climate change.',
          metrics: [
            { label: 'CO2 Reduction', value: '450 kg', change: '+15%' },
            { label: 'Waste Diverted', value: '320 kg', change: '+20%' },
            { label: 'Energy Saved', value: '1,200 kWh', change: '+25%' }
          ]
        },
        {
          title: 'Community Engagement Analysis',
          content: 'Your participation in community events and initiatives has strengthened local social networks and contributed to community resilience. These activities have created ripple effects, inspiring others to get involved and fostering a culture of civic engagement.',
          metrics: [
            { label: 'Hours Volunteered', value: '25 hrs', change: '+30%' },
            { label: 'People Reached', value: '150', change: '+40%' },
            { label: 'Events Organized', value: '5', change: '+25%' }
          ]
        },
        {
          title: 'Policy Impact Assessment',
          content: 'Your actions have contributed to several key policy objectives, including local climate action plans and community development initiatives. The data collected through your activities provides valuable insights for policymakers and helps demonstrate the effectiveness of grassroots initiatives.',
          metrics: [
            { label: 'Policy Goals Supported', value: '3', change: 'New' },
            { label: 'Data Points Collected', value: '250', change: '+50%' },
            { label: 'Stakeholders Engaged', value: '8', change: '+33%' }
          ]
        }
      ];

      setReport(mockReport);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Impact Report</CardTitle>
            <CardDescription>
              Generate detailed reports of your civic impact and its broader implications
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Last Month</SelectItem>
                <SelectItem value="3m">Last 3 Months</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={generateReport} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {report.length > 0 ? (
          <>
            {report.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{section.title}</h3>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-muted-foreground">{section.content}</p>
                <div className="grid grid-cols-3 gap-4">
                  {section.metrics.map((metric, i) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + i * 0.1 }}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <BarChart2 className="h-4 w-4 text-civic-green" />
                        <span className="text-sm font-medium">{metric.label}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">{metric.value}</span>
                        <span className="text-sm text-civic-green">{metric.change}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Report Generated</h3>
            <p className="text-muted-foreground mb-4">
              Select a timeframe and generate a report to see your impact analysis
            </p>
            <Button onClick={generateReport} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImpactReport; 