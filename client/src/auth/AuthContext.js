import { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authAPI } from "../apis/usersAPI";
import {
  selectIsAuthenticated,
  selectUserLoading,
  selectUserError,
  fetchUserProfile,
  logoutUser,
  setLoading,
} from "../redux/slices/userSlice";
import {
  selectAuthChecked,
  setAuthChecked,
} from "../redux/slices/processSlice";
import React from "react";

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  // Get auth state from Redux
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectUserLoading);
  const isError = useSelector(selectUserError);
  const authChecked = useSelector(selectAuthChecked);

  // Check auth status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch(setLoading(true));
        const authStatus = await authAPI();
        if (authStatus) {
          await dispatch(fetchUserProfile()).unwrap();
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        dispatch(setAuthChecked(true));
        dispatch(setLoading(false));
      }
    };

    checkAuth();
  }, [dispatch]);

  const login = async () => {
    // This will be called after a successful login API call
    dispatch(fetchUserProfile());
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isError,
        isLoading: isLoading && !authChecked,
        isSuccess: isAuthenticated && !isLoading && !isError,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

//----- Custom Hook For Destructuring -----
export const useAuth = () => {
  return useContext(AuthContext);
};
