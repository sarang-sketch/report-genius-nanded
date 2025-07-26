import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReportCard } from "@/components/ReportCard";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Plus, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  DollarSign,
  Package
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Report {
  id: string;
  title: string;
  topic: string;
  pages: number;
  format: string;
  status: string;
  price: number;
  created_at: string;
}

interface DashboardStats {
  totalReports: number;
  pendingReports: number;
  completedReports: number;
  totalSpent: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalReports: 0,
    pendingReports: 0,
    completedReports: 0,
    totalSpent: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  const fetchReports = async () => {
    try {
      const { data: reportsData, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedReports = reportsData?.map(report => ({
        id: report.id,
        title: report.title,
        topic: report.topic,
        pages: report.pages,
        format: report.format,
        status: report.status,
        price: parseFloat(report.price.toString()),
        created_at: new Date(report.created_at).toLocaleDateString()
      })) || [];

      setReports(formattedReports);

      // Calculate stats
      const totalReports = formattedReports.length;
      const pendingReports = formattedReports.filter(r => r.status === 'pending' || r.status === 'generating').length;
      const completedReports = formattedReports.filter(r => r.status === 'ready' || r.status === 'delivered').length;
      const totalSpent = formattedReports.reduce((sum, r) => sum + r.price, 0);

      setStats({
        totalReports,
        pendingReports,
        completedReports,
        totalSpent
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to load your reports. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (reportId: string) => {
    navigate(`/preview-report?id=${reportId}`);
  };

  const handleDownloadReport = (reportId: string) => {
    // TODO: Implement download functionality
    toast({
      title: "Download Started",
      description: "Your report download has started.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Welcome back! Here's an overview of your reports.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/report-form')}
            className="bg-gradient-primary hover:opacity-90 text-white shadow-glow"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReports}</div>
              <p className="text-xs text-muted-foreground">
                All time reports created
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingReports}</div>
              <p className="text-xs text-muted-foreground">
                Currently being processed
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedReports}</div>
              <p className="text-xs text-muted-foreground">
                Ready for download
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalSpent}</div>
              <p className="text-xs text-muted-foreground">
                Total amount spent
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Your Reports
            </CardTitle>
            <CardDescription>
              Manage and track all your generated reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No reports yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Create your first AI-powered report to get started.
                </p>
                <Button 
                  onClick={() => navigate('/report-form')}
                  className="bg-gradient-primary hover:opacity-90 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Report
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {reports.map((report) => (
                  <ReportCard
                    key={report.id}
                    id={report.id}
                    title={report.title}
                    topic={report.topic}
                    pages={report.pages}
                    format={report.format}
                    status={report.status as any}
                    createdAt={report.created_at}
                    price={report.price}
                    onView={() => handleViewReport(report.id)}
                    onDownload={() => handleDownloadReport(report.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}