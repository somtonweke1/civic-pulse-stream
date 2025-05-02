
import { Card } from "@/components/ui/card";

interface Activity {
  id: string;
  user: string;
  action: string;
  location: string;
  time: string;
  tags: string[];
}

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg">Recent Community Activity</h3>
      </div>
      <div className="divide-y">
        {activities.map((activity) => (
          <div key={activity.id} className="p-4 hover:bg-muted/50 transition-colors">
            <div className="flex justify-between">
              <span className="font-medium">{activity.user}</span>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
            <p className="mt-1">{activity.action}</p>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">{activity.location}</div>
              <div className="flex gap-2">
                {activity.tags.map((tag, idx) => {
                  // Determine tag class based on content
                  let tagClass = "civic-tag ";
                  if (tag.includes("Sustainability")) {
                    tagClass += "civic-tag-sustainability";
                  } else if (tag.includes("Mutual Aid")) {
                    tagClass += "civic-tag-mutual-aid";
                  } else if (tag.includes("Urban")) {
                    tagClass += "civic-tag-urban";
                  } else {
                    tagClass += "bg-muted text-muted-foreground";
                  }
                  
                  return (
                    <div key={idx} className={tagClass}>
                      {tag}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ActivityFeed;
