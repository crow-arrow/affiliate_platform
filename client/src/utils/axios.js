import axios from "axios";
import { API_URL } from "../config";

const instance = axios.create({
  baseURL: `${API_URL}api`,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default instance;
