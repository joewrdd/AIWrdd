import axios from "axios";
import config from "../config";

//----- Class For Handling Content History API -----//

//----- Get All Content History -----//
export const getAllContentHistoryAPI = async () => {
  try {
    const response = await axios.get(`${config.API_URL}/api/history`, {
      withCredentials: true,
      timeout: 5000, //
    });
    return response?.data;
  } catch (error) {
    console.error("Error fetching content history:", error);
    throw error;
  }
};

//----- View Specific Content History -----//
export const viewContentAPI = async (contentId) => {
  try {
    const response = await axios.get(
      `${config.API_URL}/api/history/${contentId}`,
      {
        withCredentials: true,
        timeout: 5000,
      }
    );
    return response?.data;
  } catch (error) {
    console.error(`Error viewing content ${contentId}:`, error);
    throw error;
  }
};

//----- Update Specific Content History -----//
export const updateContentAPI = async ({ contentId, content }) => {
  try {
    const response = await axios.put(
      `${config.API_URL}/api/history/${contentId}`,
      { content },
      {
        withCredentials: true,
        timeout: 5000,
      }
    );
    return response?.data;
  } catch (error) {
    console.error(`Error updating content ${contentId}:`, error);
    throw error;
  }
};

//----- Delete Specific Content History -----//
export const deleteContentAPI = async (contentId) => {
  try {
    const response = await axios.delete(
      `${config.API_URL}/api/history/${contentId}`,
      {
        withCredentials: true,
        timeout: 5000,
      }
    );
    return response?.data;
  } catch (error) {
    console.error(`Error deleting content ${contentId}:`, error);
    throw error;
  }
};
