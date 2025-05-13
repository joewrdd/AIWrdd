import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import React, { useRef, useEffect } from "react";
import AuthCheckingComponent from "../Alert/AuthCheckingComponent";

//----- Auth Route Component -----//
const AuthRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, isError } = useAuth();
  const isPreviouslyAuthenticated = useRef(false);
  const currentPathRef = useRef(location.pathname);

  const isLoginPage = location.pathname === "/login";

  //----- Use Effect For Handling Authentication -----//
  useEffect(() => {
    if (isAuthenticated) {
      isPreviouslyAuthenticated.current = true;
    }
    currentPathRef.current = location.pathname;
  }, [isAuthenticated, location.pathname]);

  //----- If Loading, Return Auth Checking Component -----//
  if (isLoading) {
    return <AuthCheckingComponent />;
  }

  //----- If Error Or Not Authenticated, Redirect To Login Page -----//
  if ((isError || isAuthenticated === false) && !isLoginPage) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthRoute;
