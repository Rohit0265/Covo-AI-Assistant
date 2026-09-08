import api from "../utils/axios";

const logout = async () => {
  try {
    const { data } = await api.get("/api/auth/logout");
    return data;
  } catch (error) {
    console.error("Logout error:", error);
    return null;
  }
};

export default logout;

