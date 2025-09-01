import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, ArrowRight, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useResumeData } from "@/contexts/ResumeDataContext";

const ResumeUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setResumeData } = useResumeData();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);

      const response = await fetch('http://localhost:5001/api/upload-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload resume');
      }

      const data = await response.json();
      setResumeData(data);

      toast({
        title: "Resume uploaded successfully!",
        description: "Your information has been extracted and will pre-fill the onboarding forms.",
      });

      navigate("/onboarding");
    } catch (error) {
      console.error('Resume upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error processing your resume. Please try again or skip to manual entry.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSkip = () => {
    navigate("/onboarding");
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Upload Your Resume</CardTitle>
            <p className="text-muted-foreground mt-2">
              Upload your resume to automatically fill out your profile information and get personalized recommendations.
            </p>
            <div className="flex items-center justify-center mt-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                  0
                </div>
                <span>Resume Upload</span>
                <ArrowRight className="w-4 h-4" />
                <span>Personal Info</span>
                <ArrowRight className="w-4 h-4" />
                <span>Academics</span>
                <ArrowRight className="w-4 h-4" />
                <span>Preferences</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {!selectedFile ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <FileText className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">Drop your resume here</p>
                    <p className="text-muted-foreground">or click to browse files</p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileInputChange}
                    className="hidden"
                    id="resume-upload"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('resume-upload')?.click()}
                  >
                    Choose File
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    PDF files only, max 10MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    disabled={isUploading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="flex flex-col space-y-4">
              {selectedFile && (
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full"
                >
                  {isUploading ? "Processing Resume..." : "Continue with Resume"}
                </Button>
              )}
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={handleSkip}
                className="w-full flex items-center justify-center space-x-2"
              >
                <span>No resume? Skip to manual entry</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResumeUpload;
