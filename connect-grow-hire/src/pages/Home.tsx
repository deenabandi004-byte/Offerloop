import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Upload, Download, Zap, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AutocompleteInput } from "@/components/AutocompleteInput";
import ScoutChatbot from "@/components/ScoutChatbot";

const BACKEND_URL = 'http://localhost:5001';

const TIER_CONFIGS = {
  free: {
    maxContacts: 4,
    name: 'Free',
    credits: 500,
    description: 'Basic search - 4 contacts'
  },
  starter: {
    maxContacts: 6,
    name: 'Starter',
    credits: 1000,
    description: 'Advanced search - 6 contacts + Email drafts'
  },
  pro: {
    maxContacts: 8,
    name: 'Pro',
    credits: 2000,
    description: 'Full search - 8 contacts + Resume matching'
  }
};

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Tier selection
  const [selectedTier, setSelectedTier] = useState<'free' | 'starter' | 'pro'>('free');
  
  // Form state
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  // Search state
  const [isSearching, setIsSearching] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  
  // Mock user data
  const mockUser = {
    credits: 8450,
    maxCredits: 10000,
    name: 'Sarah Chen',
    email: 'sarah@example.com'
  };

  const currentTierConfig = TIER_CONFIGS[selectedTier];

  const handleJobTitleSuggestion = (jobTitle: string) => {
    setJobTitle(jobTitle);
  };

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
    if (mockUser.credits < currentTierConfig.credits) {
      toast({
        title: "Insufficient Credits",
        description: `You need ${currentTierConfig.credits} credits for ${currentTierConfig.name} search. You have ${mockUser.credits}.`,
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
      formData.append('tier', selectedTier);
      formData.append('userEmail', mockUser.email);
      
      if (uploadedFile && selectedTier === 'pro') {
        formData.append('resume', uploadedFile);
      }

      // Map tier to endpoint
      let endpoint = '/api/basic-run';
      if (selectedTier === 'starter') {
        endpoint = '/api/advanced-run';
      } else if (selectedTier === 'pro') {
        endpoint = '/api/pro-run';
      }

      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Search failed');
      }

      // Direct CSV download
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `offerloop-${selectedTier}-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Search Complete!",
        description: `Your ${currentTierConfig.name} tier CSV with up to ${currentTierConfig.maxContacts} contacts has been downloaded.`
      });
      
      // Deduct credits (mock)
      mockUser.credits -= currentTierConfig.credits;
      
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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-900 text-white">
        <AppSidebar />
        
        <div className="flex-1">
          {/* Header */}
          <header className="h-16 flex items-center justify-between border-b border-gray-800 px-6 bg-gray-900/80 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-white hover:bg-gray-800/50" />
              <h1 className="text-xl font-semibold">AI-Powered Candidate Search</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">{mockUser.credits.toLocaleString()} credits</span>
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
          
          <main className="p-8">
            <div className="max-w-7xl mx-auto">
              
              {/* Tier Selection Tabs */}
              <div className="mb-6">
                <Tabs value={selectedTier} onValueChange={(value) => setSelectedTier(value as 'free' | 'starter' | 'pro')}>
                  <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                    <TabsTrigger 
                      value="free" 
                      className="transition-all hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:-translate-y-px data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500"
                    >
                      <span className="font-medium">Free</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="starter" 
                      className="transition-all hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:-translate-y-px data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500"
                    >
                      <span className="font-medium">Starter</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="pro" 
                      className="transition-all hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:-translate-y-px data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500"
                    >
                      <div className="flex items-center gap-1">
                        <Crown className="h-3 w-3 text-yellow-400" />
                        <span className="font-medium">Pro</span>
                      </div>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                {/* Tier Features */}
                <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{currentTierConfig.name} Tier Selected</h3>
                      <p className="text-sm text-gray-400 mt-1">{currentTierConfig.description}</p>
                    </div>
                    <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0">
                      {currentTierConfig.credits} credits
                    </Badge>
                  </div>
                  
                  {selectedTier === 'starter' && (
                    <p className="text-sm text-green-400 mt-2">✓ Includes email draft generation</p>
                  )}
                  {selectedTier === 'pro' && (
                    <>
                      <p className="text-sm text-green-400 mt-2">✓ Includes email drafts + resume similarity matching</p>
                    </>
                  )}
                </div>
              </div>
              
              {/* Search Form */}
              <Card className="mb-8 bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader className="border-b border-gray-700">
                  <CardTitle className="text-xl text-white">Find Candidates</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Main Search Inputs with Autocomplete */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
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
                  </div>

                  {/* Resume Upload for Pro tier only */}
                  {selectedTier === 'pro' && (
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
                    
                    <div className="text-sm text-gray-400">
                      <Download className="h-4 w-4 inline mr-2" />
                      CSV with up to {currentTierConfig.maxContacts} contacts
                    </div>
                  </div>
                </CardContent>
              </Card>

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
      </div>
      
      <ScoutChatbot onJobTitleSuggestion={handleJobTitleSuggestion} />
    </SidebarProvider>
  );
};

export default Home;
