
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">About Substance</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground mb-8">
              Substance is a civic index layer that captures, quantifies, and validates informal community actions, transforming them into meaningful data that can inform policy and investment decisions.
            </p>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">Our Mission</h2>
            <p>
              We believe that the data layer for civic impact is broken. Entire economies of mutual care, informal housing, and local innovation are invisible to policy, funding, and planning systems. Substance aims to bridge this gap by creating tools that make community resilience visible and valuable.
            </p>
            
            <div className="my-8 p-6 bg-muted rounded-lg border">
              <h3 className="text-xl font-medium mb-2">The Problem We're Solving</h3>
              <p className="mb-0">
                <strong>"The data layer for civic impact is broken."</strong> Entire economies of mutual care, informal housing, and local innovation are invisible to policy, funding, and planning systems.
              </p>
            </div>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">How It Works</h2>
            <ol className="list-decimal pl-6 space-y-4 mb-8">
              <li>
                <strong>Local Action Capture:</strong> Individuals and organizations log community activities through our simple interface or connected community platforms.
              </li>
              <li>
                <strong>Impact Translation:</strong> We convert these actions into standardized impact metrics across categories like sustainability, mutual aid, and urban density.
              </li>
              <li>
                <strong>Validation:</strong> Light-touch verification through photos, peer confirmation, and consistent action builds trust in the data.
              </li>
              <li>
                <strong>Aggregation:</strong> Community actions are aggregated at the neighborhood and city level to reveal patterns and needs.
              </li>
              <li>
                <strong>Institutional Access:</strong> Policy makers, funders, and planners can subscribe to data feeds that inform better decision-making.
              </li>
            </ol>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">Who Benefits</h2>
            <ul className="list-disc pl-6 space-y-4">
              <li>
                <strong>Community Members:</strong> Gain recognition for informal contributions and build reputation within their neighborhoods.
              </li>
              <li>
                <strong>Civic Organizations:</strong> Demonstrate their impact with credible data to attract funding and support.
              </li>
              <li>
                <strong>City Governments:</strong> Access real-time insights into community needs and allocate resources more effectively.
              </li>
              <li>
                <strong>Impact Investors:</strong> Identify promising community movements and innovations before they become mainstream.
              </li>
              <li>
                <strong>Housing Innovators:</strong> Quantify the benefits of alternative housing models to support policy advocacy.
              </li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">Our Team</h2>
            <p>
              Substance was founded by a team of civic technologists, urban planners, and data scientists who believe in the power of informal community action to solve urban challenges. We are committed to building tools that amplify community resilience and create more equitable cities.
            </p>
            
            <div className="my-12 text-center">
              <h3 className="text-2xl font-semibold mb-6">Ready to join the movement?</h3>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" asChild>
                  <Link to="/sign-up">Create Account</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default About;
