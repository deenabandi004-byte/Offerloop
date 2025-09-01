import { useState } from "react";
import { Check, X, ArrowLeft, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Perfect for getting started",
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
      popular: false,
      features: {
        creditsPerMonth: "500",
        batchSize: "4",
        monthlyReachOuts: "20",
        seats: "–",
        gmailDrafts: false,
        infoAutoInserted: "Basic fields",
        starterEmailWriter: false,
        proEmailWriter: false,
      }
    },
    {
      name: "Starter",
      price: "$47",
      period: "/month",
      description: "For growing professionals",
      buttonText: "Upgrade Plan",
      buttonVariant: "default" as const,
      popular: false,
      features: {
        creditsPerMonth: "11,000",
        batchSize: "6",
        monthlyReachOuts: "96",
        seats: "–",
        gmailDrafts: true,
        infoAutoInserted: "All fields",
        starterEmailWriter: true,
        proEmailWriter: false,
      }
    },
    {
      name: "Pro",
      price: "$97",
      period: "/month",
      description: "For serious networking",
      buttonText: "Upgrade Plan",
      buttonVariant: "default" as const,
      popular: true,
      features: {
        creditsPerMonth: "31,000",
        batchSize: "8",
        monthlyReachOuts: "160",
        seats: "–",
        gmailDrafts: true,
        infoAutoInserted: "All fields",
        starterEmailWriter: true,
        proEmailWriter: true,
      }
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For teams and organizations",
      buttonText: "Contact Us",
      buttonVariant: "outline" as const,
      popular: false,
      features: {
        creditsPerMonth: "Custom",
        batchSize: "Custom",
        monthlyReachOuts: "Custom",
        seats: "–",
        gmailDrafts: true,
        infoAutoInserted: "All fields",
        starterEmailWriter: true,
        proEmailWriter: true,
      }
    }
  ];

  const infoFields = [
    "First Name",
    "Last Name", 
    "Email Address",
    "LinkedIn URL",
    "College",
    "Location",
    "Company",
    "Hometown",
    "Work Experience",
    "Volunteer Work",
    "Clubs",
    "Interests"
  ];

  const getFieldAccess = (planName: string, field: string) => {
    if (planName === "Free") {
      return ["First Name", "Last Name", "Email Address", "LinkedIn URL"].includes(field);
    }
    if (planName === "Starter") {
      return ["First Name", "Last Name", "Email Address", "LinkedIn URL", "College", "Location", "Company"].includes(field);
    }
    return true; // Pro and Enterprise get all fields
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header with back button */}
      <div className="container mx-auto px-6 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/home")}
          className="mb-8 hover:bg-accent"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CreditCard className="h-8 w-8 text-primary" />
            <span className="text-sm font-medium text-primary">Our Pricing</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Choose a plan to match your needs
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Upgrade or cancel subscriptions anytime. All prices are USD.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm ${!isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Annual
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative h-full transition-all hover:shadow-soft ${
                plan.popular ? 'border-primary ring-2 ring-primary/20' : 'border-border'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-lg font-semibold mb-2">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <Button 
                  className="w-full mb-6" 
                  variant={plan.buttonVariant}
                  onClick={() => plan.name === "Enterprise" ? navigate("/contact") : navigate("/onboarding/resume-upload")}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Comparison Table */}
        <div className="bg-card rounded-lg border shadow-card overflow-hidden mb-16">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-center">Plan Comparison</h2>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/4">Feature</TableHead>
                <TableHead className="text-center">Free</TableHead>
                <TableHead className="text-center">Starter</TableHead>
                <TableHead className="text-center bg-primary/5">Pro</TableHead>
                <TableHead className="text-center">Enterprise</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Credits per Month</TableCell>
                <TableCell className="text-center">{plans[0].features.creditsPerMonth}</TableCell>
                <TableCell className="text-center">{plans[1].features.creditsPerMonth}</TableCell>
                <TableCell className="text-center bg-primary/5">{plans[2].features.creditsPerMonth}</TableCell>
                <TableCell className="text-center">{plans[3].features.creditsPerMonth}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Batch Size (per run)</TableCell>
                <TableCell className="text-center">{plans[0].features.batchSize}</TableCell>
                <TableCell className="text-center">{plans[1].features.batchSize}</TableCell>
                <TableCell className="text-center bg-primary/5">{plans[2].features.batchSize}</TableCell>
                <TableCell className="text-center">{plans[3].features.batchSize}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Monthly Reach Outs</TableCell>
                <TableCell className="text-center">{plans[0].features.monthlyReachOuts}</TableCell>
                <TableCell className="text-center">{plans[1].features.monthlyReachOuts}</TableCell>
                <TableCell className="text-center bg-primary/5">{plans[2].features.monthlyReachOuts}</TableCell>
                <TableCell className="text-center">{plans[3].features.monthlyReachOuts}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Time Saved (per click)</TableCell>
                <TableCell className="text-center">20 minutes</TableCell>
                <TableCell className="text-center">72 minutes</TableCell>
                <TableCell className="text-center bg-primary/5">240 minutes</TableCell>
                <TableCell className="text-center">Custom</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Time Saved (per month)</TableCell>
                <TableCell className="text-center">100 minutes</TableCell>
                <TableCell className="text-center">1,152 minutes</TableCell>
                <TableCell className="text-center bg-primary/5">4,800 minutes</TableCell>
                <TableCell className="text-center">Custom</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Gmail Drafts</TableCell>
                <TableCell className="text-center">
                  {plans[0].features.gmailDrafts ? <Check className="h-4 w-4 text-primary mx-auto" /> : <X className="h-4 w-4 text-muted-foreground mx-auto" />}
                </TableCell>
                <TableCell className="text-center">
                  {plans[1].features.gmailDrafts ? <Check className="h-4 w-4 text-primary mx-auto" /> : <X className="h-4 w-4 text-muted-foreground mx-auto" />}
                </TableCell>
                <TableCell className="text-center bg-primary/5">
                  {plans[2].features.gmailDrafts ? <Check className="h-4 w-4 text-primary mx-auto" /> : <X className="h-4 w-4 text-muted-foreground mx-auto" />}
                </TableCell>
                <TableCell className="text-center">
                  {plans[3].features.gmailDrafts ? <Check className="h-4 w-4 text-primary mx-auto" /> : <X className="h-4 w-4 text-muted-foreground mx-auto" />}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Info Auto-Inserted</TableCell>
                <TableCell className="text-center text-sm">{plans[0].features.infoAutoInserted}</TableCell>
                <TableCell className="text-center text-sm">Limited fields</TableCell>
                <TableCell className="text-center text-sm bg-primary/5">{plans[2].features.infoAutoInserted}</TableCell>
                <TableCell className="text-center text-sm">{plans[3].features.infoAutoInserted}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Starter Email Writer</TableCell>
                <TableCell className="text-center">
                  {plans[0].features.starterEmailWriter ? <Check className="h-4 w-4 text-primary mx-auto" /> : <X className="h-4 w-4 text-muted-foreground mx-auto" />}
                </TableCell>
                <TableCell className="text-center">
                  {plans[1].features.starterEmailWriter ? <Check className="h-4 w-4 text-primary mx-auto" /> : <X className="h-4 w-4 text-muted-foreground mx-auto" />}
                </TableCell>
                <TableCell className="text-center bg-primary/5">
                  {plans[2].features.starterEmailWriter ? <Check className="h-4 w-4 text-primary mx-auto" /> : <X className="h-4 w-4 text-muted-foreground mx-auto" />}
                </TableCell>
                <TableCell className="text-center">
                  {plans[3].features.starterEmailWriter ? <Check className="h-4 w-4 text-primary mx-auto" /> : <X className="h-4 w-4 text-muted-foreground mx-auto" />}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Pro Email Writer</TableCell>
                <TableCell className="text-center">
                  {plans[0].features.proEmailWriter ? <Check className="h-4 w-4 text-primary mx-auto" /> : <X className="h-4 w-4 text-muted-foreground mx-auto" />}
                </TableCell>
                <TableCell className="text-center">
                  {plans[1].features.proEmailWriter ? <Check className="h-4 w-4 text-primary mx-auto" /> : <X className="h-4 w-4 text-muted-foreground mx-auto" />}
                </TableCell>
                <TableCell className="text-center bg-primary/5">
                  {plans[2].features.proEmailWriter ? <Check className="h-4 w-4 text-primary mx-auto" /> : <X className="h-4 w-4 text-muted-foreground mx-auto" />}
                </TableCell>
                <TableCell className="text-center">
                  {plans[3].features.proEmailWriter ? <Check className="h-4 w-4 text-primary mx-auto" /> : <X className="h-4 w-4 text-muted-foreground mx-auto" />}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Email Writer Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="border shadow-card">
            <CardHeader>
              <CardTitle className="text-xl">Starter Email Writer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Crafts a strong, professional email template based on your background and goals. 
                Just add a few details and send.
              </p>
            </CardContent>
          </Card>

          <Card className="border shadow-card bg-primary/5">
            <CardHeader>
              <CardTitle className="text-xl">Pro Email Writer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Uploads your resume and generates a personalized, ready-to-send email that highlights 
                your similarities with the recipient for better results.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Information Fields */}
        <div className="bg-card rounded-lg border shadow-card p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Information Provided</h2>
          <p className="text-center text-muted-foreground mb-8">
            User data that can be auto-inserted into emails for each plan
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div key={plan.name} className={`space-y-4 ${plan.name === 'Pro' ? 'bg-primary/5 p-4 rounded-lg' : ''}`}>
                <h3 className="font-semibold text-center text-lg">{plan.name}</h3>
                <div className="space-y-2">
                  {infoFields.map((field) => (
                    <div key={field} className="flex items-center gap-2">
                      {getFieldAccess(plan.name, field) ? (
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className={`text-sm ${getFieldAccess(plan.name, field) ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {field}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
