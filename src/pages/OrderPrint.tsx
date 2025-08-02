import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DeliveryMap from "@/components/DeliveryMap";
import { 
  ArrowLeft, 
  Package, 
  CreditCard, 
  MapPin,
  Clock,
  Truck,
  Phone,
  Mail
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
  price: number;
}

interface DeliveryLocation {
  lat: number;
  lng: number;
  address: string;
}

export default function OrderPrint() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState<DeliveryLocation | null>(null);
  
  const [orderForm, setOrderForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    alternatePhone: '',
    deliveryInstructions: '',
    preferredTime: 'anytime'
  });

  const reportId = searchParams.get('reportId');

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

  const handleLocationSelect = (location: DeliveryLocation) => {
    setDeliveryLocation(location);
  };

  const calculateDeliveryCharge = () => {
    // Base delivery charge
    return 50;
  };

  const calculateTotal = () => {
    if (!report) return 0;
    return report.price + calculateDeliveryCharge();
  };

  const handleSubmitOrder = async () => {
    if (!report || !deliveryLocation || !orderForm.fullName || !orderForm.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select a delivery location.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          report_id: reportId,
          delivery_address: JSON.stringify({
            address: deliveryLocation.address,
            coordinates: { lat: deliveryLocation.lat, lng: deliveryLocation.lng },
            contactInfo: orderForm,
            instructions: orderForm.deliveryInstructions
          }),
          total_amount: calculateTotal(),
          delivery_status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      toast({
        title: "Order Placed Successfully!",
        description: "Your print order has been placed. You'll receive a confirmation shortly.",
      });

      // Navigate to tracking page
      navigate(`/track-delivery?orderId=${order.id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
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
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">Report not found</h2>
          <p className="text-muted-foreground mb-6">Unable to find the report for printing.</p>
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
            onClick={() => navigate(`/preview-report?id=${reportId}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Order Print & Delivery
            </h1>
            <p className="text-xl text-muted-foreground mt-2">
              {report.title}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  We'll use this information to coordinate your delivery
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={orderForm.fullName}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={orderForm.phone}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={orderForm.email}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alternatePhone">Alternate Phone</Label>
                    <Input
                      id="alternatePhone"
                      type="tel"
                      value={orderForm.alternatePhone}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, alternatePhone: e.target.value }))}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryInstructions">Delivery Instructions</Label>
                  <Textarea
                    id="deliveryInstructions"
                    value={orderForm.deliveryInstructions}
                    onChange={(e) => setOrderForm(prev => ({ ...prev, deliveryInstructions: e.target.value }))}
                    placeholder="Any specific instructions for delivery (e.g., gate code, landmark, preferred time)"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Location */}
            <DeliveryMap 
              onLocationSelect={handleLocationSelect}
              selectedLocation={deliveryLocation}
            />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Report Summary */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Report</span>
                      <span className="font-medium">{report.title}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pages</span>
                      <span>{report.pages}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Format</span>
                      <span>{report.format}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Print Type</span>
                      <span>{report.print_side === 'double' ? 'Double-sided' : 'Single-sided'}</span>
                    </div>
                    {report.binding && (
                      <div className="flex justify-between text-sm">
                        <span>Binding</span>
                        <span>Spiral binding</span>
                      </div>
                    )}
                    {report.cover && (
                      <div className="flex justify-between text-sm">
                        <span>Cover</span>
                        <span>Plastic cover</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Report Price</span>
                      <span>₹{report.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delivery Charge</span>
                      <span>₹{calculateDeliveryCharge()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₹{calculateTotal()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Info */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Delivery Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Expected delivery: 3-5 business days</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>Professional binding & packaging</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>GPS tracking available</span>
                  </div>
                </CardContent>
              </Card>

              {/* Place Order Button */}
              <Button 
                onClick={handleSubmitOrder}
                disabled={submitting || !deliveryLocation || !orderForm.fullName || !orderForm.phone}
                className="w-full bg-gradient-primary hover:opacity-90 text-white shadow-glow h-12"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Placing Order...
                  </div>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Place Order - ₹{calculateTotal()}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}