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
import Dashboard from "./pages/Dashboard";
import UploadReference from "./pages/UploadReference";
import PreviewReport from "./pages/PreviewReport";
import TrackDelivery from "./pages/TrackDelivery";
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
                      <UploadReference />
                    </ProtectedRoute>
                  } />
                  <Route path="/preview-report" element={
                    <ProtectedRoute>
                      <PreviewReport />
                    </ProtectedRoute>
                  } />
                  <Route path="/track-delivery" element={
                    <ProtectedRoute>
                      <TrackDelivery />
                    </ProtectedRoute>
                  } />
                  <Route path="/download-history" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
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
