
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ActionForm from "@/components/ActionForm";
import ActivityFeed from "@/components/ActivityFeed";

const Index = () => {
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
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                See what's working —<br />
                <span className="text-civic">from the street to the state.</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-lg">
                Substance captures, quantifies, and validates informal community actions, turning them into reputation-grade, policy-ready data.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link to="/actions">Log Your First Action</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/dashboard">View Community Dashboard</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-civic/10 p-6 rounded-xl animate-float">
                    <div className="h-10 w-10 rounded-full bg-civic flex items-center justify-center mb-4">
                      <span className="text-white font-medium text-lg">🌱</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">Sustainability Impact</h3>
                    <p className="text-sm text-muted-foreground">
                      Track reuse of housing, resources, and spaces
                    </p>
                  </div>
                  <div className="bg-civic-purple/10 p-6 rounded-xl animate-float" style={{ animationDelay: "0.5s" }}>
                    <div className="h-10 w-10 rounded-full bg-civic-purple flex items-center justify-center mb-4">
                      <span className="text-white font-medium text-lg">🏘️</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">Urban Density Benefit</h3>
                    <p className="text-sm text-muted-foreground">
                      Measure housing efficiency and community space utilization
                    </p>
                  </div>
                </div>
                <div className="space-y-6 mt-12">
                  <div className="bg-civic-orange/10 p-6 rounded-xl animate-float" style={{ animationDelay: "0.3s" }}>
                    <div className="h-10 w-10 rounded-full bg-civic-orange flex items-center justify-center mb-4">
                      <span className="text-white font-medium text-lg">🤝</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">Mutual Aid Impact</h3>
                    <p className="text-sm text-muted-foreground">
                      Quantify non-monetary exchanges and community support
                    </p>
                  </div>
                  <div className="bg-civic-blue/10 p-6 rounded-xl animate-float" style={{ animationDelay: "0.7s" }}>
                    <div className="h-10 w-10 rounded-full bg-civic-blue flex items-center justify-center mb-4">
                      <span className="text-white font-medium text-lg">📊</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">Policy-Ready Data</h3>
                    <p className="text-sm text-muted-foreground">
                      Turn community actions into metrics for decision-makers
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">The Data Layer for Civic Impact</h2>
            <p className="text-lg text-muted-foreground">
              We bridge informal behavior and formal power by capturing community actions that traditional metrics miss.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-xl shadow-sm border">
              <div className="text-2xl font-bold mb-2 text-civic">Capture</div>
              <p className="mb-4">Log community activities like subletting, mutual aid, or pop-up childcare through our simple interface.</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-civic"></div>
                  <span>User-friendly action logging</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-civic"></div>
                  <span>Integration with community platforms</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-civic"></div>
                  <span>Mobile-friendly documentation</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-background p-6 rounded-xl shadow-sm border">
              <div className="text-2xl font-bold mb-2 text-civic-orange">Quantify</div>
              <p className="mb-4">Translate community actions into standardized impact metrics that matter for policy and investment.</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-civic-orange"></div>
                  <span>Standardized impact categories</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-civic-orange"></div>
                  <span>Community trust scoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-civic-orange"></div>
                  <span>Neighborhood-level aggregation</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-background p-6 rounded-xl shadow-sm border">
              <div className="text-2xl font-bold mb-2 text-civic-purple">Validate</div>
              <p className="mb-4">Build trust with lightweight verification and peer confirmation of reported activities.</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-civic-purple"></div>
                  <span>Photo and receipt documentation</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-civic-purple"></div>
                  <span>Peer verification system</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-civic-purple"></div>
                  <span>Trust building through consistent action</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Action and Activity Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8">Join the Community</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ActionForm />
            <ActivityFeed activities={sampleActivities} />
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">Who Can Benefit</h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            Substance creates a bridge between informal community activity and formal decision-making systems.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-background p-6 rounded-xl shadow-sm border">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-civic to-civic-blue/70 flex items-center justify-center mb-4 text-white font-medium text-xl">
                VC
              </div>
              <h3 className="font-bold text-lg mb-2">Investors</h3>
              <p className="text-sm text-muted-foreground">
                Get real-time visibility into undercapitalized community movements before they become investable markets.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl shadow-sm border">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-civic-orange to-civic-purple/70 flex items-center justify-center mb-4 text-white font-medium text-xl">
                🏙️
              </div>
              <h3 className="font-bold text-lg mb-2">City Governments</h3>
              <p className="text-sm text-muted-foreground">
                Allocate resources based on actual community behaviors rather than outdated census data.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl shadow-sm border">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-civic-green to-civic/70 flex items-center justify-center mb-4 text-white font-medium text-xl">
                🏠
              </div>
              <h3 className="font-bold text-lg mb-2">Housing Innovators</h3>
              <p className="text-sm text-muted-foreground">
                Prove that alternative housing usage patterns have quantifiable economic and environmental benefits.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl shadow-sm border">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-civic-blue to-civic-green/70 flex items-center justify-center mb-4 text-white font-medium text-xl">
                ESG
              </div>
              <h3 className="font-bold text-lg mb-2">ESG Funds</h3>
              <p className="text-sm text-muted-foreground">
                Access grassroots transparency to fight greenwashing with verified community impact data.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-civic to-civic-purple text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to make your community impact visible?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Start documenting your civic actions today and help build a more accurate picture of your community's resilience.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="outline" className="bg-white text-civic hover:bg-white/90 border-white" asChild>
              <Link to="/sign-up">Create Account</Link>
            </Button>
            <Button size="lg" className="bg-white/20 hover:bg-white/30 border-white/20" asChild>
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
