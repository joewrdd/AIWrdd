import axios from "axios";
import config from "../config";

//----- Class For Handling Chat AI API -----//

//----- Generate Content -----
export const generateContentAPI = async (userPrompt) => {
  try {
    const response = await axios.post(
      `${config.API_URL}/api/openai/generate`,
      {
        prompt: userPrompt,
      },
      {
        withCredentials: true,
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};
