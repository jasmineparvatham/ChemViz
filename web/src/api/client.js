import axios from "axios";


export const API_BASE = "/api";

export function createClient(getToken) {
  const client = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
  });

  client.interceptors.request.use((config) => {
    const token = getToken?.();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return client;
}
