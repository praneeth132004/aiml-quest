
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";
import RoadmapPage from "./pages/RoadmapPage";
import QuizzesPage from "./pages/QuizzesPage";
import CommunityPage from "./pages/CommunityPage";
import CreatePostPage from "./pages/CreatePostPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage"; // Import ProfilePage
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ClassDiagramPage from "./pages/ClassDiagramPage";

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
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/quizzes" element={<QuizzesPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/create-post" element={<CreatePostPage />} />
            <Route path="/architecture" element={<ClassDiagramPage />} />
>>>>>>> f36f670b752f1848462edeaf87b44ba532b3a493
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";
import RoadmapPage from "./pages/RoadmapPage";
import QuizzesPage from "./pages/QuizzesPage";
import CommunityPage from "./pages/CommunityPage";
import CreatePostPage from "./pages/CreatePostPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage"; // Import ProfilePage
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ClassDiagramPage from "./pages/ClassDiagramPage";

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
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/quizzes" element={<QuizzesPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/create-post" element={<CreatePostPage />} />
            <Route path="/community/posts/:id" element={<PostPage />} />
            <Route path="/profile" element={<ProfilePage />} /> {/* Add Profile Route */}
            <Route path="/architecture" element={<ClassDiagramPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
=======
            <Route path="/architecture" element={<ClassDiagramPage />} />
>>>>>>> f36f670b752f1848462edeaf87b44ba532b3a493
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
