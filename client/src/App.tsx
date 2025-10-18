import React from "react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { store } from "./store/store";

// Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import CreateEventPage from "./pages/CreateEventPage";
import DashboardPage from "./pages/DashboardPage";
import EventDetailPage from "./pages/EventDetailPage";
import EventsPage from "./pages/EventsPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import ProvidersPage from "./pages/ProvidersPage";
import VenuesPage from "./pages/VenuesPage";

// Components
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Layout from "./components/Layout/Layout";

// Styles
import "./index.css";

// Configuration React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <div className="App min-h-screen bg-gray-50">
                <Routes>
                  {/* Routes publiques */}
                  <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="providers" element={<ProvidersPage />} />
                    <Route path="venues" element={<VenuesPage />} />
                  </Route>

                  {/* Routes protégées */}
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Layout />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="events" element={<EventsPage />} />
                    <Route path="events/:id" element={<EventDetailPage />} />
                    <Route path="events/create" element={<CreateEventPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                  </Route>

                  {/* Route 404 */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>

                {/* Notifications toast */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: "#363636",
                      color: "#fff",
                    },
                    success: {
                      duration: 3000,
                      iconTheme: {
                        primary: "#10B981",
                        secondary: "#fff",
                      },
                    },
                    error: {
                      duration: 5000,
                      iconTheme: {
                        primary: "#EF4444",
                        secondary: "#fff",
                      },
                    },
                  }}
                />
              </div>
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
