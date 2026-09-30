import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { ToastProvider } from './context/ToastContext.js';
import { Navbar } from './components/common/Navbar.js';
import { Footer } from './components/common/Footer.js';
import { HomePage } from './pages/HomePage.js';
import { EventsPage } from './pages/EventsPage.js';
import { EventDetailPage } from './pages/EventDetailPage.js';
import { ClubsPage } from './pages/ClubsPage.js';
import { ClubDetailsPage } from './pages/ClubDetailsPage.js';
import { StudentDashboardPage } from './pages/StudentDashboardPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { SignupPage } from './pages/SignupPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { ContactPage } from './pages/ContactPage.js';
import { AdminLoginPage } from './pages/AdminLoginPage.js';
import { AdminLayout } from './components/admin/AdminLayout.js';
import { AdminDashboardPage } from './pages/AdminDashboardPage.js';
import { AdminEventsPage } from './pages/AdminEventsPage.js';
import { AdminRegistrationsPage } from './pages/AdminRegistrationsPage.js';
import { AdminClubsPage } from './pages/AdminClubsPage.js';
import { TermsPage } from './pages/TermsPage.js';
import { PrivacyPage } from './pages/PrivacyPage.js';
import { NotFoundPage } from './pages/NotFoundPage.js';

// Public Layout with Navbar & Footer
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-tech-bg flex flex-col justify-between">
      <div>
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Student & Community Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:idOrSlug" element={<EventDetailPage />} />
              <Route path="/clubs" element={<ClubsPage />} />
              <Route path="/clubs/:idOrSlug" element={<ClubDetailsPage />} />
              <Route path="/dashboard" element={<StudentDashboardPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="events" element={<AdminEventsPage />} />
              <Route path="registrations" element={<AdminRegistrationsPage />} />
              <Route path="clubs" element={<AdminClubsPage />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
