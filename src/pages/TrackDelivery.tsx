import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin,
  Phone,
  Calendar,
  ArrowRight
} from "lucide-react";

interface Order {
  id: string;
  report_id: string;
  delivery_status: string;
  delivery_address: string;
  tracking_number: string;
  total_amount: number;
  created_at: string;
  report: {
    title: string;
    pages: number;
  };
}

interface TrackingStep {
  status: string;
  title: string;
  description: string;
  timestamp?: string;
  completed: boolean;
}

export default function TrackDelivery() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          report:reports(title, pages)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load your orders. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getTrackingSteps = (status: string): TrackingStep[] => {
    const steps: TrackingStep[] = [
      {
        status: 'pending',
        title: 'Order Confirmed',
        description: 'Your order has been received and is being processed',
        completed: ['pending', 'printing', 'printed', 'shipped', 'delivered'].includes(status)
      },
      {
        status: 'printing',
        title: 'Printing in Progress',
        description: 'Your report is being printed with premium quality',
        completed: ['printing', 'printed', 'shipped', 'delivered'].includes(status)
      },
      {
        status: 'printed',
        title: 'Ready for Pickup',
        description: 'Printing completed, ready for delivery',
        completed: ['printed', 'shipped', 'delivered'].includes(status)
      },
      {
        status: 'shipped',
        title: 'Out for Delivery',
        description: 'Your report is on the way to your address',
        completed: ['shipped', 'delivered'].includes(status)
      },
      {
        status: 'delivered',
        title: 'Delivered',
        description: 'Successfully delivered to your address',
        completed: status === 'delivered'
      }
    ];

    return steps;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-warning/10 text-warning border-warning/20";
      case "printing": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "printed": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "shipped": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "delivered": return "bg-success/10 text-success border-success/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Processing";
      case "printing": return "Printing";
      case "printed": return "Ready";
      case "shipped": return "Shipped";
      case "delivered": return "Delivered";
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

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Track Your Deliveries
          </h1>
          <p className="text-xl text-muted-foreground">
            Monitor the status of your report printing and delivery
          </p>
        </div>

        {orders.length === 0 ? (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No orders yet
              </h3>
              <p className="text-muted-foreground mb-6">
                You haven't placed any print orders yet. Create a report and order printing to track your delivery here.
              </p>
              <Button 
                onClick={() => window.location.href = '/report-form'}
                className="bg-gradient-primary hover:opacity-90 text-white"
              >
                Create Your First Report
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        {order.report.title}
                      </CardTitle>
                      <CardDescription>
                        Order placed on {new Date(order.created_at).toLocaleDateString()}
                        {order.tracking_number && ` • Tracking: ${order.tracking_number}`}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(order.delivery_status)} px-3 py-1`}
                    >
                      {getStatusText(order.delivery_status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Order Details */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">Order Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Package className="h-4 w-4" />
                          <span>{order.report.pages} pages • ₹{order.total_amount}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{order.delivery_address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Ordered {new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tracking Timeline */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">Tracking Status</h4>
                      <div className="space-y-3">
                        {getTrackingSteps(order.delivery_status).map((step, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              step.completed 
                                ? 'bg-primary text-white' 
                                : 'bg-muted/30 text-muted-foreground'
                            }`}>
                              {step.completed ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <Clock className="h-4 w-4" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                step.completed ? 'text-foreground' : 'text-muted-foreground'
                              }`}>
                                {step.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Contact Support */}
                  {order.delivery_status !== 'delivered' && (
                    <div className="mt-6 pt-4 border-t border-border/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>Need help? Contact support</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Contact Us
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}