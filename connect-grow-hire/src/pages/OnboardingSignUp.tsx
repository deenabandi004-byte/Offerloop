import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { updateProfile } from "@/hooks/useProfile";

const OnboardingSignUp = () => {
  const navigate = useNavigate();

  const handleGoogleSignUp = async () => {
    try {
      localStorage.removeItem('resumeData');
      await updateProfile({ onboardingComplete: true });
      console.log("Onboarding completed successfully");
      navigate("/home");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      navigate("/home");
    }
  };

  const handleGoogleSignUpLink = () => {
    window.open("https://accounts.google.com/signup", "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/onboarding/location-preferences")}
        className="absolute top-6 left-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      
      <div className="w-full max-w-md space-y-4">
        <Progress value={100} className="w-full" />
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Get Started</CardTitle>
            <p className="text-muted-foreground">Create your account to continue</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button 
              onClick={handleGoogleSignUp}
              className="w-full bg-[#4285f4] hover:bg-[#3367d6] text-white" 
              size="lg"
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </Button>
            
            <div className="text-center text-sm text-muted-foreground leading-relaxed">
              This app requires a Google account to sign up and use our services. If you don't have a Google account,{" "}
              <button 
                onClick={handleGoogleSignUpLink}
                className="text-[#4285f4] hover:text-[#3367d6] underline underline-offset-2 transition-colors"
              >
                sign up for Google here
              </button>
              .
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingSignUp;
