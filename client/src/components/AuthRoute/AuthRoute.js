import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import React, { useRef, useEffect } from "react";
import AuthCheckingComponent from "../Alert/AuthCheckingComponent";

const AuthRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, isError } = useAuth();
  const isPreviouslyAuthenticated = useRef(false);
  const currentPathRef = useRef(location.pathname);

  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    if (isAuthenticated) {
      isPreviouslyAuthenticated.current = true;
    }
    currentPathRef.current = location.pathname;
  }, [isAuthenticated, location.pathname]);

  if (isLoading) {
    return <AuthCheckingComponent />;
  }

  if ((isError || isAuthenticated === false) && !isLoginPage) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthRoute;
