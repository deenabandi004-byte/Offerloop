// src/components/ContactSearchForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Download, Mail, Users, LogIn, Check, X } from "lucide-react";
import { apiService, type ContactSearchRequest, type ProContactSearchRequest } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useFirebaseAuth } from '../contexts/FirebaseAuthContext';
import ScoutChatbot from './ScoutChatbot';

const searchSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().min(1, "Location is required"),
  tier: z.enum(["free", "pro"]),
  resume: z.any().optional(),
});

type SearchFormData = z.infer<typeof searchSchema>;

export const ContactSearchForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saveToDirectory, setSaveToDirectory] = useState(true);
  const { toast } = useToast();
  const { user, signIn, updateUser } = useFirebaseAuth();
  const isSignedIn = !!user;
  
  const CREDITS_PER_CONTACT = 15;
  const getMonthlyLimit = (tier: 'free' | 'pro') => (tier === 'free' ? 8 : 56);

  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      jobTitle: "",
      company: "",
      location: "",
      tier: "free",
    },
  });

  const selectedTier = form.watch("tier");

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  // Scout chatbot integration - handle job title suggestions
  const handleJobTitleSuggestion = (jobTitle: string) => {
    form.setValue('jobTitle', jobTitle);
    toast({
      title: "Job Title Updated",
      description: `Set job title to: ${jobTitle}`,
    });
  };

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
      toast({
        title: "Sign In Failed",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: SearchFormData) => {
    if (!isSignedIn || !user) {
      setError('Please sign in with Google to use Offerloop.ai');
      toast({
        title: "Authentication Required",
        description: "Please sign in with Google to search for contacts",
        variant: "destructive",
      });
      return;
    }

    const contactsCount = tierFeatures[data.tier].contacts;
    const creditsNeeded = contactsCount * CREDITS_PER_CONTACT;

    if ((user.credits ?? 0) < creditsNeeded) {
      setError(`Not enough credits. You need ${creditsNeeded} credits for this run.`);
      toast({ 
        title: "Insufficient Credits", 
        description: `You need ${creditsNeeded} credits.`, 
        variant: "destructive" 
      });
      return;
    }

    if (data.tier !== "free") {
      const monthlyLimit = getMonthlyLimit(user.tier);
      const used = user.emailsUsedThisMonth || 0;
      if (used + contactsCount > monthlyLimit) {
        setError(`Monthly email limit reached (${used}/${monthlyLimit}).`);
        toast({ 
          title: "Monthly Email Limit", 
          description: `You have ${monthlyLimit - used} emails left this month.`, 
          variant: "destructive" 
        });
        return;
      }
    }

    setIsLoading(true);
    clearMessages();

    try {
      const baseRequest: ContactSearchRequest = {
        jobTitle: data.jobTitle,
        company: data.company,
        location: data.location,
        uid: user.uid,
        saveToDirectory,
      };

      let csvBlob: Blob;
      let filename: string;
      let successMessage: string;

      switch (data.tier) {
        case "free":
          csvBlob = await apiService.runFreeSearch(baseRequest);
          filename = `Offerloop_Free_${new Date().toISOString().slice(0, 10)}.csv`;
          successMessage = "Free search completed! CSV file downloaded.";
          break;
        
        case "pro":
          if (!selectedFile) {
            toast({
              title: "Resume Required",
              description: "Please upload a resume for Pro tier search",
              variant: "destructive",
            });
            return;
          }
          const proRequest: ProContactSearchRequest = { ...baseRequest, resume: selectedFile };
          csvBlob = await apiService.runProSearch(proRequest);
          filename = `Offerloop_Pro_${new Date().toISOString().slice(0, 10)}.csv`;
          successMessage = "Pro search completed! CSV file downloaded with resume analysis and smart emails created in your Gmail.";
          break;
        
        default:
          throw new Error("Invalid tier selected");
      }

      apiService.downloadCsv(csvBlob, filename);
      setSuccess(successMessage);

      toast({
        title: "Search Complete!",
        description: successMessage,
      });

      const emailsToCount = data.tier === "free" ? 0 : tierFeatures[data.tier].contacts;
      const monthKey = new Date().toISOString().slice(0, 7);

      const nextCredits = Math.max(0, (user.credits ?? 0) - creditsNeeded);
      const nextUsed = (user.emailsMonthKey === monthKey ? (user.emailsUsedThisMonth || 0) : 0) + emailsToCount;

      updateUser({
        credits: nextCredits,
        emailsUsedThisMonth: nextUsed,
        emailsMonthKey: monthKey,
      });

      // Reset form
      form.reset();
      setSelectedFile(null);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: "Search Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF file",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const tierFeatures = {
    free: {
      contacts: 8,
      features: ["Basic contact info", "CSV export", "Contact library"],
      color: "bg-blue-500",
      icon: <Users className="h-4 w-4" />,
    },
    pro: {
      contacts: 56,
      features: ["Resume analysis", "AI emails", "Similarity engine", "Smart subjects"],
      color: "bg-purple-500",
      icon: <Upload className="h-4 w-4" />,
    },
  };

  // Show sign-in prompt if user is not authenticated
  if (!isSignedIn) {
    return (
      <>
        {/* Scout chatbot available even when not signed in */}
        <ScoutChatbot onJobTitleSuggestion={handleJobTitleSuggestion} />
        
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Find Your Next Connection</CardTitle>
            <p className="text-muted-foreground">
              Sign in with Google to access AI-powered recruiting tools
            </p>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="mb-6">
              <LogIn className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Google Authentication Required</h3>
              <p className="text-muted-foreground mb-6">
                Offerloop.ai creates personalized email drafts directly in your Gmail account. 
                Sign in to get started with AI-powered recruiting.
              </p>
            </div>
            
            <Button onClick={handleSignIn} size="lg" className="min-w-48">
              <LogIn className="mr-2 h-5 w-5" />
              Sign In with Google
            </Button>
            
            <div className="mt-6 text-sm text-muted-foreground">
              <p>Find high-quality contacts with PDL database</p>
              <p>Generate personalized networking emails with AI</p>
              <p>Create drafts directly in your Gmail account</p>
              <p><strong>Tip:</strong> Use Scout (bottom-left) for job title suggestions!</p>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      {/* Scout chatbot - always available when signed in */}
      <ScoutChatbot onJobTitleSuggestion={handleJobTitleSuggestion} />
      
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-between">
            Find Your Next Connection
            <div className="flex items-center gap-2 text-sm font-normal">
              <div className="w-6 h-6 rounded-full overflow-hidden">
                <img src={user?.picture} alt={user?.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-muted-foreground">{user?.email}</span>
            </div>
          </CardTitle>
          <p className="text-center text-muted-foreground">
            Search for professionals and get personalized outreach campaigns
          </p>
          <div className="text-center text-sm text-blue-600 font-medium">
            Need help with job titles? Ask Scout in the bottom-left corner!
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-6 border-destructive bg-destructive/10">
              <X className="h-4 w-4" />
              <AlertDescription className="text-destructive">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 border-green-500 bg-green-50">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Tier Selection */}
              <FormField
                control={form.control}
                name="tier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Tier</FormLabel>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(tierFeatures).map(([tier, info]) => (
                        <div
                          key={tier}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            field.value === tier
                              ? "border-primary bg-primary/10"
                              : "border-muted hover:border-primary/50"
                          }`}
                          onClick={() => field.onChange(tier)}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {info.icon}
                            <span className="font-semibold capitalize">{tier}</span>
                          </div>
                          <Badge variant="outline" className="mb-2">
                            {info.contacts} contacts
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            {info.features.map((feature, idx) => (
                              <div key={idx}>• {feature}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gmail Integration Status */}
              {selectedTier === "pro" && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-purple-800 text-sm font-medium mb-2">
                    <Check className="h-4 w-4" />
                    Pro Features Active
                  </div>
                  <div className="text-purple-700 text-sm">
                    <div>Resume analysis & similarity matching</div>
                    <div>Smart personalized emails in: <strong>{user?.email || "your inbox"}</strong></div>
                    <div>Advanced contact enrichment</div>
                  </div>
                </div>
              )}

              {/* Search Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Investment Banking Analyst" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Goldman Sachs" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="New York, NY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Resume Upload for Pro Tier */}
              {selectedTier === "pro" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Resume (PDF)</label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <div className="mt-4">
                        <label htmlFor="resume-upload" className="cursor-pointer">
                          <span className="text-sm font-medium text-primary hover:text-primary/80">
                            Upload your resume
                          </span>
                          <input
                            id="resume-upload"
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">PDF files only</p>
                      </div>
                      {selectedFile && (
                        <div className="mt-2 text-sm text-green-600">
                          {selectedFile.name} selected
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 mb-4">
                <input 
                  id="save-dir" 
                  type="checkbox" 
                  checked={saveToDirectory}
                  onChange={(e) => setSaveToDirectory(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="save-dir" className="text-sm text-muted-foreground">
                  Save results to your Contact Library
                </label>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                {isLoading ? (
                  selectedTier === "free" ? "Searching..." :
                  "Analyzing Resume & Creating Smart Emails..."
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Find Matches
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};