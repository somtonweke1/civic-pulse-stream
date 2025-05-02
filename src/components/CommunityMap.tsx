
const CommunityMap = () => {
  return (
    <div className="rounded-xl overflow-hidden border relative">
      <div className="absolute inset-0 flex items-center justify-center bg-muted/40 z-10">
        <div className="text-center p-6 bg-background/95 rounded-xl shadow-lg max-w-md">
          <h3 className="font-semibold text-lg mb-2">Community Impact Map</h3>
          <p className="text-muted-foreground mb-4">
            Visualize real-time community actions and their impact across neighborhoods.
          </p>
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-civic-green/20 p-2 rounded-md text-center text-xs">
              <div className="font-medium text-sm">94</div>
              <div className="text-muted-foreground">Green</div>
            </div>
            <div className="bg-civic-orange/20 p-2 rounded-md text-center text-xs">
              <div className="font-medium text-sm">127</div>
              <div className="text-muted-foreground">Aid</div>
            </div>
            <div className="bg-civic-blue/20 p-2 rounded-md text-center text-xs">
              <div className="font-medium text-sm">56</div>
              <div className="text-muted-foreground">Urban</div>
            </div>
            <div className="bg-civic-purple/20 p-2 rounded-md text-center text-xs">
              <div className="font-medium text-sm">82</div>
              <div className="text-muted-foreground">Events</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mock map visual */}
      <div className="h-[400px] bg-gradient-to-br from-muted/80 to-muted p-4">
        <div className="grid grid-cols-8 grid-rows-8 gap-1 h-full">
          {Array(64).fill(0).map((_, i) => {
            // Create different shaded blocks to simulate a map
            const opacity = Math.floor(Math.random() * 4) * 10 + 60;
            const color = i % 5 === 0 ? `bg-civic/30` : 
                         i % 7 === 0 ? `bg-civic-orange/20` : 
                         i % 9 === 0 ? `bg-civic-purple/15` : 
                         i % 11 === 0 ? `bg-civic-blue/25` : 'bg-transparent';
                         
            return (
              <div 
                key={i} 
                className={`rounded-md border border-border/10 ${color}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommunityMap;
