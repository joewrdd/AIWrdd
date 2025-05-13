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

//----- Auth Context For Handling Authentication -----//

export const AuthContext = createContext();

//----- Auth Provider For Handling Authentication -----//
export const AuthProvider = ({ children }) => {
  //----- Dispatch For Handling Redux Actions -----//
  const dispatch = useDispatch();

  //----- Ref For Handling  -----//
  const authCheckPerformedRef = useRef(false);
  const profileFetchRequestedRef = useRef(false);
  const initialMountRef = useRef(true);

  //----- Selectors For Handling Redux State -----//
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectUserLoading);
  const isError = useSelector(selectUserError);
  const authChecked = useSelector(selectAuthChecked);

  //----- Check Authentication -----//
  useEffect(() => {
    const checkAuth = async () => {
      //----- Check If Initial Mount Or Authentication Check Already Performed -----//
      if (
        !initialMountRef.current ||
        authCheckPerformedRef.current ||
        authChecked
      ) {
        return;
      }

      //----- Set Authentication Check Performed -----//
      authCheckPerformedRef.current = true;

      //----- Set Loading -----//
      try {
        dispatch(setLoading(true));
        const authStatus = await authAPI();

        //----- Fetch User Profile -----//
        if (authStatus) {
          dispatch(fetchUserProfile());
        }
      } catch (error) {
        //----- Log Error -----//
        console.error("Auth check failed:", error);
      } finally {
        //----- Set Authentication Checked -----//
        dispatch(setAuthChecked(true));
        dispatch(setLoading(false));
        initialMountRef.current = false;
      }
    };

    checkAuth();

    //----- Cleanup -----//
    return () => {
      initialMountRef.current = true;
    };
  }, [dispatch, authChecked]);

  //----- Login -----//
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

  //----- Logout -----//
  const logout = () => {
    authCheckPerformedRef.current = false;
    profileFetchRequestedRef.current = false;
    dispatch(logoutUser());
  };

  //----- Is Auth Loading -----//
  const isAuthLoading = isLoading && !authChecked;

  //----- Return Auth Context -----//
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
