import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar,
  Clock,
  DollarSign,
  ArrowLeft,
  Printer,
  Share2
} from "lucide-react";

interface Report {
  id: string;
  title: string;
  topic: string;
  pages: number;
  format: string;
  print_side: string;
  binding: boolean;
  cover: boolean;
  status: string;
  generated_content: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export default function PreviewReport() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  
  const reportId = searchParams.get('id');

  useEffect(() => {
    if (user && reportId) {
      fetchReport();
    } else if (!reportId) {
      navigate('/dashboard');
    }
  }, [user, reportId]);

  const fetchReport = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setReport(data);
    } catch (error) {
      console.error('Error fetching report:', error);
      toast({
        title: "Error",
        description: "Failed to load the report. Please try again.",
        variant: "destructive"
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    toast({
      title: "Download Started",
      description: "Your report download has started.",
    });
    // TODO: Implement actual download functionality
  };

  const handleOrderPrint = () => {
    navigate(`/order-print?reportId=${reportId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "generating": return "bg-warning/10 text-warning border-warning/20";
      case "ready": return "bg-success/10 text-success border-success/20";
      case "delivered": return "bg-primary/10 text-primary border-primary/20";
      case "failed": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "generating": return "Generating...";
      case "ready": return "Ready";
      case "delivered": return "Delivered";
      case "failed": return "Failed";
      default: return "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">Report not found</h2>
          <p className="text-muted-foreground mb-6">The report you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {report.title}
            </h1>
            <p className="text-xl text-muted-foreground mt-2">
              {report.topic}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Report Content */}
          <div className="lg:col-span-2">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    Report Preview
                  </CardTitle>
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(report.status)} px-3 py-1`}
                  >
                    {getStatusText(report.status)}
                  </Badge>
                </div>
                <CardDescription>
                  Preview of your generated report content
                </CardDescription>
              </CardHeader>
              <CardContent>
                {report.status === 'generating' ? (
                  <div className="text-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Generating Your Report
                    </h3>
                    <p className="text-muted-foreground">
                      Our AI is working hard to create your report. This usually takes 5-10 minutes.
                    </p>
                  </div>
                ) : report.status === 'failed' ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Generation Failed
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Something went wrong while generating your report. Please try creating a new one.
                    </p>
                    <Button onClick={() => navigate('/report-form')}>
                      Create New Report
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Report content preview */}
                    <div className="bg-background/50 rounded-lg p-6 min-h-96 border border-border/30">
                      {report.generated_content ? (
                        <div className="prose prose-sm max-w-none">
                          {/* This would be the actual report content */}
                          <div className="text-foreground whitespace-pre-wrap">
                            {report.generated_content}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            Content Preview Unavailable
                          </h3>
                          <p className="text-muted-foreground">
                            The report content is ready but preview is not available. You can download the full report.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Report Details & Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Report Info */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Report Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{report.pages} pages</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{report.format}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(report.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>₹{report.price}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <h4 className="font-medium text-foreground">Print Options</h4>
                    <div className="space-y-1 text-muted-foreground">
                      <p>• {report.print_side === 'double' ? 'Double-sided' : 'Single-sided'} printing</p>
                      {report.binding && <p>• Spiral binding included</p>}
                      {report.cover && <p>• Plastic cover included</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {report.status === 'ready' || report.status === 'delivered' ? (
                    <>
                      <Button 
                        onClick={handleDownload}
                        className="w-full bg-gradient-primary hover:opacity-90 text-white shadow-glow"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                      
                      <Button 
                        onClick={handleOrderPrint}
                        variant="outline"
                        className="w-full"
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        Order Print & Delivery
                      </Button>

                      <Button 
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          navigator.share?.({
                            title: report.title,
                            text: `Check out my report: ${report.title}`,
                            url: window.location.href
                          });
                        }}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Report
                      </Button>
                    </>
                  ) : report.status === 'generating' ? (
                    <Button disabled className="w-full">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        Generating...
                      </div>
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => navigate('/report-form')}
                      className="w-full bg-gradient-primary hover:opacity-90 text-white"
                    >
                      Create New Report
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}