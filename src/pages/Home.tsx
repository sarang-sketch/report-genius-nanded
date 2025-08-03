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
  CheckCircle,
  Heart,
  Users,
  Award
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import elegantHero from "@/assets/elegant-hero.jpg";
import studentWorkspace from "@/assets/student-workspace.jpg";
import elegantDelivery from "@/assets/elegant-delivery.jpg";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const features = [
    {
      icon: Zap,
      title: "AI-Powered Excellence",
      description: "Advanced AI creates structured, plagiarism-free reports tailored to your academic needs"
    },
    {
      icon: FileText,
      title: "Professional Formatting",
      description: "IEEE, college, and custom formats with elegant typography and perfect styling"
    },
    {
      icon: Truck,
      title: "Express Delivery",
      description: "Premium printed reports delivered to your doorstep within 1-2 hours"
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Spiral binding, protective covers, and premium paper for lasting quality"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Computer Science Student",
      comment: "The AI-generated report exceeded my expectations. Beautiful formatting and delivered faster than promised!",
      rating: 5,
      avatar: "PS"
    },
    {
      name: "Rahul Patil",
      role: "Research Scholar",
      comment: "Outstanding quality and professional presentation. My professor was impressed with the report structure.",
      rating: 5,
      avatar: "RP"
    },
    {
      name: "Sneha Desai",
      role: "Engineering Student",
      comment: "Perfect for last-minute submissions. The AI understood my topic perfectly and created an excellent report.",
      rating: 5,
      avatar: "SD"
    }
  ];

  const stats = [
    { number: "500+", label: "Reports Generated", icon: FileText },
    { number: "98%", label: "Satisfied Students", icon: Heart },
    { number: "1-2hrs", label: "Average Delivery", icon: Clock },
    { number: "24/7", label: "Support Available", icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${elegantHero})` }}
        />
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="space-y-8 animate-fade-in">
            <Badge 
              variant="outline" 
              className="bg-primary/10 text-primary border-primary/30 px-6 py-3 text-sm font-medium rounded-full backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Now Serving Nanded City with Excellence
            </Badge>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-foreground leading-tight tracking-tight">
              Elegant Reports,
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Effortlessly Delivered
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light">
              Experience the perfect fusion of artificial intelligence and academic excellence. 
              Premium reports crafted with precision, formatted with elegance, and delivered with care.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:opacity-90 text-white px-10 py-6 text-lg font-semibold shadow-glow rounded-full border-0 transition-all duration-300 hover:shadow-2xl hover:scale-105"
                onClick={() => user ? navigate('/report-form') : navigate('/auth')}
              >
                {user ? 'Begin Your Report' : 'Start Creating'}
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="px-10 py-6 text-lg border-border/50 bg-card/50 backdrop-blur-sm hover:bg-accent/50 rounded-full transition-all duration-300 hover:shadow-lg"
                asChild
              >
                <a href="/preview-report">
                  View Sample Reports
                </a>
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-8 pt-12 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 bg-card/50 px-4 py-2 rounded-full backdrop-blur-sm">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>30-50 page reports</span>
              </div>
              <div className="flex items-center gap-2 bg-card/50 px-4 py-2 rounded-full backdrop-blur-sm">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>1-2 hour delivery</span>
              </div>
              <div className="flex items-center gap-2 bg-card/50 px-4 py-2 rounded-full backdrop-blur-sm">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Starting from ₹30</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-card/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-6 px-4 py-2 rounded-full">
              <Award className="h-4 w-4 mr-2" />
              Premium Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We blend cutting-edge AI technology with artisanal attention to detail, 
              delivering reports that exceed academic expectations.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <img 
                src={studentWorkspace} 
                alt="Elegant student workspace" 
                className="rounded-2xl shadow-premium w-full h-[400px] object-cover"
              />
            </div>
            <div className="space-y-8">
              {features.slice(0, 2).map((feature, index) => (
                <div key={index} className="flex gap-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 order-2 lg:order-1">
              {features.slice(2).map((feature, index) => (
                <div key={index} className="flex gap-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-1 lg:order-2">
              <img 
                src={elegantDelivery} 
                alt="Premium delivery service" 
                className="rounded-2xl shadow-premium w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-card/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-6 px-4 py-2 rounded-full">
              Simple Process
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Four Steps to Excellence
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our streamlined process ensures quality results with minimal effort
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                step: "01", 
                title: "Submit Topic", 
                desc: "Share your research topic and specific requirements with our intelligent system" 
              },
              { 
                step: "02", 
                title: "AI Creation", 
                desc: "Our advanced AI crafts a comprehensive, well-structured report tailored to your needs" 
              },
              { 
                step: "03", 
                title: "Review & Payment", 
                desc: "Preview your beautifully formatted report and complete secure payment" 
              },
              { 
                step: "04", 
                title: "Premium Delivery", 
                desc: "Receive your professionally printed report with premium binding and materials" 
              }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto text-white font-bold text-xl shadow-glow group-hover:scale-110 transition-transform duration-300">
                    {step.step}
                  </div>
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-border -translate-x-10">
                      <div className="absolute right-0 top-1/2 w-2 h-2 bg-primary rounded-full -translate-y-1/2"></div>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-serif font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-6 px-4 py-2 rounded-full">
              <Heart className="h-4 w-4 mr-2" />
              Student Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Trusted by Students Across Nanded
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join hundreds of satisfied students who trust us for their academic success
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border/50 bg-card/70 backdrop-blur-sm hover:shadow-premium transition-all duration-300 group">
                <CardContent className="pt-8">
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 italic leading-relaxed font-light">
                    "{testimonial.comment}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">
                        {testimonial.avatar}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-secondary">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-12 lg:p-16 border border-border/50 shadow-premium">
            <Badge variant="outline" className="mb-6 px-4 py-2 rounded-full">
              Ready to Begin?
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Create Your Perfect Report Today
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Join the growing community of students who choose excellence. 
              Experience the future of academic report generation.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:opacity-90 text-white px-10 py-6 text-lg font-semibold shadow-glow rounded-full transition-all duration-300 hover:shadow-2xl hover:scale-105"
                onClick={() => user ? navigate('/report-form') : navigate('/auth')}
              >
                {user ? 'Create Report Now' : 'Get Started Today'}
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-10 py-6 text-lg rounded-full border-border/50 hover:bg-accent/30 transition-all duration-300"
                asChild
              >
                <a href="/dashboard">
                  Explore Dashboard
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}