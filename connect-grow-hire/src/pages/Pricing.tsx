import React, { useState } from "react";
import { ArrowLeft, CreditCard, X, Check, Clock, Users, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Pricing = () => {
  const navigate = useNavigate();
  const [showProModal, setShowProModal] = useState(false);

  const plans = [
    {
      name: "Free",
      credits: 850,
      emails: 10,
      timeSavedMinutes: 200,
      description: "Try out platform risk free",
      bullets: [
        "850 credits",
        "Estimated time saved: 200 minutes",
        "Try out platform risk free",
        "Limited Features",
      ],
      cta: { label: "Start for free", to: "/onboarding" },
    },
    {
      name: "Pro",
      credits: 4800,
      emails: 56,
      timeSavedMinutes: 1200,
      description: "",
      bullets: [
        "4800 credits",
        "Estimated time saved: 1200 minutes",
        "Everything in free plus:",
        "- Directory permanently saves",
        "- Priority Support",
        "- Advanced features",
      ],
      cta: { label: "Start now", to: "/onboarding/resume-upload" },
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <Button variant="ghost" onClick={() => navigate("/home")} className="mb-8 hover:bg-accent text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <CreditCard className="h-8 w-8 text-primary" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Our Pricing</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-blue-400 to-purple-400 bg-clip-text text-transparent mb-8 leading-tight">
            Choose a plan to match your needs
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            85 credits per contact. When you run out of credits, no more contacts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative h-full bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group ${
                plan.name === 'Pro' ? 'cursor-pointer hover:border-primary/50 hover:bg-card/70 ring-2 ring-primary/20 hover:ring-primary/40' : 'hover:border-border hover:bg-card/60'
              }`}
              onClick={plan.name === 'Pro' ? () => setShowProModal(true) : undefined}
            >
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
                  <span className={`${plan.name === 'Pro' ? 'bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent' : 'text-foreground'}`}>
                    {plan.name}
                  </span>
                  {plan.name === 'Pro' && (
                    <span className="text-xs bg-gradient-to-r from-primary/20 to-blue-400/20 text-primary px-3 py-1.5 rounded-full font-medium border border-primary/30 animate-pulse">
                      Click to learn more
                    </span>
                  )}
                </CardTitle>
                {plan.description && (
                  <p className="text-base text-muted-foreground font-medium">{plan.description}</p>
                )}
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <ul className="space-y-4 mb-10">
                  {plan.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-4 text-base group-hover:text-foreground transition-colors">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0 group-hover:text-primary/80 transition-colors" />
                      <span className="text-card-foreground leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  size="lg"
                  className={`w-full py-4 font-bold text-base transition-all duration-300 ${
                    plan.name === 'Pro' 
                      ? 'bg-gradient-to-r from-primary via-blue-500 to-purple-500 hover:from-primary/90 hover:via-blue-500/90 hover:to-purple-500/90 text-white shadow-lg hover:shadow-xl hover:shadow-primary/25 transform hover:scale-[1.02]' 
                      : 'bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 text-secondary-foreground shadow-md hover:shadow-lg transform hover:scale-[1.02]'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(plan.cta.to);
                  }}
                >
                  {plan.cta.label}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={showProModal} onOpenChange={setShowProModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center mb-4">
                How the Pro Plan Works
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-8">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                  <Zap className="h-5 w-5" />
                  <span className="font-semibold">4800 Credits • 56 Contacts • 1200 Minutes Saved</span>
                </div>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  The Pro plan is designed for serious professionals who want to maximize their networking efficiency 
                  and build meaningful connections at scale.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Advanced Features
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Directory Permanently Saves:</strong> All your contacts are stored permanently in your personal directory for future reference
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Priority Support:</strong> Get faster response times and dedicated assistance from our support team
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Advanced Search Filters:</strong> Access to premium search capabilities and detailed contact information
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Time Efficiency
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>20 Minutes Saved Per Contact:</strong> Automated research and contact finding saves you significant time
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Bulk Processing:</strong> Handle multiple contacts simultaneously for maximum efficiency
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>Smart Recommendations:</strong> AI-powered suggestions for the best contacts to reach out to
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  How the Credit System Works
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                      <span className="font-bold text-primary">1</span>
                    </div>
                    <div>
                      <p className="font-semibold">Search for Contacts</p>
                      <p className="text-muted-foreground">Use our advanced search to find relevant professionals</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                      <span className="font-bold text-primary">2</span>
                    </div>
                    <div>
                      <p className="font-semibold">85 Credits Per Contact</p>
                      <p className="text-muted-foreground">Each contact found costs 85 credits from your balance</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                      <span className="font-bold text-primary">3</span>
                    </div>
                    <div>
                      <p className="font-semibold">Save & Connect</p>
                      <p className="text-muted-foreground">Pro users can permanently save contacts to their directory</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-center">Pro vs Free Comparison</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-muted-foreground">Free Plan</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        850 credits (~10 contacts)
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        200 minutes saved
                      </li>
                      <li className="flex items-center gap-2">
                        <X className="h-4 w-4 text-red-500" />
                        Limited features
                      </li>
                      <li className="flex items-center gap-2">
                        <X className="h-4 w-4 text-red-500" />
                        No permanent directory saves
                      </li>
                    </ul>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-4">
                    <h4 className="font-medium mb-3 text-primary">Pro Plan</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        4800 credits (~56 contacts)
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        1200 minutes saved
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        All advanced features
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Permanent directory saves
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Priority support
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4">
                <Button 
                  size="lg" 
                  className="px-8"
                  onClick={() => {
                    setShowProModal(false);
                    navigate("/onboarding/resume-upload");
                  }}
                >
                  Start with Pro Plan
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Get started with the Pro plan and maximize your networking potential
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Pricing;
