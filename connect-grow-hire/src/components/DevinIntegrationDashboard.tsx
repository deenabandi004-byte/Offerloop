import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { devinApiService, type DevinSessionResponse } from '@/services/devinApi';
import { Sparkles, Zap, Cog, Puzzle, ExternalLink, Loader2 } from 'lucide-react';

export const DevinIntegrationDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState<DevinSessionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [componentName, setComponentName] = useState('');
  const [optimizationType, setOptimizationType] = useState<'performance' | 'accessibility' | 'ux' | 'code_quality'>('performance');

  const [analyticsType, setAnalyticsType] = useState<'dashboard' | 'reports' | 'insights' | 'predictions'>('dashboard');

  const [workflowType, setWorkflowType] = useState<'email_optimization' | 'contact_validation' | 'crm_integration' | 'smart_scheduling'>('email_optimization');
  const [workflowParams, setWorkflowParams] = useState('{}');

  const [integrationType, setIntegrationType] = useState('');
  const [integrationDescription, setIntegrationDescription] = useState('');

  const handleOptimizeComponent = async () => {
    if (!componentName.trim()) {
      toast({
        title: "Component Name Required",
        description: "Please enter a component name to optimize",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await devinApiService.optimizeComponent({
        component_name: componentName,
        optimization_type: optimizationType,
      });

      setActiveSession(response);
      toast({
        title: "Component Optimization Started",
        description: `Devin is optimizing ${componentName} for ${optimizationType}`,
      });
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: error instanceof Error ? error.message : "Failed to start optimization",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await devinApiService.createAnalytics({
        analytics_type: analyticsType,
        user_email: user?.email,
      });

      setActiveSession(response);
      toast({
        title: "Analytics Creation Started",
        description: `Devin is building ${analyticsType} analytics components`,
      });
    } catch (error) {
      toast({
        title: "Analytics Creation Failed",
        description: error instanceof Error ? error.message : "Failed to start analytics creation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWorkflow = async () => {
    setIsLoading(true);
    try {
      let parameters = {};
      try {
        parameters = JSON.parse(workflowParams);
      } catch (e) {
      }

      const response = await devinApiService.createWorkflow({
        workflow_type: workflowType,
        parameters,
        user_email: user?.email,
      });

      setActiveSession(response);
      toast({
        title: "Workflow Creation Started",
        description: `Devin is building ${workflowType} automation workflow`,
      });
    } catch (error) {
      toast({
        title: "Workflow Creation Failed",
        description: error instanceof Error ? error.message : "Failed to start workflow creation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCustomIntegration = async () => {
    if (!integrationType.trim() || !integrationDescription.trim()) {
      toast({
        title: "Integration Details Required",
        description: "Please provide both integration type and description",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await devinApiService.createCustomIntegration({
        integration_type: integrationType,
        description: integrationDescription,
        user_email: user?.email,
      });

      setActiveSession(response);
      toast({
        title: "Custom Integration Started",
        description: `Devin is building ${integrationType} integration`,
      });
    } catch (error) {
      toast({
        title: "Integration Creation Failed",
        description: error instanceof Error ? error.message : "Failed to start integration creation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Devin AI Integration Dashboard</h2>
        </div>
        <p className="text-muted-foreground">
          Enhance RecruitEdge with AI-powered automation and optimization
        </p>
      </div>

      {/* Active Session Display */}
      {activeSession && (
        <Card className="border-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Active Devin Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{activeSession.status}</Badge>
                <span className="text-sm text-muted-foreground">Session ID: {activeSession.session_id}</span>
              </div>
              {activeSession.message && (
                <p className="text-sm">{activeSession.message}</p>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(activeSession.session_url, '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View Devin Session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integration Tabs */}
      <Tabs defaultValue="optimize" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="optimize" className="flex items-center gap-2">
            <Cog className="h-4 w-4" />
            Optimize
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center gap-2">
            <Puzzle className="h-4 w-4" />
            Custom
          </TabsTrigger>
        </TabsList>

        {/* Component Optimization Tab */}
        <TabsContent value="optimize">
          <Card>
            <CardHeader>
              <CardTitle>Component Optimization</CardTitle>
              <p className="text-sm text-muted-foreground">
                Use Devin to optimize React components for performance, accessibility, and user experience
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Component Name</label>
                <Input
                  placeholder="e.g., ContactSearchForm, Dashboard, ScoutChatbot"
                  value={componentName}
                  onChange={(e) => setComponentName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Optimization Type</label>
                <Select value={optimizationType} onValueChange={(value: any) => setOptimizationType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="accessibility">Accessibility</SelectItem>
                    <SelectItem value="ux">User Experience</SelectItem>
                    <SelectItem value="code_quality">Code Quality</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleOptimizeComponent} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Cog className="h-4 w-4 mr-2" />}
                Optimize Component
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <p className="text-sm text-muted-foreground">
                Generate sophisticated analytics dashboards and insights for recruiting performance
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Analytics Type</label>
                <Select value={analyticsType} onValueChange={(value: any) => setAnalyticsType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dashboard">Interactive Dashboard</SelectItem>
                    <SelectItem value="reports">Performance Reports</SelectItem>
                    <SelectItem value="insights">AI Insights</SelectItem>
                    <SelectItem value="predictions">Predictive Analytics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateAnalytics} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
                Create Analytics
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workflows Tab */}
        <TabsContent value="workflows">
          <Card>
            <CardHeader>
              <CardTitle>Automated Workflows</CardTitle>
              <p className="text-sm text-muted-foreground">
                Build intelligent automation workflows for recruiting processes
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Workflow Type</label>
                <Select value={workflowType} onValueChange={(value: any) => setWorkflowType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email_optimization">Email Optimization</SelectItem>
                    <SelectItem value="contact_validation">Contact Validation</SelectItem>
                    <SelectItem value="crm_integration">CRM Integration</SelectItem>
                    <SelectItem value="smart_scheduling">Smart Scheduling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Parameters (JSON)</label>
                <Textarea
                  placeholder='{"industry": "tech", "role_level": "senior"}'
                  value={workflowParams}
                  onChange={(e) => setWorkflowParams(e.target.value)}
                />
              </div>
              <Button onClick={handleCreateWorkflow} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                Create Workflow
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Integration Tab */}
        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>Custom Integration</CardTitle>
              <p className="text-sm text-muted-foreground">
                Build custom integrations tailored to your specific recruiting needs
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Integration Type</label>
                <Input
                  placeholder="e.g., Slack Integration, Custom CRM, API Connector"
                  value={integrationType}
                  onChange={(e) => setIntegrationType(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Describe what you want this integration to do..."
                  value={integrationDescription}
                  onChange={(e) => setIntegrationDescription(e.target.value)}
                />
              </div>
              <Button onClick={handleCreateCustomIntegration} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Puzzle className="h-4 w-4 mr-2" />}
                Create Integration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
