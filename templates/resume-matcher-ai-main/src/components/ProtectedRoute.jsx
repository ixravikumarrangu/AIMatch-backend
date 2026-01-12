import { Navigate, useLocation } from 'react-router-dom';

// Simulated auth check - in real app, this would check actual auth state
const isAuthenticated = (type) => {
  // Check localStorage for simulated login state
  const authData = localStorage.getItem(`${type}Auth`);
  return authData === 'true';
};

const ProtectedRoute = ({ children, userType }) => {
  const location = useLocation();
  
  if (!isAuthenticated(userType)) {
    // Redirect to appropriate login page
    const loginPath = userType === 'company' ? '/company/login' : '/user/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
