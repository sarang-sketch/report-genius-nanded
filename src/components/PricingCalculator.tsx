import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, FileText, Printer, Truck } from "lucide-react";

interface PricingCalculatorProps {
  pages: number;
  printSide: "single" | "double";
  binding: boolean;
  cover: boolean;
  className?: string;
  onPriceChange?: (price: number) => void;
}

export function PricingCalculator({
  pages,
  printSide = "double",
  binding = true,
  cover = true,
  className = "",
  onPriceChange
}: PricingCalculatorProps) {
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    let price = 0;

    // Printing cost calculation
    if (printSide === "double") {
      price += pages * 1; // ₹1 per page for double-sided
    } else {
      // Single-sided pricing
      if (pages <= 20) {
        price += pages * 2; // ₹2 per page for ≤20 pages
      } else {
        price += pages * 1.5; // ₹1.5 per page for >20 pages
      }
    }

    // Add-ons
    if (binding) price += 5; // ₹5 for spiral binding
    if (cover) price += 3; // ₹3 for plastic cover

    // Delivery charges (free for orders >₹50)
    const deliveryCharge = price > 50 ? 0 : 15;
    price += deliveryCharge;

    setTotalPrice(price);
    onPriceChange?.(price);
  }, [pages, printSide, binding, cover, onPriceChange]);

  const printingCost = printSide === "double" 
    ? pages * 1 
    : pages <= 20 
      ? pages * 2 
      : pages * 1.5;

  const addOnsCost = (binding ? 5 : 0) + (cover ? 3 : 0);
  const deliveryCharge = totalPrice > 50 ? 0 : 15;

  return (
    <Card className={`bg-gradient-secondary border-border/50 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Price Calculator</CardTitle>
        </div>
        <CardDescription>
          Transparent pricing for your report printing & delivery
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Printing Cost */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                Printing ({pages} pages, {printSide}-sided)
              </span>
            </div>
            <span className="text-sm font-semibold">₹{printingCost}</span>
          </div>

          {printSide === "single" && pages > 20 && (
            <div className="text-xs text-muted-foreground pl-6">
              Special rate: ₹1.5/page for 20+ pages
            </div>
          )}
        </div>

        <Separator />

        {/* Add-ons */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Add-ons</h4>
          
          {binding && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Printer className="h-4 w-4 text-muted-foreground" />
                <span>Spiral Binding</span>
              </div>
              <span>₹5</span>
            </div>
          )}

          {cover && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>Plastic Cover</span>
              </div>
              <span>₹3</span>
            </div>
          )}

          {!binding && !cover && (
            <div className="text-xs text-muted-foreground">
              No add-ons selected
            </div>
          )}
        </div>

        <Separator />

        {/* Delivery */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Delivery in Nanded</span>
          </div>
          <div className="flex items-center gap-2">
            {deliveryCharge === 0 ? (
              <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
                FREE
              </Badge>
            ) : (
              <span className="text-sm">₹{deliveryCharge}</span>
            )}
          </div>
        </div>

        {deliveryCharge === 0 && (
          <div className="text-xs text-success pl-6">
            Free delivery on orders above ₹50
          </div>
        )}

        <Separator />

        {/* Total */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-semibold text-foreground">Total</span>
          <span className="text-xl font-bold text-primary">₹{totalPrice}</span>
        </div>

        {/* Additional Info */}
        <div className="bg-primary/5 rounded-lg p-3 mt-4">
          <p className="text-xs text-muted-foreground">
            ⚡ Delivery within 1-2 hours • 📍 Nanded city only • 💳 First 2 orders prepaid
          </p>
        </div>
      </CardContent>
    </Card>
  );
}