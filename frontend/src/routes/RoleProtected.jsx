import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

const RoleProtected = ({
  children,
  requiredRoles = [],
  fallback = "/unauthorized",
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If no user data, show loading state
  if (!user) {
    return <div>Loading...</div>;
  }

  // Check if user has required role
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default RoleProtected;
