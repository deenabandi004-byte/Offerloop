import { ArrowLeft, Upload, Trash2, LogOut, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";

export default function AccountSettings() {
  const navigate = useNavigate();
  const [creditsRemaining, setCreditsRemaining] = useState(0);
  const [maxCredits, setMaxCredits] = useState(0);
  const [resetsAt, setResetsAt] = useState<string>('');

  useEffect(() => {
    import('@/services/api').then(({ apiService }) => {
      apiService.getCredits().then(c => {
        setCreditsRemaining(c.creditsRemaining);
        setMaxCredits(c.maxCredits);
        setResetsAt(new Date(c.resetsAt).toLocaleDateString());
      }).catch(() => {});
    });
  }, []);

  const handleSignOut = async () => {
    // For now, navigate to landing page - can be enhanced with actual Supabase auth later
    navigate('/');
  };

  const handleManageSubscription = () => {
    navigate('/pricing');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/home')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and credits</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Personal Details Section */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-xl font-semibold bg-primary text-primary-foreground">
                    N
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-foreground">Profile Picture</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">PNGs, JPEGs under 10MB</p>
                  <div className="flex gap-3">
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                    <Button variant="outline" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Full Name */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-foreground">Full Name</Label>
                <p className="text-sm text-muted-foreground">Your first and last name, as visible to others.</p>
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    defaultValue="Nicholas" 
                    placeholder="First name"
                    className="bg-background border-input"
                  />
                  <Input 
                    defaultValue="Wittig" 
                    placeholder="Last name"
                    className="bg-background border-input"
                  />
                </div>
              </div>

              <Separator />

              {/* Email */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-foreground">Email</Label>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">nwittig@usc.edu</span>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                    <Button variant="outline" size="sm">
                      Reset Password
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credit Usage Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Credits</CardTitle>
                <p className="text-2xl font-bold text-foreground mt-2">
                  {creditsRemaining.toLocaleString()} / {maxCredits.toLocaleString()}
                </p>
                {resetsAt && <p className="text-sm text-muted-foreground">Resets on {resetsAt}</p>}
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Simple chart placeholder - you can integrate a real chart library later */}
              <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">Credit usage chart</p>
                  <p className="text-sm text-muted-foreground">Chart visualization would go here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Management Section */}
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                <div>
                  <h4 className="font-medium text-foreground mb-1">Subscription</h4>
                  <p className="text-sm text-muted-foreground">
                    Manage your subscription plan and billing settings
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleManageSubscription}
                  className="flex items-center gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  Manage Subscription
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                <div>
                  <h4 className="font-medium text-foreground mb-1">Sign Out</h4>
                  <p className="text-sm text-muted-foreground">
                    Sign out of your account on this device
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">Danger zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                <div>
                  <h4 className="font-medium text-destructive mb-1">Delete your account</h4>
                  <p className="text-sm text-muted-foreground">
                    This will permanently delete your account and all your data. This action cannot be undone.
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
