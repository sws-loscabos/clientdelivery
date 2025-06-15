
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Client from "./pages/Client";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./components/auth/AuthProvider";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<Layout />}>
                <Route index element={<Admin />} />
              </Route>
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={['client', 'admin']} />}>
              <Route path="/client" element={<Layout />}>
                <Route index element={<Client />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
