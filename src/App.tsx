import React, { lazy, Suspense } from 'react'; // Import lazy and Suspense
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
import SettingsPage from "./pages/SettingsPage"; // Import SettingsPage
import DashboardPage from "./pages/DashboardPage"; // Import DashboardPage
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ClassDiagramPage from "./pages/ClassDiagramPage";
// import ChatbotPage from './pages/ChatbotPage'; // Remove static import
import PageLayout from "./components/layout/PageLayout"; // Import PageLayout
import Navbar from "./components/layout/Navbar"; // Import Navbar
// Removed non-existent ProtectedRoute import

// Dynamically import ChatbotPage
const LazyChatbotPage = lazy(() => import('./pages/ChatbotPage'));

import TermsOfServicePage from '@/pages/legal/TermsOfServicePage';
import PrivacyPolicyPage from '@/pages/legal/PrivacyPolicyPage';
import CookiePolicyPage from '@/pages/legal/CookiePolicyPage';

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
            <Route path="/dashboard" element={<PageLayout requireAuth={true}><DashboardPage /></PageLayout>} /> {/* Add Dashboard Route */}
            <Route path="/roadmap" element={<PageLayout requireAuth={true}><RoadmapPage /></PageLayout>} />
            <Route path="/quizzes" element={<PageLayout requireAuth={true}><QuizzesPage /></PageLayout>} />
            <Route path="/courses" element={<PageLayout requireAuth={true}><CoursesPage /></PageLayout>} /> {/* Add Courses Route */}
            <Route path="/community" element={<PageLayout requireAuth={true}><CommunityPage /></PageLayout>} />
            <Route path="/community/create-post" element={<PageLayout requireAuth={true}><CreatePostPage /></PageLayout>} />
            <Route path="/community/posts/:id" element={<PageLayout requireAuth={true}><PostPage /></PageLayout>} />
            <Route path="/profile" element={<PageLayout requireAuth={true}><ProfilePage /></PageLayout>} />
            <Route path="/settings" element={<PageLayout requireAuth={true}><SettingsPage /></PageLayout>} /> {/* Add Settings Route */}
            {/* Chatbot Route with custom layout and dynamic import */}
            <Route path="/chatbot" element={
              <div className="flex flex-col h-screen">
                <Navbar />
                <main className="flex-1 overflow-hidden">
                  <Suspense fallback={<div className="flex justify-center items-center h-full">Loading Chatbot...</div>}>
                    <LazyChatbotPage />
                  </Suspense>
                </main>
              </div>
            } />
            <Route path="/architecture" element={<PageLayout><ClassDiagramPage /></PageLayout>} />
            <Route path="/legal/terms" element={<PageLayout><TermsOfServicePage /></PageLayout>} />
            <Route path="/legal/privacy" element={<PageLayout><PrivacyPolicyPage /></PageLayout>} />
            <Route path="/legal/cookies" element={<PageLayout><CookiePolicyPage /></PageLayout>} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
