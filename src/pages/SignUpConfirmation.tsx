
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SignUpConfirmation = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow container max-w-md py-12">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-civic-green" />
              </div>
              <CardTitle className="text-2xl font-bold text-center">Account Created!</CardTitle>
              <CardDescription className="text-center">
                Thank you for creating an account with Substance
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p>
                We've sent a confirmation email to your inbox. Please verify your email address to complete your registration.
              </p>
              <p className="text-sm text-muted-foreground">
                If you don't see the email in your inbox, please check your spam folder.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button asChild className="w-full">
                <Link to="/sign-in">Continue to Sign In</Link>
              </Button>
              <div className="text-center text-sm">
                <Link to="/" className="text-primary underline-offset-4 hover:underline">
                  Return to Home
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default SignUpConfirmation;
