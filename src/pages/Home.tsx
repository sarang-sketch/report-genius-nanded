import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Zap, 
  Truck, 
  Clock, 
  Shield, 
  Star,
  ArrowRight,
  Sparkles,
  CheckCircle
} from "lucide-react";
import heroBackground from "@/assets/hero-bg.jpg";

export default function Home() {
  const features = [
    {
      icon: Zap,
      title: "AI-Powered Generation",
      description: "Advanced AI creates structured, plagiarism-free reports in minutes"
    },
    {
      icon: FileText,
      title: "Professional Formatting",
      description: "IEEE, college, and custom formats with perfect styling"
    },
    {
      icon: Truck,
      title: "Express Delivery",
      description: "Printed & delivered to your doorstep in 1-2 hours"
    },
    {
      icon: Shield,
      title: "Quality Guarantee",
      description: "Spiral binding, plastic covers, and premium paper quality"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Engineering Student",
      comment: "Saved me hours of work! The AI-generated report was perfectly formatted.",
      rating: 5
    },
    {
      name: "Rahul Patil",
      role: "Research Scholar",
      comment: "Fast delivery and excellent quality. Will definitely use again!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="space-y-6 animate-fade-in">
            <Badge 
              variant="outline" 
              className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm font-medium"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Now Live in Nanded City
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              AI-Powered Reports,
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Delivered Fast
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Generate professional reports with AI, get them printed with premium quality, 
              and delivered to your doorstep within hours. Perfect for students and professionals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:opacity-90 text-white px-8 py-6 text-lg font-semibold shadow-glow"
                asChild
              >
                <a href="/report-form">
                  Create Your Report
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-6 text-lg border-border/50 hover:bg-accent/50"
                asChild
              >
                <a href="/preview-report">
                  See Examples
                </a>
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>30-40 page reports</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>1-2 hour delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Starting ₹30</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose NaN Report Hub?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We combine cutting-edge AI technology with reliable local delivery 
              to provide you with the best report generation experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-premium transition-all duration-300 group"
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Simple 4-step process to get your perfect report
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Submit Topic", desc: "Provide your report topic and requirements" },
              { step: "2", title: "AI Generation", desc: "Our AI creates a structured, professional report" },
              { step: "3", title: "Review & Pay", desc: "Preview your report and make secure payment" },
              { step: "4", title: "Get Delivered", desc: "Receive printed report at your doorstep" }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl shadow-glow">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-card/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Students Say
            </h2>
            <p className="text-xl text-muted-foreground">
              Join hundreds of satisfied students in Nanded
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-foreground mb-4 italic">
                    "{testimonial.comment}"
                  </p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-secondary rounded-2xl p-12 border border-border/50">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Create Your Report?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join students across Nanded who trust us for their academic needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:opacity-90 text-white px-8 py-6 text-lg font-semibold shadow-glow"
                asChild
              >
                <a href="/report-form">
                  Start Creating
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-6 text-lg"
                asChild
              >
                <a href="/dashboard">
                  View Dashboard
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}