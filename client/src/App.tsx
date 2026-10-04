import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GamificationProvider } from './context/GamificationContext';
import { RootLayout } from './layouts/RootLayout';

import { LandingPage } from './pages/LandingPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { ExplorePage } from './pages/ExplorePage';
import { DestinationDetailPage } from './pages/DestinationDetailPage';
import { VirtualVisitPage } from './pages/VirtualVisitPage';
import { ExperiencePage } from './pages/ExperiencePage';
import { TravelTwinPage } from './pages/TravelTwinPage';
import { SimulationPage } from './pages/SimulationPage';
import { ItineraryPage } from './pages/ItineraryPage';
import { TravelTogetherPage } from './pages/TravelTogetherPage';
import { PassportPage } from './pages/PassportPage';
import { MemoriesPage } from './pages/MemoriesPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';

export function App() {
  return (
    <AuthProvider>
      <GamificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="onboarding" element={<OnboardingPage />} />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="destination/:id" element={<DestinationDetailPage />} />
              <Route path="virtual-visit" element={<VirtualVisitPage />} />
              <Route path="experience/:destinationId" element={<ExperiencePage />} />
              <Route path="travel-twin" element={<TravelTwinPage />} />
              <Route path="simulate" element={<SimulationPage />} />
              <Route path="itinerary/:id" element={<ItineraryPage />} />
              <Route path="itinerary" element={<ItineraryPage />} />
              <Route path="travel-together" element={<TravelTogetherPage />} />
              <Route path="passport" element={<PassportPage />} />
              <Route path="memories" element={<MemoriesPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="admin" element={<AdminPage />} />
              {/* Catch-all redirect to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </GamificationProvider>
    </AuthProvider>
  );
}

export default App;
