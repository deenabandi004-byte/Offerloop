import { ArrowLeft, Upload, Trash2, LogOut, CreditCard, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { loadOnboarding, saveOnboarding } from "@/utils/onboardingStorage";
import { useState } from "react";

export default function AccountSettings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [onboarding, setOnboarding] = useState(loadOnboarding());

  const firstName = onboarding?.firstName || "";
  const lastName = onboarding?.lastName || "";
  const email = user?.email || "Not signed in";
  const credits = user?.credits ?? 0;
  const profileImage = onboarding?.profileImageDataUrl;

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        const updated = saveOnboarding({ profileImageDataUrl: reader.result });
        setOnboarding(updated);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveProfileImage = () => {
    const updated = saveOnboarding({ profileImageDataUrl: undefined });
    setOnboarding(updated);
  };

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
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="h-20 w-20 rounded-full object-cover" />
                  ) : (
                    <AvatarFallback className="text-xl font-semibold bg-primary text-primary-foreground">
                      {(firstName?.[0] || "U").toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col space-y-2">
                  <div className="flex space-x-2">
                    <input
                      id="profile-photo-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfileImageUpload}
                    />
                    <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => document.getElementById("profile-photo-input")?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleRemoveProfileImage}>
                      Remove
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    JPG, GIF or PNG. 1MB max.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    defaultValue={firstName}
                    placeholder="First name"
                    className="bg-background border-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    defaultValue={lastName}
                    placeholder="Last name"
                    className="bg-background border-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Email</Label>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">{email}</span>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                      Verified
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credit Usage</CardTitle>
            <p className="text-2xl font-bold text-foreground mt-2">{credits.toLocaleString()} credits</p>
            <p className="text-sm text-muted-foreground">
              Billing period: Jan 1 - Jan 31, 2024
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Credits used</span>
                <span className="text-sm font-medium text-foreground">{Math.max(0, (user?.maxCredits ?? 5000) - credits).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Credits remaining</span>
                <span className="text-sm font-medium text-foreground">{credits.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Total credits</span>
                <span className="text-sm font-bold text-foreground">{(user?.maxCredits ?? 5000).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Academics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-foreground">Graduation</Label>
                <p className="text-sm text-foreground">
                  {onboarding?.graduationMonth || "--"}/{onboarding?.graduationYear || "----"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground">Field of Study</Label>
                <p className="text-sm text-foreground">{onboarding?.fieldOfStudy || "--"}</p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">Degree</Label>
              <p className="text-sm text-foreground">{onboarding?.degreeType || onboarding?.customDegree || "--"}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">University</Label>
              <p className="text-sm text-foreground">{onboarding?.university || "--"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Career Interests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-foreground">Industries</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {(onboarding?.industries || []).map(ind => (
                  <span key={ind} className="px-2 py-1 text-xs rounded bg-muted/50 border">{ind}</span>
                ))}
                {(!onboarding?.industries || onboarding.industries.length === 0) && <p className="text-sm text-muted-foreground">--</p>}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">Preferred Role</Label>
              <p className="text-sm text-foreground">{onboarding?.jobRole || onboarding?.customJobRole || "--"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-foreground">Locations</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {(onboarding?.locations || []).map(loc => (
                  <span key={loc} className="px-2 py-1 text-xs rounded bg-muted/50 border">{loc}</span>
                ))}
                {(!onboarding?.locations || onboarding.locations.length === 0) && <p className="text-sm text-muted-foreground">--</p>}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">Job Types</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {(onboarding?.jobTypes || []).map(jt => (
                  <span key={jt} className="px-2 py-1 text-xs rounded bg-muted/50 border capitalize">{jt.replace("-", " ")}</span>
                ))}
                {(!onboarding?.jobTypes || onboarding.jobTypes.length === 0) && <p className="text-sm text-muted-foreground">--</p>}
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
