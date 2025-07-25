import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Eye, 
  FileText, 
  Calendar,
  Clock,
  DollarSign
} from "lucide-react";

interface ReportCardProps {
  id: string;
  title: string;
  topic: string;
  pages: number;
  format: string;
  status: "generating" | "ready" | "delivered" | "failed";
  createdAt: string;
  price: number;
  onView?: () => void;
  onDownload?: () => void;
  className?: string;
}

export function ReportCard({
  id,
  title,
  topic,
  pages,
  format,
  status,
  createdAt,
  price,
  onView,
  onDownload,
  className = ""
}: ReportCardProps) {
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

  return (
    <Card className={`group hover:shadow-premium transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {topic}
            </CardDescription>
          </div>
          <Badge 
            variant="outline" 
            className={`${getStatusColor(status)} px-2 py-1 text-xs font-medium`}
          >
            {getStatusText(status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Report Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>{pages} pages</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{createdAt}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>₹{price}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          {status === "ready" || status === "delivered" ? (
            <>
              {onView && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onView}
                  className="flex-1 gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
              )}
              {onDownload && (
                <Button 
                  size="sm" 
                  onClick={onDownload}
                  className="flex-1 gap-2 bg-gradient-primary hover:opacity-90"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              )}
            </>
          ) : status === "generating" ? (
            <Button disabled size="sm" className="flex-1">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                Generating...
              </div>
            </Button>
          ) : (
            <Button variant="destructive" size="sm" className="flex-1" disabled>
              Generation Failed
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}