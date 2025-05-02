
import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ImpactCardProps {
  title: string;
  count: number | string;
  icon: ReactNode;
  description: string;
  trend?: string;
  trendUp?: boolean;
}

const ImpactCard = ({ title, count, icon, description, trend, trendUp }: ImpactCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <CardDescription className="text-xs text-muted-foreground mt-1">
          {description}
          {trend && (
            <span className={`inline-block ml-2 ${trendUp ? 'text-civic-green' : 'text-civic-orange'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </span>
          )}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default ImpactCard;
