import { ArrowLeft, Upload, Trash2, LogOut, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function AccountSettings() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    // For now, navigate to landing page - can be enhanced with actual Supabase auth later
    navigate('/');
  };

  const handleManageSubscription = () => {
    navigate('/pricing');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile</h1>
            <p className="text-muted-foreground mt-1">Manage your account settings and credits</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/home')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Two-column responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - Profile, Account Management, Danger Zone */}
          <div className="lg:col-span-8 space-y-6">
            {/* Personal Details Section */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Personal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="text-sm font-semibold bg-primary text-primary-foreground">
                      N
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </Button>
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">PNG or JPG, max 10MB</p>
                  </div>
                </div>

                <Separator />

                {/* Full Name */}
                <div className="space-y-2">
                  <Label className="text-sm">Full name</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                  <p className="text-xs text-muted-foreground">Shown to other users where relevant.</p>
                </div>

                <Separator />

                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-sm">Email</Label>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-foreground">nwittig@usc.edu</span>
                    <div className="flex gap-2">
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

            {/* Account Management Section */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Account Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-md border bg-muted/30">
                  <div>
                    <h4 className="font-medium text-foreground text-sm">Subscription</h4>
                    <p className="text-xs text-muted-foreground">Manage your subscription plan and billing settings</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleManageSubscription}
                    className="gap-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    Manage Subscription
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-md border bg-muted/30">
                  <div>
                    <h4 className="font-medium text-foreground text-sm">Sign Out</h4>
                    <p className="text-xs text-muted-foreground">Sign out of your account on this device</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-destructive">Danger zone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 bg-destructive/5 rounded-md border border-destructive/30">
                  <div>
                    <h4 className="font-medium text-destructive text-sm mb-1">Delete your account</h4>
                    <p className="text-xs text-muted-foreground">
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

          {/* Right column - Credit Usage */}
          <div className="lg:col-span-4 space-y-6">
            {/* Credit Usage Section */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">Credit Usage Jul-Aug 2025</CardTitle>
                    <p className="text-2xl font-bold text-foreground mt-2">12,127 credits</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Billing Period
                    </Button>
                    <Button variant="outline" size="sm">
                      ← Jul-Aug 2025 →
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90" size="sm">
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-56 rounded-md bg-muted/30 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm">Credit usage chart</p>
                    <p className="text-xs text-muted-foreground">Chart visualization would go here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
