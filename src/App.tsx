
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ImageKitProvider } from "@/components/common/ImageKitProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navigation from "@/components/Navigation";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import StoragePrivate from "./pages/StoragePrivate";
import StorageShared from "./pages/StorageShared";
import AIAssistant from "./pages/AIAssistant";
import Converter from "./pages/Converter";
import Feed from "./pages/Feed";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Verify from "./pages/Verify";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ImageKitProvider>
            <Routes>
              <Route path="/" element={
                <>
                  <Navigation />
                  <Index />
                </>
              } />
              <Route path="/about" element={
                <>
                  <Navigation />
                  <About />
                </>
              } />
              <Route path="/login" element={
                <>
                  <Navigation />
                  <Login />
                </>
              } />
              <Route path="/register" element={
                <>
                  <Navigation />
                  <Register />
                </>
              } />
              <Route path="/verify" element={
                <>
                  <Navigation />
                  <Verify />
                </>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/storage/private" element={
                <ProtectedRoute>
                  <StoragePrivate />
                </ProtectedRoute>
              } />
              <Route path="/storage/shared" element={
                <ProtectedRoute>
                  <StorageShared />
                </ProtectedRoute>
              } />
              <Route path="/ai-assistant" element={
                <ProtectedRoute>
                  <AIAssistant />
                </ProtectedRoute>
              } />
              <Route path="/converter" element={
                <ProtectedRoute>
                  <Converter />
                </ProtectedRoute>
              } />
              <Route path="/feed" element={
                <ProtectedRoute>
                  <Feed />
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ImageKitProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
