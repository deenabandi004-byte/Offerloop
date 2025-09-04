import { ArrowLeft, Upload, Trash2, LogOut, CreditCard, Calendar, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { getProfile, updateProfile, getProfileSync, updateProfileSync } from "@/hooks/useProfile";
import { OnboardingProfile } from "@/types/profile";

export default function AccountSettings() {
  const navigate = useNavigate();
  const { user, updateUser, signOut } = useAuth();
  const [profile, setProfile] = useState<OnboardingProfile>(getProfileSync());
  const [editEmail, setEditEmail] = useState(false);
  const [emailDraft, setEmailDraft] = useState(user?.email || '');
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const profileData = await getProfile();
      setProfile(profileData);
    };
    loadProfile();
  }, []);

  const handleSignOut = async () => {
    signOut();
    navigate('/');
  };

  const handleManageSubscription = () => {
    navigate('/pricing');
  };

  const handleDeleteAccount = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('onboardingProfile');
    localStorage.removeItem('resumeData');
    navigate('/');
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const updatedProfile = await updateProfile({ avatarDataUrl: dataUrl });
      setProfile(updatedProfile);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarRemove = async () => {
    const updatedProfile = await updateProfile({ avatarDataUrl: null });
    setProfile(updatedProfile);
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const updatedProfile = await updateProfile({ resume: { name: file.name, dataUrl } });
      setProfile(updatedProfile);
    };
    reader.readAsDataURL(file);
  };

  const updateProfileField = async (field: keyof OnboardingProfile, value: any) => {
    const updatedProfile = await updateProfile({ [field]: value });
    setProfile(updatedProfile);
  };

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');
  const university = profile.university || '';
  const displayName = fullName || user?.name || 'Profile';
  const initial = displayName.charAt(0).toUpperCase();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const degreeOptions = [
    { value: "associate", label: "Associate's Degree (AA, AS, etc.)" },
    { value: "bachelor", label: "Bachelor's Degree (BA, BS, BBA, BFA, etc.)" },
    { value: "master", label: "Master's Degree (MA, MS, MBA, MPA, MFA, etc.)" },
    { value: "doctorate", label: "Doctorate/PhD (PhD, EdD, DBA, etc.)" },
    { value: "other", label: "Other" },
  ];

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
              <div className="space-y-4">
                <Label className="text-sm font-medium text-foreground">Profile Picture</Label>
                <p className="text-sm text-muted-foreground">PNGs, JPEGs under 10MB</p>
                
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    {profile.avatarDataUrl ? (
                      <img 
                        src={profile.avatarDataUrl} 
                        alt={displayName} 
                        className="h-full w-full rounded-full object-cover" 
                      />
                    ) : (
                      <AvatarFallback className="text-xl font-semibold bg-primary text-primary-foreground">
                        {initial}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col">
                      <h2 className="text-xl font-semibold">{displayName}</h2>
                      {university && <p className="text-muted-foreground">{university}</p>}
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        size="sm" 
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleAvatarRemove}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={avatarInputRef}
                  onChange={handleAvatarUpload}
                />
              </div>

              <Separator />

              {/* Email */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-foreground">Email</Label>
                <div className="flex items-center justify-between">
                  {!editEmail ? (
                    <span className="text-foreground">{user?.email || 'Not set'}</span>
                  ) : (
                    <Input 
                      value={emailDraft} 
                      onChange={e => setEmailDraft(e.target.value)} 
                      className="max-w-md" 
                    />
                  )}
                  <div className="flex gap-3">
                    {!editEmail ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setEditEmail(true)}
                      >
                        Change
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => { 
                          updateUser({ email: emailDraft }); 
                          setEditEmail(false); 
                        }}
                      >
                        Save
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => alert('Password reset coming soon')}
                    >
                      Reset Password
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Graduation Date */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-foreground">Graduation Date</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Month</Label>
                    <Select 
                      value={profile.graduationMonth || ""} 
                      onValueChange={(value) => updateProfileField('graduationMonth', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="May" />
                      </SelectTrigger>
                      <SelectContent>
                        {monthNames.map((month, index) => (
                          <SelectItem key={month} value={String(index + 1).padStart(2, '0')}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Year</Label>
                    <Select 
                      value={profile.graduationYear || ""} 
                      onValueChange={(value) => updateProfileField('graduationYear', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="2027" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 20 }, (_, i) => {
                          const year = new Date().getFullYear() + 5 - i;
                          return (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Field of Study */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-foreground">Field of Study</Label>
                <Input 
                  value={profile.fieldOfStudy || ""} 
                  onChange={(e) => updateProfileField('fieldOfStudy', e.target.value)}
                  placeholder="Finance"
                  className="bg-background border-input"
                />
              </div>

              <Separator />

              {/* Current Degree */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-foreground">Current Degree</Label>
                <Select 
                  value={profile.degreeType || ""} 
                  onValueChange={(value) => updateProfileField('degreeType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="BA" />
                  </SelectTrigger>
                  <SelectContent>
                    {degreeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Resume Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Resume</CardTitle>
              <Button 
                variant="link" 
                onClick={() => resumeInputRef.current?.click()}
                className="text-primary"
              >
                Replace Resume
              </Button>
            </CardHeader>
            <CardContent>
              {profile.resume ? (
                <div className="flex items-center justify-center p-8 bg-muted/30 rounded-lg border-2 border-dashed">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
                      <svg className="w-8 h-8 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="font-medium">{profile.resume.name}</p>
                    <Button 
                      variant="link" 
                      onClick={() => window.open(profile.resume?.dataUrl, '_blank')}
                      className="text-primary"
                    >
                      Click to view full resume
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center p-8 bg-muted/30 rounded-lg border-2 border-dashed">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
                      <svg className="w-8 h-8 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-muted-foreground">No resume uploaded</p>
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="application/pdf"
                hidden
                ref={resumeInputRef}
                onChange={handleResumeUpload}
              />
            </CardContent>
          </Card>

          {/* Career Interests Section */}
          <Card>
            <CardHeader>
              <CardTitle>Career Interests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Industries of Interest */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-foreground">Industries of Interest</Label>
                <div className="flex flex-wrap gap-2">
                  {profile.industries && profile.industries.length > 0 ? (
                    profile.industries.map((industry) => (
                      <Badge key={industry} variant="secondary" className="text-xs">
                        {industry}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">Investment Banking and Management Consulting</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Preferred Job Roles/Titles */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-foreground">Preferred Job Roles/Titles</Label>
                <div className="flex flex-wrap gap-2">
                  {profile.jobRole ? (
                    <Badge variant="secondary" className="text-xs">
                      {profile.jobRole}
                    </Badge>
                  ) : (
                    <p className="text-muted-foreground text-sm">Associate Consulting and Investment Banking Analyst</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Preferred Locations */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-foreground">Preferred Locations</Label>
                <div className="flex flex-wrap gap-2">
                  {profile.locations && profile.locations.length > 0 ? (
                    profile.locations.map((location) => (
                      <Badge key={location} variant="secondary" className="text-xs">
                        {location}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">Los Angeles and New York</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Job Type(s) Interested in */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-foreground">Job Type(s) Interested in</Label>
                <div className="flex flex-wrap gap-2">
                  {profile.jobTypes && profile.jobTypes.length > 0 ? (
                    profile.jobTypes.map((jobType) => (
                      <Badge key={jobType} variant="secondary" className="text-xs">
                        {jobType}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">Internship</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credit Usage Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Credit Usage Jul-Aug 2025</CardTitle>
                <p className="text-2xl font-bold text-foreground mt-2">
                  {user?.credits?.toLocaleString() || '12,127'} credits
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Billing Period
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  ← Jul-Aug 2025 →
                </Button>
                <Button className="bg-primary hover:bg-primary/90" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
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
                <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
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
