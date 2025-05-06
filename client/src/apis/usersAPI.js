import axios from "axios";
import config from "../config";

//----- Registration -----
export const regesterAPI = async (userData) => {
  try {
    const response = await axios.post(
      `${config.API_URL}/api/users/register`,
      {
        username: userData?.username,
        email: userData?.email,
        password: userData?.password,
      },
      {
        withCredentials: true,
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Registration error:", error.message);
    throw error;
  }
};

//----- Login -----
export const loginAPI = async (userData) => {
  try {
    const response = await axios.post(
      `${config.API_URL}/api/users/login`,
      {
        email: userData?.email,
        password: userData?.password,
      },
      {
        withCredentials: true,
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
};

//----- Check Authentication -----
export const authAPI = async () => {
  try {
    const response = await axios.get(`${config.API_URL}/api/users/auth/check`, {
      withCredentials: true,
    });

    if (!response.data) {
      throw new Error("No data received from auth check");
    }

    return response.data;
  } catch (error) {
    console.error("Auth check error:", error.response?.data || error.message);
    throw error;
  }
};

//----- Logout -----
export const logoutAPI = async () => {
  try {
    const response = await axios.post(
      `${config.API_URL}/api/users/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Logout error:", error.message);
    throw error;
  }
};

//----- Dashboard -----
export const profileAPI = async () => {
  try {
    const profileResponse = await axios.get(
      `${config.API_URL}/api/users/profile`,
      {
        withCredentials: true,
        timeout: 5000,
      }
    );

    try {
      const paymentsResponse = await axios.get(
        `${config.API_URL}/api/stripe/payments`,
        {
          withCredentials: true,
          timeout: 5000,
        }
      );

      if (paymentsResponse.data && paymentsResponse.data.payments) {
        profileResponse.data.user.payments = paymentsResponse.data.payments;
      }
    } catch (paymentError) {
      console.warn("Failed to fetch payment history:", paymentError.message);
      if (!profileResponse.data.user.payments) {
        profileResponse.data.user.payments = [];
      }
    }

    return profileResponse?.data;
  } catch (error) {
    console.error("Profile fetch error:", error.message);
    if (error.response) {
      console.error(
        "Error response:",
        error.response.status,
        error.response.data
      );
    }
    throw error;
  }
};
