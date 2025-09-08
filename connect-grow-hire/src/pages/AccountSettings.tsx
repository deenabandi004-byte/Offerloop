import { ArrowLeft, Upload, Trash2, LogOut, CreditCard, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function AccountSettings() {
  const navigate = useNavigate();
  
  const [prof, setProf] = useState({
    fieldOfStudy: "",
    currentDegree: "",
    graduationYear: "",
    industriesOfInterest: [] as string[],
    preferredJobRole: "",
    preferredLocations: [] as string[],
    jobTypes: [] as string[],
  });

  useEffect(() => {
    try {
      const resume = JSON.parse(localStorage.getItem('resumeData') || '{}');
      const pi = JSON.parse(localStorage.getItem('professionalInfo') || '{}');
      setProf({
        fieldOfStudy: pi.fieldOfStudy || resume.major || "",
        currentDegree: pi.currentDegree || "",
        graduationYear: pi.graduationYear || resume.year || "",
        industriesOfInterest: Array.isArray(pi.industriesOfInterest) ? pi.industriesOfInterest : [],
        preferredJobRole: pi.preferredJobRole || "",
        preferredLocations: Array.isArray(pi.preferredLocations) ? pi.preferredLocations : [],
        jobTypes: Array.isArray(pi.jobTypes) ? pi.jobTypes : [],
      });
    } catch (e) {
      console.error('Failed to load professionalInfo/resumeData', e);
    }
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
                <CardTitle>Credit Usage Jul-Aug 2025</CardTitle>
                <p className="text-2xl font-bold text-foreground mt-2">12,127 credits</p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  Billing Period
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  ← Jul-Aug 2025 →
                </Button>
                <Button className="bg-primary hover:bg-primary/90" size="sm">
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

          {/* Professional Information Section */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Field of Study */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-foreground">Field of Study</Label>
                <Input 
                  value={prof.fieldOfStudy || "Finance"} 
                  readOnly
                  className="bg-background border-input"
                />
              </div>

              <Separator />

              {/* Current Degree */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-foreground">Current Degree</Label>
                <Input 
                  value={prof.currentDegree || "BA"} 
                  readOnly
                  className="bg-background border-input"
                />
              </div>

              <Separator />

              {/* Resume and Career Interests */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Resume Section */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-foreground">Resume</Label>
                  <div className="h-48 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center p-6">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground text-center">Click to view full resume</p>
                  </div>
                </div>

                {/* Career Interests Section */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-foreground">Career Interests</Label>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">Industries of Interest</Label>
                      <p className="text-sm text-foreground mt-1">
                        {prof.industriesOfInterest.length ? prof.industriesOfInterest.join(", ") : "Investment Banking and Management Consulting"}
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">Preferred Job Roles/Titles</Label>
                      <p className="text-sm text-foreground mt-1">
                        {prof.preferredJobRole || "Associate Consulting and Investment Banking Analyst"}
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">Preferred Locations</Label>
                      <p className="text-sm text-foreground mt-1">
                        {prof.preferredLocations.length ? prof.preferredLocations.join(" and ") : "Los Angeles and New York"}
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">Job Type(s) Interested in</Label>
                      <p className="text-sm text-foreground mt-1">
                        {prof.jobTypes.length ? prof.jobTypes.join(", ") : "Full-time"}
                      </p>
                    </div>
                  </div>
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
                <Button variant="destructive" size="sm" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
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
