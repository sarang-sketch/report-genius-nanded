import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import ReportForm from "./pages/ReportForm";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/report-form" element={
                    <ProtectedRoute>
                      <ReportForm />
                    </ProtectedRoute>
                  } />
                  <Route path="/upload-reference" element={
                    <ProtectedRoute>
                      <div className="p-8 text-center">Upload Reference - Coming Soon</div>
                    </ProtectedRoute>
                  } />
                  <Route path="/preview-report" element={
                    <ProtectedRoute>
                      <div className="p-8 text-center">Preview Report - Coming Soon</div>
                    </ProtectedRoute>
                  } />
                  <Route path="/track-delivery" element={
                    <ProtectedRoute>
                      <div className="p-8 text-center">Track Delivery - Coming Soon</div>
                    </ProtectedRoute>
                  } />
                  <Route path="/download-history" element={
                    <ProtectedRoute>
                      <div className="p-8 text-center">Download History - Coming Soon</div>
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <div className="p-8 text-center">Dashboard - Coming Soon</div>
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
