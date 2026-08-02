import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Redirect unauthenticated users to login
export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Redirect authenticated users away from auth pages (login/register)
export const PublicRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

// Restrict route to specific roles
export const RoleRoute = ({ roles }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!roles.includes(user?.role)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};
