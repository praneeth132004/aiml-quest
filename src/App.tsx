
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
import CoursesPage from "./pages/CoursesPage"; // Import CoursesPage
import CommunityPage from "./pages/CommunityPage";
import CreatePostPage from "./pages/CreatePostPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage"; // Import ProfilePage
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ClassDiagramPage from "./pages/ClassDiagramPage";
import PageLayout from "./components/layout/PageLayout"; // Import PageLayout

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Routes without Navbar/Footer */}
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* Routes with Navbar/Footer */}
            <Route path="/" element={<PageLayout><Index /></PageLayout>} />
            <Route path="/roadmap" element={<PageLayout requireAuth={true}><RoadmapPage /></PageLayout>} />
            <Route path="/quizzes" element={<PageLayout requireAuth={true}><QuizzesPage /></PageLayout>} />
            <Route path="/courses" element={<PageLayout requireAuth={true}><CoursesPage /></PageLayout>} /> {/* Add Courses Route */}
            <Route path="/community" element={<PageLayout requireAuth={true}><CommunityPage /></PageLayout>} />
            <Route path="/community/create-post" element={<PageLayout requireAuth={true}><CreatePostPage /></PageLayout>} />
            <Route path="/community/posts/:id" element={<PageLayout requireAuth={true}><PostPage /></PageLayout>} />
            <Route path="/profile" element={<PageLayout requireAuth={true}><ProfilePage /></PageLayout>} />
            <Route path="/architecture" element={<PageLayout><ClassDiagramPage /></PageLayout>} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
