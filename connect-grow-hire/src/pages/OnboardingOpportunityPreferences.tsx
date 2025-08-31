import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import * as z from "zod";

const formSchema = z.object({
  industries: z.array(z.string()).optional(),
  jobRole: z.string().optional(),
  customJobRole: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const OnboardingOpportunityPreferences = () => {
  const navigate = useNavigate();
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [showCustomJobRole, setShowCustomJobRole] = useState(false);
  const [showCustomIndustry, setShowCustomIndustry] = useState(false);
  const [customIndustry, setCustomIndustry] = useState("");
  const [openIndustries, setOpenIndustries] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      industries: [],
      jobRole: "",
      customJobRole: "",
    },
  });

  const onSubmit = (data: FormData) => {
    const finalIndustries = [...selectedIndustries];
    if (customIndustry && selectedIndustries.includes("Other")) {
      finalIndustries[finalIndustries.indexOf("Other")] = customIndustry;
    }
    console.log("Opportunity preferences form submitted:", { ...data, industries: finalIndustries });
    // Navigate to next onboarding step
    navigate("/onboarding/location-preferences");
  };

  const industries = [
    "Technology & Software",
    "Artificial Intelligence & Machine Learning",
    "Cybersecurity",
    "Data Science & Analytics",
    "Cloud Computing",
    "Financial Services & Banking",
    "Investment Banking",
    "Private Equity & Venture Capital",
    "Insurance",
    "Fintech",
    "Healthcare & Medical",
    "Pharmaceuticals & Biotechnology",
    "Medical Devices",
    "Telemedicine",
    "Mental Health",
    "Consulting",
    "Management Consulting",
    "Strategy Consulting",
    "IT Consulting",
    "Marketing & Advertising",
    "Digital Marketing",
    "Social Media Marketing",
    "Public Relations",
    "Brand Management",
    "Education & Training",
    "Higher Education",
    "K-12 Education",
    "EdTech",
    "Corporate Training",
    "Engineering",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Civil Engineering",
    "Software Engineering",
    "Aerospace Engineering",
    "Government & Public Sector",
    "Federal Government",
    "State & Local Government",
    "Military & Defense",
    "Public Policy",
    "Arts & Entertainment",
    "Film & Television",
    "Music Industry",
    "Gaming & Esports",
    "Publishing",
    "Nonprofit & Social Impact",
    "Environmental Organizations",
    "Human Rights",
    "Community Development",
    "Retail & E-commerce",
    "Fashion & Apparel",
    "Consumer Goods",
    "Luxury Goods",
    "Manufacturing",
    "Automotive",
    "Electronics Manufacturing",
    "Food & Beverage Manufacturing",
    "Textiles",
    "Media & Communications",
    "Journalism",
    "Broadcasting",
    "Telecommunications",
    "Real Estate",
    "Commercial Real Estate",
    "Residential Real Estate",
    "Property Management",
    "Real Estate Investment",
    "Energy & Utilities",
    "Renewable Energy",
    "Oil & Gas",
    "Electric Utilities",
    "Solar & Wind Energy",
    "Transportation & Logistics",
    "Airlines",
    "Shipping & Freight",
    "Public Transportation",
    "Ride Sharing",
    "Hospitality & Tourism",
    "Hotels & Resorts",
    "Restaurants & Food Service",
    "Travel & Tourism",
    "Event Planning",
    "Legal Services",
    "Corporate Law",
    "Criminal Law",
    "Family Law",
    "Intellectual Property",
    "Agriculture & Food",
    "Farming & Agriculture",
    "Food Production",
    "Organic Foods",
    "Sports & Recreation",
    "Professional Sports",
    "Fitness & Wellness",
    "Outdoor Recreation",
    "Construction & Architecture",
    "Residential Construction",
    "Commercial Construction",
    "Architecture & Design",
    "Mining & Natural Resources",
    "Chemicals & Materials",
    "Aerospace & Defense",
    "Maritime & Shipping",
    "Other"
  ];

  const jobRoles = [
    "Software Engineer",
    "Data Scientist",
    "Product Manager",
    "Business Analyst",
    "Financial Analyst",
    "Marketing Specialist",
    "Sales Representative",
    "Consultant",
    "Project Manager",
    "UX/UI Designer",
    "Research Analyst",
    "Operations Specialist",
    "Customer Success Manager",
    "Account Manager",
    "HR Specialist",
    "Recruiter",
    "Content Creator",
    "Social Media Manager",
    "Digital Marketing Specialist",
    "SEO Specialist",
    "Graphic Designer",
    "Web Developer",
    "Mobile App Developer",
    "DevOps Engineer",
    "Cybersecurity Analyst",
    "Database Administrator",
    "System Administrator",
    "Network Engineer",
    "Quality Assurance Analyst",
    "Technical Writer",
    "Business Development Representative",
    "Inside Sales Representative",
    "Account Executive",
    "Customer Support Representative",
    "Administrative Assistant",
    "Executive Assistant",
    "Office Manager",
    "Coordinator",
    "Specialist",
    "Associate",
    "Analyst",
    "Manager",
    "Director",
    "Vice President",
    "Intern",
    "Entry Level",
    "Junior",
    "Senior",
    "Lead",
    "Principal"
  ];

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev => 
      prev.includes(industry) 
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
    
    if (industry === "Other") {
      setShowCustomIndustry(!selectedIndustries.includes(industry));
      if (selectedIndustries.includes(industry)) {
        setCustomIndustry("");
      }
    }
  };

  const handleJobRoleChange = (value: string) => {
    form.setValue("jobRole", value);
    setShowCustomJobRole(value === "other");
    if (value !== "other") {
      form.setValue("customJobRole", "");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/onboarding/academics")}
        className="absolute top-6 left-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      
      <div className="w-full max-w-2xl space-y-4">
        <Progress value={60} className="w-full" />
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Career Interests</CardTitle>
            <p className="text-muted-foreground">Help us personalize your experience</p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Industries of Interest</h3>
                  <p className="text-sm text-muted-foreground">Select all industries that interest you</p>
                  
                  <Popover open={openIndustries} onOpenChange={setOpenIndustries}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          selectedIndustries.length === 0 && "text-muted-foreground"
                        )}
                      >
                        {selectedIndustries.length === 0
                          ? "Select industries..."
                          : `${selectedIndustries.length} selected`}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search industries..." />
                        <CommandList>
                          <CommandEmpty>No industry found.</CommandEmpty>
                          <CommandGroup>
                            {industries.map((industry) => (
                              <CommandItem
                                value={industry}
                                key={industry}
                                onSelect={() => {
                                  toggleIndustry(industry);
                                  // Don't close the dropdown to allow multiple selections
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedIndustries.includes(industry)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {industry}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {selectedIndustries.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedIndustries.map((industry) => (
                        <Badge 
                          key={industry} 
                          variant="secondary" 
                          className="text-xs cursor-pointer hover:bg-secondary/80"
                          onClick={() => toggleIndustry(industry)}
                        >
                          {industry} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {showCustomIndustry && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Custom Industry</label>
                    <Input 
                      placeholder="Enter your industry of interest" 
                      value={customIndustry}
                      onChange={(e) => setCustomIndustry(e.target.value)}
                    />
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="jobRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Job Roles/Titles (Optional)</FormLabel>
                      <Select onValueChange={handleJobRoleChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a job role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {jobRoles.map((role) => (
                            <SelectItem key={role} value={role.toLowerCase().replace(/\s+/g, '-')}>
                              {role}
                            </SelectItem>
                          ))}
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {showCustomJobRole && (
                  <FormField
                    control={form.control}
                    name="customJobRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Job Role</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your preferred job role" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button type="submit" className="w-full" size="lg">
                  Next
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingOpportunityPreferences;
