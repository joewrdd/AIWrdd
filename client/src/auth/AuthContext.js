import { createContext, useContext, useEffect, useRef } from "react";
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

  const authCheckPerformedRef = useRef(false);
  const profileFetchRequestedRef = useRef(false);
  const initialMountRef = useRef(true);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectUserLoading);
  const isError = useSelector(selectUserError);
  const authChecked = useSelector(selectAuthChecked);

  useEffect(() => {
    const checkAuth = async () => {
      if (
        !initialMountRef.current ||
        authCheckPerformedRef.current ||
        authChecked
      ) {
        return;
      }

      authCheckPerformedRef.current = true;

      try {
        dispatch(setLoading(true));
        const authStatus = await authAPI();

        if (authStatus) {
          dispatch(fetchUserProfile());
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        dispatch(setAuthChecked(true));
        dispatch(setLoading(false));
        initialMountRef.current = false;
      }
    };

    checkAuth();

    return () => {
      initialMountRef.current = true;
    };
  }, [dispatch, authChecked]);

  const login = async () => {
    if (profileFetchRequestedRef.current) {
      return;
    }

    profileFetchRequestedRef.current = true;
    try {
      await dispatch(fetchUserProfile()).unwrap();
    } finally {
      setTimeout(() => {
        profileFetchRequestedRef.current = false;
      }, 1000);
    }
  };

  const logout = () => {
    authCheckPerformedRef.current = false;
    profileFetchRequestedRef.current = false;
    dispatch(logoutUser());
  };

  const isAuthLoading = isLoading && !authChecked;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isError,
        isLoading: isAuthLoading,
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
