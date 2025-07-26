import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UploadReference() {
  const [formData, setFormData] = useState({
    referenceName: "",
    description: "",
    file: null as File | null
  });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive"
        });
        return;
      }

      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document.",
          variant: "destructive"
        });
        return;
      }

      setFormData(prev => ({ ...prev, file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.file) {
      toast({
        title: "No file selected",
        description: "Please select a reference document to upload.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      // TODO: Implement file upload to Supabase Storage
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate upload
      
      toast({
        title: "Reference uploaded successfully!",
        description: "Your reference document has been saved and will be available for future reports.",
      });

      // Reset form
      setFormData({
        referenceName: "",
        description: "",
        file: null
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload your reference document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Upload Reference Document
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload a reference document to create custom report formats. 
            Our AI will analyze your document and apply the same formatting style.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    Reference Details
                  </CardTitle>
                  <CardDescription>
                    Provide information about your reference document
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="referenceName">Reference Name *</Label>
                    <Input
                      id="referenceName"
                      placeholder="e.g., College Report Template, IEEE Paper Format"
                      value={formData.referenceName}
                      onChange={(e) => setFormData(prev => ({ ...prev, referenceName: e.target.value }))}
                      className="bg-background/50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the format style, layout, or any specific requirements..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-background/50 min-h-24"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Upload Document</CardTitle>
                  <CardDescription>
                    Upload your reference document (PDF or Word format, max 10MB)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <Label
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-border/50 border-dashed rounded-lg cursor-pointer bg-background/30 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {formData.file ? (
                            <>
                              <CheckCircle className="w-10 h-10 mb-3 text-success" />
                              <p className="mb-2 text-sm text-foreground font-medium">
                                {formData.file.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </>
                          ) : (
                            <>
                              <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                              <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground">
                                PDF or Word documents (MAX. 10MB)
                              </p>
                            </>
                          )}
                        </div>
                        <Input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                        />
                      </Label>
                    </div>

                    {formData.file && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, file: null }))}
                      >
                        Remove File
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-gradient-primary hover:opacity-90 text-white py-6 text-lg font-semibold shadow-glow"
                disabled={uploading || !formData.file}
              >
                {uploading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    Upload Reference
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Guidelines */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Upload Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Supported Formats:</h4>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• PDF documents</li>
                      <li>• Word documents (.doc, .docx)</li>
                      <li>• Maximum file size: 10MB</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Best Practices:</h4>
                    <ul className="text-muted-foreground space-y-1">
                      <li>• Use well-formatted documents</li>
                      <li>• Include clear headings and structure</li>
                      <li>• Avoid scanned documents when possible</li>
                      <li>• Ensure text is selectable</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-warning/5 border-warning/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        Processing Time
                      </p>
                      <p className="text-xs text-muted-foreground">
                        It may take 5-10 minutes to analyze your reference document and make it available for use.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}