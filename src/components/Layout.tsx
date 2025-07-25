import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Zap } from "lucide-react";
import logoImage from "@/assets/logo.png";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border/50 bg-card/50 backdrop-blur-lg flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="p-2 hover:bg-accent/50 rounded-lg transition-colors" />
              
              <div className="flex items-center gap-3">
                <img 
                  src={logoImage} 
                  alt="NaN Report Hub" 
                  className="h-8 w-auto"
                />
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-foreground">
                    NaN Report Hub
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    AI-Powered Report Generation & Delivery
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                <Zap className="h-4 w-4" />
                Live in Nanded
              </div>
              <ThemeToggle />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}