
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImpactMetrics from "@/components/ImpactMetrics";
import CommunityMap from "@/components/CommunityMap";
import ActivityFeed from "@/components/ActivityFeed";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const sampleActivities = [
    {
      id: "1",
      user: "Jamie Chen",
      action: "Hosted a housing resource fair in a vacant storefront",
      location: "North District • ZIP 20009",
      time: "2 hours ago",
      tags: ["🌱 Sustainability", "🏘️ Urban Density"]
    },
    {
      id: "2",
      user: "Alex Rivera",
      action: "Organized a community food pantry with local restaurants",
      location: "Downtown • ZIP 20006",
      time: "Yesterday",
      tags: ["🤝 Mutual Aid"]
    },
    {
      id: "3",
      user: "Morgan Taylor",
      action: "Sublet room to traveling healthcare worker at reduced rate",
      location: "East Side • ZIP 20003",
      time: "3 days ago",
      tags: ["🌱 Sustainability", "🤝 Mutual Aid"]
    },
    {
      id: "4",
      user: "Jordan Park",
      action: "Led community workshop on urban gardening in vacant lot",
      location: "West End • ZIP 20037",
      time: "5 days ago",
      tags: ["🌱 Sustainability"]
    },
    {
      id: "5",
      user: "Casey Johnson",
      action: "Established pop-up childcare co-op with neighbors",
      location: "Midtown • ZIP 20005",
      time: "1 week ago",
      tags: ["🤝 Mutual Aid", "🏘️ Urban Density"]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Community Dashboard</h1>
            <p className="text-muted-foreground">Monitor civic impact and community actions in real-time</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <Button variant="outline" asChild>
              <Link to="/reports">Export Report</Link>
            </Button>
            <Button asChild>
              <Link to="/actions">Log New Action</Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="metrics" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="metrics">Impact Metrics</TabsTrigger>
                  <TabsTrigger value="map">Community Map</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Filter by:</span>
                  <select className="text-sm border rounded p-1">
                    <option>All Neighborhoods</option>
                    <option>North District</option>
                    <option>Downtown</option>
                    <option>East Side</option>
                  </select>
                </div>
              </div>
              
              <TabsContent value="metrics" className="mt-0">
                <ImpactMetrics />
              </TabsContent>
              
              <TabsContent value="map" className="mt-0">
                <CommunityMap />
              </TabsContent>
            </Tabs>
            
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Community Action Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-muted rounded-md flex items-center justify-center">
                  {/* Placeholder for a chart that would show distribution of actions */}
                  <div className="text-center">
                    <div className="text-muted-foreground mb-2">Action Distribution Chart</div>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="h-24 bg-civic/70 rounded-md relative overflow-hidden">
                        <div className="absolute bottom-2 left-0 right-0 text-xs text-white font-medium text-center">Housing</div>
                        <div className="absolute bottom-8 left-0 right-0 text-xs text-white font-medium text-center">42%</div>
                      </div>
                      <div className="h-16 bg-civic-orange/70 rounded-md relative overflow-hidden mt-8">
                        <div className="absolute bottom-2 left-0 right-0 text-xs text-white font-medium text-center">Food</div>
                        <div className="absolute bottom-8 left-0 right-0 text-xs text-white font-medium text-center">28%</div>
                      </div>
                      <div className="h-20 bg-civic-purple/70 rounded-md relative overflow-hidden mt-4">
                        <div className="absolute bottom-2 left-0 right-0 text-xs text-white font-medium text-center">Events</div>
                        <div className="absolute bottom-8 left-0 right-0 text-xs text-white font-medium text-center">35%</div>
                      </div>
                      <div className="h-12 bg-civic-green/70 rounded-md relative overflow-hidden mt-12">
                        <div className="absolute bottom-2 left-0 right-0 text-xs text-white font-medium text-center">Other</div>
                        <div className="absolute bottom-8 left-0 right-0 text-xs text-white font-medium text-center">18%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Your Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="text-4xl font-bold mb-2 flex items-end">
                    125 <span className="text-base text-muted-foreground ml-2">points</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Your Civic Trust Score
                  </div>
                  <div className="mt-4 flex items-center">
                    <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                      <div className="bg-civic h-full rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <span className="ml-2 text-sm font-medium">75%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <div className="text-lg font-bold">8</div>
                    <div className="text-xs text-muted-foreground">Actions Logged</div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg text-center">
                    <div className="text-lg font-bold">5</div>
                    <div className="text-xs text-muted-foreground">Verifications</div>
                  </div>
                </div>
                
                <Button className="w-full" asChild>
                  <Link to="/profile">View Profile</Link>
                </Button>
              </CardContent>
            </Card>
            
            <ActivityFeed activities={sampleActivities} />
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
