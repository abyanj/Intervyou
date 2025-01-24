import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import HomePage from "./pages/HomePage.jsx";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import Interview from "./pages/Interview.jsx";
import StartInterview from "./pages/StartInterview.jsx";
import Feedback from "./pages/Feedback.jsx";
import ResponsiveAppBar from "./components/ResponsiveAppBar.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import NotFound from "./pages/NotFound.jsx";
import Upgrade from "./pages/Upgrade.jsx";

// Component to enforce authentication
// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setIsAuthenticated(true);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#0f0f0f",
          color: "#fff",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  const location = useLocation();
  const shouldShowAppBar = location.pathname !== "/"; // Don't show AppBar on HomePage

  return (
    <>
      {shouldShowAppBar && <ResponsiveAppBar />}
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<HomePage />} />
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview/:id"
          element={
            <ProtectedRoute>
              <Interview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview/:id/start"
          element={
            <ProtectedRoute>
              <StartInterview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview/:id/feedback"
          element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          }
        />
        <Route
          path="/how-it-works"
          element={
            <ProtectedRoute>
              <HowItWorks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upgrade"
          element={
            <ProtectedRoute>
              <Upgrade />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
      </Routes>
    </>
  );
}

export default function RootApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
