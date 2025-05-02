
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ActionForm from "@/components/ActionForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Actions = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="container py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Log Your Civic Action</h1>
          <p className="text-lg text-muted-foreground">
            Document the informal ways you're contributing to your community's resilience and help build a better data layer for civic impact.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div>
            <ActionForm />
            
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Why Log Your Actions?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="mt-1 h-6 w-6 rounded-full bg-civic-purple flex items-center justify-center text-white font-bold text-sm">1</div>
                  <div>
                    <h3 className="font-medium">Build Trust</h3>
                    <p className="text-sm text-muted-foreground">Earn Civic Trust points and build your community reputation through verified actions.</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="mt-1 h-6 w-6 rounded-full bg-civic-orange flex items-center justify-center text-white font-bold text-sm">2</div>
                  <div>
                    <h3 className="font-medium">Quantify Impact</h3>
                    <p className="text-sm text-muted-foreground">Turn your informal contributions into measurable data that helps demonstrate community value.</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="mt-1 h-6 w-6 rounded-full bg-civic flex items-center justify-center text-white font-bold text-sm">3</div>
                  <div>
                    <h3 className="font-medium">Inform Policy</h3>
                    <p className="text-sm text-muted-foreground">Help policymakers and funders understand the real value of informal community actions.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Action Categories</CardTitle>
                <CardDescription>Examples of community activities you can log</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-full bg-civic-blue/20 flex items-center justify-center">
                      <span role="img" aria-label="housing">🏠</span>
                    </div>
                    <h3 className="font-medium">Housing Innovations</h3>
                  </div>
                  <ul className="text-sm list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Room subletting at affordable rates</li>
                    <li>Temporary housing assistance</li>
                    <li>Vacant space utilization</li>
                    <li>Co-housing arrangements</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-full bg-civic-green/20 flex items-center justify-center">
                      <span role="img" aria-label="mutual aid">🤝</span>
                    </div>
                    <h3 className="font-medium">Mutual Aid</h3>
                  </div>
                  <ul className="text-sm list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Food sharing or community fridges</li>
                    <li>Non-monetary exchanges of services</li>
                    <li>Resource pooling initiatives</li>
                    <li>Skill sharing workshops</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-full bg-civic-orange/20 flex items-center justify-center">
                      <span role="img" aria-label="care">👶</span>
                    </div>
                    <h3 className="font-medium">Community Care</h3>
                  </div>
                  <ul className="text-sm list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Pop-up childcare co-ops</li>
                    <li>Elder care networks</li>
                    <li>Mental health support circles</li>
                    <li>Accessibility assistance</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-full bg-civic-purple/20 flex items-center justify-center">
                      <span role="img" aria-label="events">🎉</span>
                    </div>
                    <h3 className="font-medium">Community Events</h3>
                  </div>
                  <ul className="text-sm list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Neighborhood clean-ups</li>
                    <li>Educational workshops</li>
                    <li>Cultural celebrations</li>
                    <li>Community organizing meetings</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Actions;
