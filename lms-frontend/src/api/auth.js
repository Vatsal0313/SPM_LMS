import axios from "axios";

const API_URL = "http://localhost:4000/api/auth";

export const register = async (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

export const login = async (userData) => {
  return axios.post(`${API_URL}/login`, userData, { withCredentials: true });
};

export const logout = async () => {
  return axios.post(`${API_URL}/logout`, { withCredentials: true });
};
