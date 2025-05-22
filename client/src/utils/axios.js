import axios from "axios";
import { API_URL } from "../config";

const instance = axios.create({
  baseURL: `${API_URL}api`,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = window.localStorage.getItem("token");
  return config;
});

export default instance;
