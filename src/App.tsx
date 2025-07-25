import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Home from "./pages/Home";
import ReportForm from "./pages/ReportForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report-form" element={<ReportForm />} />
            <Route path="/upload-reference" element={<div className="p-8 text-center">Upload Reference - Coming Soon</div>} />
            <Route path="/preview-report" element={<div className="p-8 text-center">Preview Report - Coming Soon</div>} />
            <Route path="/track-delivery" element={<div className="p-8 text-center">Track Delivery - Coming Soon</div>} />
            <Route path="/download-history" element={<div className="p-8 text-center">Download History - Coming Soon</div>} />
            <Route path="/dashboard" element={<div className="p-8 text-center">Dashboard - Coming Soon</div>} />
            <Route path="/login" element={<div className="p-8 text-center">Login - Coming Soon</div>} />
            <Route path="/register" element={<div className="p-8 text-center">Register - Coming Soon</div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
