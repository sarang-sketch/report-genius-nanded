import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DeliveryMap from "@/components/DeliveryMap";
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  MapPin,
  Clock,
  CheckCircle,
  Phone,
  MessageCircle,
  Navigation
} from "lucide-react";

interface Order {
  id: string;
  delivery_status: string;
  delivery_address: string;
  tracking_number: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  reports: {
    title: string;
    topic: string;
    pages: number;
    format: string;
  };
}

interface DeliveryAddress {
  address: string;
  coordinates: { lat: number; lng: number };
  contactInfo: any;
  instructions?: string;
}

export default function TrackDelivery() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [deliveryPosition, setDeliveryPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<string>('');
  
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (user && orderId) {
      fetchOrder();
      // Set up real-time tracking updates
      setupRealtimeTracking();
    } else if (!orderId) {
      navigate('/dashboard');
    }
  }, [user, orderId]);

  useEffect(() => {
    // Simulate delivery position updates
    if (order && order.delivery_status === 'out_for_delivery') {
      const interval = setInterval(() => {
        // Simulate moving delivery position
        const deliveryAddr = JSON.parse(order.delivery_address) as DeliveryAddress;
        const targetLat = deliveryAddr.coordinates.lat;
        const targetLng = deliveryAddr.coordinates.lng;
        
        setDeliveryPosition(prev => {
          if (!prev) {
            // Start from a nearby location
            return {
              lat: targetLat + 0.01,
              lng: targetLng + 0.01
            };
          }
          
          // Move slightly towards target
          const diffLat = targetLat - prev.lat;
          const diffLng = targetLng - prev.lng;
          
          return {
            lat: prev.lat + diffLat * 0.1,
            lng: prev.lng + diffLng * 0.1
          };
        });
        
        // Update estimated time
        const randomMinutes = Math.floor(Math.random() * 20) + 10;
        setEstimatedTime(`${randomMinutes} minutes`);
      }, 30000); // Update every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [order]);

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          reports (
            title,
            topic,
            pages,
            format
          )
        `)
        .eq('id', orderId)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast({
        title: "Error",
        description: "Failed to load order details. Please try again.",
        variant: "destructive"
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeTracking = () => {
    const channel = supabase
      .channel('order-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload) => {
          console.log('Order update received:', payload);
          setOrder(payload.new as Order);
          
          toast({
            title: "Delivery Update",
            description: "Your order status has been updated!",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-warning/10 text-warning border-warning/20";
      case "confirmed": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "printing": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "out_for_delivery": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "delivered": return "bg-success/10 text-success border-success/20";
      case "cancelled": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Order Pending";
      case "confirmed": return "Order Confirmed";
      case "printing": return "Printing in Progress";
      case "out_for_delivery": return "Out for Delivery";
      case "delivered": return "Delivered";
      case "cancelled": return "Cancelled";
      default: return "Unknown Status";
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { key: "pending", label: "Order Placed", icon: Package },
      { key: "confirmed", label: "Confirmed", icon: CheckCircle },
      { key: "printing", label: "Printing", icon: Package },
      { key: "out_for_delivery", label: "Out for Delivery", icon: Truck },
      { key: "delivered", label: "Delivered", icon: CheckCircle }
    ];

    const currentIndex = steps.findIndex(step => step.key === order?.delivery_status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">Order not found</h2>
          <p className="text-muted-foreground mb-6">Unable to find the order you're looking for.</p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const deliveryAddress = JSON.parse(order.delivery_address) as DeliveryAddress;

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
              Track Your Delivery
            </h1>
            <p className="text-xl text-muted-foreground mt-2">
              Order #{order.id.split('-')[0].toUpperCase()}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tracking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Timeline */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Delivery Status
                  </CardTitle>
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(order.delivery_status)} px-3 py-1`}
                  >
                    {getStatusText(order.delivery_status)}
                  </Badge>
                </div>
                {order.tracking_number && (
                  <CardDescription>
                    Tracking Number: {order.tracking_number}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getStatusSteps().map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.key} className="flex items-center gap-4">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center border-2
                          ${step.completed 
                            ? 'bg-primary border-primary text-primary-foreground' 
                            : 'border-muted bg-muted/10'
                          }
                        `}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {step.label}
                          </h4>
                          {step.current && order.delivery_status === 'out_for_delivery' && estimatedTime && (
                            <p className="text-sm text-muted-foreground">
                              Estimated arrival: {estimatedTime}
                            </p>
                          )}
                        </div>
                        {step.completed && (
                          <CheckCircle className="h-5 w-5 text-success" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Live Tracking Map */}
            {order.delivery_status === 'out_for_delivery' && (
              <DeliveryMap 
                deliveryMode={true}
                selectedLocation={{
                  lat: deliveryAddress.coordinates.lat,
                  lng: deliveryAddress.coordinates.lng,
                  address: deliveryAddress.address
                }}
                deliveryLocation={deliveryPosition || deliveryAddress.coordinates}
              />
            )}

            {/* Contact Delivery */}
            {order.delivery_status === 'out_for_delivery' && (
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    Contact Delivery Partner
                  </CardTitle>
                  <CardDescription>
                    Get in touch with your delivery partner for updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Delivery Partner
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Order Details */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <h4 className="font-medium text-foreground">{order.reports.title}</h4>
                      <p className="text-sm text-muted-foreground">{order.reports.topic}</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Pages</span>
                        <span>{order.reports.pages}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Format</span>
                        <span>{order.reports.format}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Order Date</span>
                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total Amount</span>
                        <span>₹{order.total_amount}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">{deliveryAddress.address}</p>
                  
                  {deliveryAddress.instructions && (
                    <div className="space-y-1">
                      <h5 className="text-sm font-medium">Delivery Instructions:</h5>
                      <p className="text-sm text-muted-foreground">{deliveryAddress.instructions}</p>
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <h5 className="text-sm font-medium">Contact:</h5>
                    <p className="text-sm text-muted-foreground">{deliveryAddress.contactInfo.fullName}</p>
                    <p className="text-sm text-muted-foreground">{deliveryAddress.contactInfo.phone}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/dashboard')}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    View All Orders
                  </Button>
                  
                  {order.delivery_status === 'delivered' && (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Rate Delivery
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