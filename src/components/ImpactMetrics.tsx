
import ImpactCard from "./ImpactCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const ImpactMetrics = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <ImpactCard 
          title="Total Community Actions"
          count="1,248"
          icon={<div className="h-4 w-4 rounded-full bg-civic-purple/20"></div>}
          description="Logged across all neighborhoods"
          trend="18% this month"
          trendUp={true}
        />
        <ImpactCard 
          title="Civic Trust Score"
          count="84"
          icon={<div className="h-4 w-4 rounded-full bg-civic-orange/20"></div>}
          description="Based on 56 verified actions"
          trend="8 points"
          trendUp={true}
        />
        <ImpactCard 
          title="Trust Level"
          count="Verified Member"
          icon={<div className="h-4 w-4 rounded-full bg-civic-green/20"></div>}
          description="Top 20% in your community"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Impact by Category</CardTitle>
          <CardDescription>
            Your contribution across different impact areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-civic-green"></div>
                  <span className="text-sm font-medium">🌱 Sustainability Impact</span>
                </div>
                <span className="text-sm font-medium">72%</span>
              </div>
              <Progress value={72} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-civic-orange"></div>
                  <span className="text-sm font-medium">🤝 Mutual Aid</span>
                </div>
                <span className="text-sm font-medium">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-civic-blue"></div>
                  <span className="text-sm font-medium">🏘️ Urban Density Benefit</span>
                </div>
                <span className="text-sm font-medium">89%</span>
              </div>
              <Progress value={89} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-civic-purple"></div>
                  <span className="text-sm font-medium">💼 Community Building</span>
                </div>
                <span className="text-sm font-medium">63%</span>
              </div>
              <Progress value={63} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImpactMetrics;
