import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const SignIn = () => {
  const navigate = useNavigate();
  const { signIn, isLoading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      
      // BYPASS OAUTH - GO STRAIGHT TO MAIN APP
      toast({
        title: "Welcome to Offerloop.ai!",
        description: "Sign-in bypassed for development",
      });
      
      // Navigate directly to home without authentication
      navigate("/home");
      
    } catch (error) {
      console.error('Sign-in failed:', error);
      toast({
        title: "Sign-in failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleCreateAccount = () => {
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2"
        disabled={isSigningIn}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Button>
      
      <div className="w-full max-w-md space-y-4">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Welcome back!</CardTitle>
            <p className="text-muted-foreground">Sign in to your account</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button 
              onClick={handleGoogleSignIn}
              disabled={isLoading || isSigningIn}
              className="w-full bg-[#4285f4] hover:bg-[#3367d6] text-white" 
              size="lg"
            >
              {isSigningIn ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
                  Signing in...
                </div>
              ) : (
                <>
                  <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>
            
            <div className="text-center space-y-4">
              <div className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button 
                  onClick={handleCreateAccount}
                  disabled={isSigningIn}
                  className="text-[#4285f4] hover:text-[#3367d6] underline underline-offset-2 transition-colors font-medium disabled:opacity-50"
                >
                  Create one here
                </button>
              </div>
            </div>

            <div className="text-center text-xs text-muted-foreground leading-relaxed">
              By signing in, you agree to our{" "}
              <a 
                href="/terms" 
                className="text-[#4285f4] hover:text-[#3367d6] underline underline-offset-2 transition-colors"
              >
                Terms of Service
              </a>
              {" "}and{" "}
              <a 
                href="/privacy" 
                className="text-[#4285f4] hover:text-[#3367d6] underline underline-offset-2 transition-colors"
              >
                Privacy Policy
              </a>
              .
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;