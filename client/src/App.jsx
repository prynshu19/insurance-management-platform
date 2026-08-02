import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, PublicRoute } from "./components/routes/ProtectedRoute";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import CustomersPage from "./pages/customers/CustomersPage";
import PoliciesPage from "./pages/policies/PoliciesPage";
import ClaimsPage from "./pages/claims/ClaimsPage";
import PaymentsPage from "./pages/payments/PaymentsPage";
import ReportsPage from "./pages/reports/ReportsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/policies" element={<PoliciesPage />} />
                <Route path="/claims" element={<ClaimsPage />} />
                <Route path="/payments" element={<PaymentsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
              </Route>
            </Route>

            {/* Default Catch-all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
