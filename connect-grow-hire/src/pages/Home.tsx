import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import React from "react";
import { Upload, Download, Zap, Crown, ExternalLink, MessageCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AutocompleteInput } from "@/components/AutocompleteInput";
import ScoutChatbot from "@/components/ScoutChatbot";
import LockedFeatureOverlay from "@/components/LockedFeatureOverlay";
import { useAuth } from "@/contexts/AuthContext";

const BACKEND_URL = 'http://localhost:5001';

const TIER_CONFIGS = {
  free: {
    maxContacts: 4,
    name: 'Free',
    credits: 60, // 4 contacts × 15 credits per contact
    description: 'Basic search - 4 contacts',
    coffeeChat: false,
    interviewPrep: false
  },
  starter: {
    maxContacts: 6,
    name: 'Starter',
    credits: 90, // 6 contacts × 15 credits per contact
    description: 'Advanced search - 6 contacts + Email drafts',
    coffeeChat: true,
    interviewPrep: false
  },
  pro: {
    maxContacts: 8,
    name: 'Pro',
    credits: 120, // 8 contacts × 15 credits per contact
    description: 'Full search - 8 contacts + Resume matching',
    coffeeChat: true,
    interviewPrep: true
  }
};

const Home = () => {
  const waveKeyframes = `
    @keyframes wave {
      0%, 100% { transform: rotate(-8deg); }
      50% { transform: rotate(8deg); }
    }
  `;

  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = waveKeyframes;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [waveKeyframes]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [userTier] = useState<'free' | 'starter' | 'pro'>(user?.tier || 'free');
  
  // Form state
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [collegeAlumni, setCollegeAlumni] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [jobPostUrl, setJobPostUrl] = useState("");
  const [isScoutChatOpen, setIsScoutChatOpen] = useState(false);
  
  // Search state
  const [isSearching, setIsSearching] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [lastResults, setLastResults] = useState<any[]>([]);
  const [lastResultsTier, setLastResultsTier] = useState<'free' | 'starter' | 'pro' | string>('');
  const hasResults = lastResults.length > 0;
  
  const currentUser = user || {
    credits: 0,
    maxCredits: 0,
    name: 'User',
    email: 'user@example.com',
    tier: userTier
  };

  const currentTierConfig = TIER_CONFIGS[userTier];

  // Test backend connection on mount
  useEffect(() => {
    fetch(`${BACKEND_URL}/health`)
      .then(res => res.json())
      .then(data => {
        console.log('Backend connected:', data);
      })
      .catch(err => {
        console.error('Backend connection failed:', err);
        toast({
          title: "Backend Connection Failed",
          description: "Please ensure the backend server is running on port 5001",
          variant: "destructive"
        });
      });
  }, []);

  const handleSearch = async () => {
    if (!jobTitle.trim() || !location.trim()) {
      toast({
        title: "Missing Required Fields",
        description: "Please enter both job title and location.",
        variant: "destructive"
      });
      return;
    }

    // Check credits
    if (currentUser.credits < currentTierConfig.credits) {
      toast({
        title: "Insufficient Credits",
        description: `You need ${currentTierConfig.credits} credits for ${currentTierConfig.name} search. You have ${currentUser.credits}.`,
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    setProgressValue(0);
    
    try {
      // Animate progress
      const progressIntervals = [15, 35, 60, 85, 100];
      progressIntervals.forEach((value, index) => {
        setTimeout(() => setProgressValue(value), index * 600);
      });

      const formData = new FormData();
      formData.append('jobTitle', jobTitle.trim());
      formData.append('company', company.trim() || '');
      formData.append('location', location.trim());
      formData.append('tier', userTier);
      formData.append('userEmail', currentUser.email);
      
      if (uploadedFile && userTier === 'pro') {
        formData.append('resume', uploadedFile);
      }

      // Map tier to endpoint
      let endpoint = '/api/basic-run';
      if (userTier === 'starter') {
        endpoint = '/api/advanced-run';
      } else if (userTier === 'pro') {
        endpoint = '/api/pro-run';
      }

      const response = await fetch(`${BACKEND_URL}${endpoint}?format=json`, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Search failed');
      }

      const data = await response.json();
      setLastResults(data.contacts || []);
      setLastResultsTier(data.tier || userTier);

      if (data.csv_content) {
        const blob = new Blob([data.csv_content], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `offerloop-${data.tier || userTier}-${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      toast({
        title: "Search Complete!",
        description: `Your ${currentTierConfig.name} tier CSV with up to ${currentTierConfig.maxContacts} contacts has been downloaded.`
      });
      
      // Deduct credits (mock)
      currentUser.credits -= currentTierConfig.credits;
      
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: "Search Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
      setProgressValue(0);
    }
  };

  const mapToDirectoryContact = (c: any) => ({
    firstName: c.FirstName || '',
    lastName: c.LastName || '',
    linkedinUrl: c.LinkedIn || '',
    email: c.Email || c.WorkEmail || c.PersonalEmail || '',
    company: c.Company || '',
    jobTitle: c.Title || '',
    college: c.College || '',
    location: [c.City, c.State].filter(Boolean).join(', ')
  });

  const handleSaveToDirectory = async () => {
    try {
      if (!hasResults) return;
      const mapped = lastResults.map(mapToDirectoryContact);
      const resp = await fetch(`${BACKEND_URL}/api/contacts/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.email || 'test@example.com',
          contacts: mapped
        })
      });

      if (!resp.ok) {
        const errData = await resp.json();
        throw new Error(errData.error || 'Failed to save contacts');
      }
      const data = await resp.json();
      toast({
        title: "Saved to Contact Directory",
        description: `Created ${data.created}, skipped ${data.skipped} duplicates.`
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Save Failed",
        description: e instanceof Error ? e.message : "Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload a PDF smaller than 10MB.",
          variant: "destructive"
        });
        return;
      }
      setUploadedFile(file);
      toast({
        title: "Resume Uploaded",
        description: "Resume will be used for similarity matching in Pro tier."
      });
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF file.",
        variant: "destructive"
      });
    }
  };

  const handleCoffeeChatSubmit = () => {
    if (!linkedinUrl.trim()) {
      toast({
        title: "Missing LinkedIn URL",
        description: "Please enter a LinkedIn profile URL.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Coffee Chat Prep Started",
      description: "Generating PDF with available LinkedIn information...",
    });
  };

  const handleInterviewPrepSubmit = () => {
    if (!jobPostUrl.trim()) {
      toast({
        title: "Missing Job Post URL",
        description: "Please enter a job posting URL.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Interview Prep Started",
      description: "Generating PDF and prep materials...",
    });
  };

  const handleJobTitleSuggestion = (suggestedTitle: string) => {
    setJobTitle(suggestedTitle);
    toast({
      title: "Job Title Updated",
      description: `Set job title to "${suggestedTitle}"`,
    });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-900 text-white">
        <AppSidebar />
        
        <div className={`flex-1 transition-all duration-300 ${isScoutChatOpen ? 'mr-80' : ''}`}>
          {/* Header */}
          <header className="h-16 flex items-center justify-between border-b border-gray-800 px-6 bg-gray-900/80 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-white hover:bg-gray-800/50" />
              <h1 className="text-xl font-semibold">AI-Powered Candidate Search</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">{currentUser.credits.toLocaleString()} credits</span>
              </div>
              
              
              <Button 
                size="sm" 
                onClick={() => navigate('/pricing')}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                Upgrade
              </Button>
            </div>
          </header>
          
          {/* Scout Chat Button */}
          <div className="px-8 pt-4">
            <div className="max-w-7xl mx-auto">
              <div 
                onClick={() => setIsScoutChatOpen(!isScoutChatOpen)}
                className="group cursor-pointer bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-500/30 hover:border-blue-400/50 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden animate-pulse" style={{ backgroundColor: '#fff6e2' }}>
                      <img 
                        src="/scout-mascot.png" 
                        alt="Scout AI" 
                        className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
                        style={{
                          animation: 'wave 2.5s ease-in-out infinite',
                          transformOrigin: 'center bottom'
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors">Talk to Scout</h3>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Get help with job titles and search</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                      {isScoutChatOpen ? 'Close' : 'Open'}
                    </div>
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2 group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300 group-hover:scale-110">
                      {isScoutChatOpen ? (
                        <ChevronRight className="h-5 w-5 text-white" />
                      ) : (
                        <ChevronLeft className="h-5 w-5 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <main className="p-8">
            <div className="max-w-7xl mx-auto">
              
              {/* Tier Display */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    {userTier === 'pro' && <Crown className="h-5 w-5 text-yellow-400" />}
                    <h2 className="text-2xl font-bold text-white">{currentTierConfig.name}</h2>
                  </div>
                  <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0">
                    {currentTierConfig.credits} credits
                  </Badge>
                </div>
                
                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-400">{currentTierConfig.description}</p>
                </div>
              </div>

              {/* Tab Navigation */}
              <Tabs defaultValue="find-candidates" className="mb-8">
                <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 border border-gray-700">
                  <TabsTrigger 
                    value="find-candidates"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-gray-300 hover:text-white transition-all"
                  >
                    Professional Search
                  </TabsTrigger>
                  <TabsTrigger 
                    value="coffee-chat"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white text-gray-300 hover:text-white transition-all"
                  >
                    Coffee Chat Prep
                  </TabsTrigger>
                  <TabsTrigger 
                    value="interview-prep"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-gray-300 hover:text-white transition-all"
                  >
                    Interview Prep
                  </TabsTrigger>
                </TabsList>

                {/* Find Candidates Tab Content */}
                <TabsContent value="find-candidates" className="mt-6">
                  <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                    <CardHeader className="border-b border-gray-700">
                      <CardTitle className="text-xl text-white">Professional Search</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      {/* Main Search Inputs with Autocomplete */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-white">
                            Job Title <span className="text-red-400">*</span>
                          </label>
                          <AutocompleteInput
                            value={jobTitle}
                            onChange={setJobTitle}
                            placeholder="e.g., Software Engineer"
                            dataType="job_title"
                            disabled={isSearching}
                            className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500 hover:border-purple-400 transition-colors"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2 text-white">Company</label>
                          <AutocompleteInput
                            value={company}
                            onChange={setCompany}
                            placeholder="e.g., Google (optional)"
                            dataType="company"
                            disabled={isSearching}
                            className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500 hover:border-purple-400 transition-colors"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2 text-white">
                            Location <span className="text-red-400">*</span>
                          </label>
                          <AutocompleteInput
                            value={location}
                            onChange={setLocation}
                            placeholder="e.g., San Francisco, CA"
                            dataType="location"
                            disabled={isSearching}
                            className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500 hover:border-purple-400 transition-colors"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2 text-white">College Alumni</label>
                          <AutocompleteInput
                            value={collegeAlumni}
                            onChange={setCollegeAlumni}
                            placeholder="e.g., Stanford University (optional)"
                            dataType="school"
                            disabled={isSearching}
                            className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500 hover:border-purple-400 transition-colors"
                          />
                        </div>
                      </div>

                      {/* Resume Upload for Pro tier only */}
                      {userTier === 'pro' && (
                        <div className="mb-6">
                          <label className="block text-sm font-medium mb-2 text-white">
                            Resume (Optional - for AI similarity matching)
                          </label>
                          <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-purple-400 transition-colors bg-gray-800/30">
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={handleFileUpload}
                              className="hidden"
                              id="resume-upload"
                              disabled={isSearching}
                            />
                            <label htmlFor="resume-upload" className={`cursor-pointer ${isSearching ? 'opacity-50 cursor-not-allowed' : ''}`}>
                              <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                              <p className="text-sm text-gray-300 mb-1">
                                {uploadedFile ? uploadedFile.name : 'Upload resume for AI similarity matching'}
                              </p>
                              <p className="text-xs text-gray-400">PDF only, max 10MB</p>
                            </label>
                          </div>
                        </div>
                      )}

                      {/* Search Button */}
                      <div className="flex items-center justify-between">
                        <Button 
                          onClick={handleSearch}
                          disabled={!jobTitle.trim() || !location.trim() || isSearching}
                          size="lg"
                          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium px-8 transition-all hover:scale-105"
                        >
                          {isSearching ? 'Searching...' : `Search ${currentTierConfig.name} Tier (${currentTierConfig.credits} credits)`}
                        </Button>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-gray-400">
                            <Download className="h-4 w-4 inline mr-2" />
                            CSV with up to {currentTierConfig.maxContacts} contacts
                          </div>
                          <Button
                            variant="outline"
                            disabled={!hasResults}
                            onClick={handleSaveToDirectory}
                            className="border-blue-500 text-blue-300 hover:bg-blue-500/10"
                            title={hasResults ? `Save ${lastResults.length} to Contact Directory` : 'Search to enable saving'}
                          >
                            Save to Contact Directory
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Coffee Chat Prep Tab Content */}
                <TabsContent value="coffee-chat" className="mt-6">
                  <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                    <CardHeader className="border-b border-gray-700">
                      <CardTitle className="text-xl text-white flex items-center gap-2">
                        Coffee Chat Prep
                        {currentTierConfig.coffeeChat && (
                          <Badge variant="outline" className="text-green-400 border-green-400">
                            Available
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      {currentTierConfig.coffeeChat ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                              LinkedIn Profile URL
                            </label>
                            <Input
                              value={linkedinUrl}
                              onChange={(e) => setLinkedinUrl(e.target.value)}
                              placeholder="https://linkedin.com/in/username"
                              className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500"
                            />
                          </div>
                          <p className="text-sm text-gray-400">
                            Generate a PDF with all available information from the LinkedIn profile to help you prepare for your coffee chat.
                          </p>
                          <Button
                            onClick={handleCoffeeChatSubmit}
                            disabled={!linkedinUrl.trim()}
                            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Generate Coffee Chat PDF
                          </Button>
                        </div>
                      ) : (
                        <LockedFeatureOverlay featureName="Coffee Chat Prep" requiredTier="Starter+">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-2 text-white">
                                LinkedIn Profile URL
                              </label>
                              <Input
                                placeholder="https://linkedin.com/in/username"
                                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                                disabled
                              />
                            </div>
                            <p className="text-sm text-gray-400">
                              Generate a PDF with all available information from the LinkedIn profile.
                            </p>
                            <Button className="w-full" disabled>
                              <Download className="h-4 w-4 mr-2" />
                              Generate Coffee Chat PDF
                            </Button>
                          </div>
                        </LockedFeatureOverlay>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Interview Prep Tab Content */}
                <TabsContent value="interview-prep" className="mt-6">
                  <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                    <CardHeader className="border-b border-gray-700">
                      <CardTitle className="text-xl text-white flex items-center gap-2">
                        Interview Prep
                        {currentTierConfig.interviewPrep && (
                          <Badge variant="outline" className="text-green-400 border-green-400">
                            Available
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      {currentTierConfig.interviewPrep ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                              Job Post URL
                            </label>
                            <Input
                              value={jobPostUrl}
                              onChange={(e) => setJobPostUrl(e.target.value)}
                              placeholder="https://company.com/jobs/position"
                              className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500"
                            />
                          </div>
                          <p className="text-sm text-gray-400">
                            Generate a PDF with job analysis and a separate prep section with materials to help you succeed in the interview.
                          </p>
                          <Button
                            onClick={handleInterviewPrepSubmit}
                            disabled={!jobPostUrl.trim()}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Generate Interview Prep
                          </Button>
                        </div>
                      ) : (
                        <LockedFeatureOverlay featureName="Interview Prep" requiredTier="Pro">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-2 text-white">
                                Job Post URL
                              </label>
                              <Input
                                placeholder="https://company.com/jobs/position"
                                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                                disabled
                              />
                            </div>
                            <p className="text-sm text-gray-400">
                              Generate a PDF with job analysis and prep materials.
                            </p>
                            <Button className="w-full" disabled>
                              <Download className="h-4 w-4 mr-2" />
                              Generate Interview Prep
                            </Button>
                          </div>
                        </LockedFeatureOverlay>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Search Progress */}
              {isSearching && (
                <Card className="mb-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">Searching with {currentTierConfig.name} tier...</span>
                        <span className="text-blue-400">{progressValue}%</span>
                      </div>
                      <Progress value={progressValue} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </div>

        {/* Scout Chatbot */}
        {isScoutChatOpen && (
          <div className="fixed right-0 top-0 h-full w-80 bg-gray-900 shadow-2xl z-40 border-l border-gray-700">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-blue-500 to-purple-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#fff6e2' }}>
                      <img 
                        src="/scout-mascot.png" 
                        alt="Scout AI" 
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Scout AI</h3>
                      <p className="text-xs text-white/80">Job Title Assistant</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsScoutChatOpen(false)}
                    className="text-white/80 hover:text-white hover:bg-white/10"
                  >
                    ×
                  </Button>
                </div>
              </div>
              <div className="flex-1">
                <ScoutChatbot onJobTitleSuggestion={handleJobTitleSuggestion} />
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarProvider>
  );
};

export default Home;
