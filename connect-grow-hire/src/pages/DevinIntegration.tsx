import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DevinIntegrationDashboard } from "@/components/DevinIntegrationDashboard";

const DevinIntegration = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Back Arrow */}
      <div className="max-w-7xl mx-auto mb-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/home")} 
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 py-8">
          <h1 className="text-4xl font-bold text-foreground">Devin AI Integration</h1>
          <p className="text-xl text-muted-foreground">
            Enhance RecruitEdge with AI-powered automation and optimization
          </p>
        </div>

        {/* Dashboard */}
        <DevinIntegrationDashboard />
      </div>
    </div>
  );
};

export default DevinIntegration;
