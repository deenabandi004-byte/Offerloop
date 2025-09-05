import { ArrowLeft, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-6">
        <Button variant="ghost" onClick={() => navigate("/home")} className="mb-8 hover:bg-accent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CreditCard className="h-8 w-8 text-primary" />
            <span className="text-sm font-medium text-primary">Our Pricing</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Choose a plan to match your needs
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            85 credits per contact. When you run out of credits, no more contacts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {plans.map((plan) => (
            <Card key={plan.name} className="relative h-full border-border hover:shadow-lg transition-all">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg font-semibold mb-2">{plan.name}</CardTitle>
                {plan.description && <p className="text-sm text-muted-foreground">{plan.description}</p>}
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.bullets.map((b, i) => (
                    <li key={i} className="text-sm text-foreground">{b}</li>
                  ))}
                </ul>
                <Button className="w-full" onClick={() => navigate(plan.cta.to)}>
                  {plan.cta.label}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
