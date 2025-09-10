import { useState } from "react";
import { Check, X, ArrowLeft, CreditCard, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useFirebaseAuth } from "../contexts/FirebaseAuthContext"; // Updated import

const Pricing = () => {
  const [showProModal, setShowProModal] = useState(false);
  const navigate = useNavigate();
  const { user, updateUser, completeOnboarding } = useFirebaseAuth(); // Updated hook usage

  const handleUpgrade = async (planType) => {
    if (!user) return;
    
    try {
      if (planType === 'free') {
        await updateUser({
          tier: 'free',
          credits: 120,
          maxCredits: 120,
          emailsUsedThisMonth: 0,
          emailsMonthKey: new Date().toISOString().slice(0, 7),
        });
      } else if (planType === 'pro') {
        await updateUser({
          tier: 'pro',
          credits: 840,
          maxCredits: 840,
          emailsUsedThisMonth: 0,
          emailsMonthKey: new Date().toISOString().slice(0, 7),
        });
      }
      // Navigate to home after successful upgrade
      navigate("/home");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const ProModal = () => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">How the Pro Plan Works</h2>
          <button 
            onClick={() => setShowProModal(false)}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="text-blue-400 font-semibold mb-2">
            ⚡ 840 Credits • 56 Contacts • 1200 Minutes Saved
          </div>
          <p className="text-gray-300">
            The Pro plan is designed for serious professionals who want to maximize their 
            networking efficiency and build meaningful connections at scale.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-blue-400 font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm">◯</span>
              Advanced Features
            </h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Directory Permanently Saves:</div>
                  <div className="text-sm text-gray-400">All your contacts are stored permanently in your personal directory for future reference</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Priority Support:</div>
                  <div className="text-sm text-gray-400">Get faster response times and dedicated assistance from our support team</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Advanced Features:</div>
                  <div className="text-sm text-gray-400">Access to premium capabilities including resume analysis and AI similarity matching</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-blue-400 font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm">◯</span>
              Time Efficiency
            </h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">21 Minutes Saved Per Contact:</div>
                  <div className="text-sm text-gray-400">Automated research and contact finding saves you significant time</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Bulk Processing:</div>
                  <div className="text-sm text-gray-400">Handle up to 56 contacts simultaneously for maximum efficiency</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">Resume-Based Matching:</div>
                  <div className="text-sm text-gray-400">AI-powered similarity analysis finds the most relevant connections</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <h3 className="text-blue-400 font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            How the Credit System Works
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-blue-400 text-2xl font-bold mb-2">1</div>
              <h4 className="font-medium text-white mb-2">Search for Contacts</h4>
              <p className="text-sm text-gray-400">Use our advanced search to find relevant professionals</p>
            </div>
            <div className="text-center">
              <div className="text-blue-400 text-2xl font-bold mb-2">2</div>
              <h4 className="font-medium text-white mb-2">15 Credits Per Contact</h4>
              <p className="text-sm text-gray-400">Each contact found costs 15 credits from your balance</p>
            </div>
            <div className="text-center">
              <div className="text-blue-400 text-2xl font-bold mb-2">3</div>
              <h4 className="font-medium text-white mb-2">Save & Connect</h4>
              <p className="text-sm text-gray-400">Pro users can permanently save contacts to their directory</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4 text-center">Free vs Pro Comparison</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-gray-300 font-medium mb-3">Free Plan</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-300">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>120 credits (8 contacts)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>200 minutes saved</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>Try out platform risk free</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>Limited Features</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-blue-400 font-medium mb-3">Pro Plan</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-300">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>840 credits (56 contacts)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>1200 minutes saved</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>Everything in free plus:</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>Directory permanently saves</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>Priority Support</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>Advanced features</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header with back button */}
      <div className="container mx-auto px-6 py-6 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/home")}
          className="mb-8 text-gray-400 hover:text-white hover:bg-slate-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex items-center gap-2 bg-blue-600/20 px-3 py-1 rounded-full">
              <CreditCard className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400 uppercase tracking-wide">Our Pricing</span>
            </div>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Choose a plan to match your needs
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            15 credits per contact. When you run out of credits, no more contacts.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
            {/* Free Plan */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-8 backdrop-blur-sm">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-3 text-white">Free</h3>
                <p className="text-gray-400">Try out platform risk free</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300">120 credits</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300">Estimated time saved: 200 minutes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300">Try out platform risk free</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300">Limited Features</span>
                </div>
              </div>

              <Button 
                className="w-full py-4 px-6 rounded-lg font-semibold text-white bg-slate-700 hover:bg-slate-600 transition-colors"
                onClick={() => handleUpgrade('free')}
              >
                Start for free
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="relative bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-blue-500/50 rounded-xl p-8 backdrop-blur-sm">
              <div className="absolute top-4 right-4">
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">RECOMMENDED</span>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-3 text-blue-400">Pro</h3>
                <div className="mb-2">
                  <span className="text-gray-500 text-xl line-through mr-2">$34.99</span>
                  <span className="text-3xl font-bold text-white">$14.99</span>
                  <span className="text-gray-400 text-lg ml-1">/month</span>
                </div>
                <p className="text-gray-300">840 credits</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300">840 credits</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300">Estimated time saved: 1200 minutes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300">Everything in free plus:</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300">Directory permanently saves</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300">Priority Support</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300">Advanced features</span>
                </div>
              </div>

              <Button 
                className="w-full py-4 px-6 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
                onClick={() => setShowProModal(true)}
              >
                Start now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showProModal && <ProModal />}
    </div>
  );
};

export default Pricing;