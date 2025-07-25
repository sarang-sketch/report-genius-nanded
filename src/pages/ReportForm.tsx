import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { PricingCalculator } from "@/components/PricingCalculator";
import { 
  FileText, 
  Sparkles, 
  BookOpen, 
  GraduationCap,
  Building,
  ArrowRight
} from "lucide-react";

export default function ReportForm() {
  const [formData, setFormData] = useState({
    reportName: "",
    topic: "",
    pages: 30,
    format: "",
    printSide: "double" as "single" | "double",
    binding: true,
    cover: true,
    additionalInstructions: ""
  });

  const [currentPrice, setCurrentPrice] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const formats = [
    { id: "ieee", name: "IEEE Format", icon: BookOpen, description: "Standard IEEE paper format" },
    { id: "college", name: "College Format", icon: GraduationCap, description: "Standard college report format" },
    { id: "seminar", name: "Seminar Format", icon: Building, description: "Professional seminar format" },
    { id: "custom", name: "Custom Format", icon: FileText, description: "Upload your own reference" }
  ];

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Create Your AI Report
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Provide your requirements and let our AI generate a professional, 
            structured report tailored to your needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Report Details
                  </CardTitle>
                  <CardDescription>
                    Provide basic information about your report
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reportName">Report Title *</Label>
                    <Input
                      id="reportName"
                      placeholder="e.g., Machine Learning in Healthcare"
                      value={formData.reportName}
                      onChange={(e) => setFormData(prev => ({ ...prev, reportName: e.target.value }))}
                      className="bg-background/50"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic Description *</Label>
                    <Textarea
                      id="topic"
                      placeholder="Describe your topic in detail. The more specific you are, the better the AI can generate your report..."
                      value={formData.topic}
                      onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                      className="bg-background/50 min-h-24"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pages">Number of Pages</Label>
                    <Select
                      value={formData.pages.toString()}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, pages: parseInt(value) }))}
                    >
                      <SelectTrigger className="bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20">20 pages</SelectItem>
                        <SelectItem value="25">25 pages</SelectItem>
                        <SelectItem value="30">30 pages (Recommended)</SelectItem>
                        <SelectItem value="35">35 pages</SelectItem>
                        <SelectItem value="40">40 pages</SelectItem>
                        <SelectItem value="50">50+ pages</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Format Selection */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Format Selection
                  </CardTitle>
                  <CardDescription>
                    Choose your preferred report format
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.format}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, format: value }))}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {formats.map((format) => (
                      <div key={format.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={format.id} id={format.id} />
                        <div className="flex-1">
                          <Label
                            htmlFor={format.id}
                            className="flex items-center gap-3 p-4 border border-border/50 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                          >
                            <format.icon className="h-5 w-5 text-primary" />
                            <div>
                              <div className="font-medium">{format.name}</div>
                              <div className="text-sm text-muted-foreground">{format.description}</div>
                            </div>
                          </Label>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Print Options */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Print & Delivery Options</CardTitle>
                  <CardDescription>
                    Customize your print preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label>Print Side</Label>
                    <RadioGroup
                      value={formData.printSide}
                      onValueChange={(value: "single" | "double") => 
                        setFormData(prev => ({ ...prev, printSide: value }))
                      }
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="double" id="double" />
                        <Label htmlFor="double" className="cursor-pointer">
                          Double-sided (₹1/page)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="single" id="single" />
                        <Label htmlFor="single" className="cursor-pointer">
                          Single-sided (₹2/page)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="binding"
                      checked={formData.binding}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, binding: !!checked }))
                      }
                    />
                    <Label htmlFor="binding" className="cursor-pointer">
                      Spiral Binding (+₹5)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cover"
                      checked={formData.cover}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, cover: !!checked }))
                      }
                    />
                    <Label htmlFor="cover" className="cursor-pointer">
                      Plastic Cover (+₹3)
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Instructions */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Additional Instructions</CardTitle>
                  <CardDescription>
                    Any specific requirements or preferences? (Optional)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="e.g., Include specific sections, focus on certain aspects, add particular references..."
                    value={formData.additionalInstructions}
                    onChange={(e) => setFormData(prev => ({ ...prev, additionalInstructions: e.target.value }))}
                    className="bg-background/50 min-h-20"
                  />
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-gradient-primary hover:opacity-90 text-white py-6 text-lg font-semibold shadow-glow"
              >
                Generate Report with AI
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>

          {/* Pricing Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <PricingCalculator
                pages={formData.pages}
                printSide={formData.printSide}
                binding={formData.binding}
                cover={formData.cover}
                onPriceChange={setCurrentPrice}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}