import axios from "axios";
import { appConfig } from "@/shared/config/env";
import { useAuthStore } from "@/features/auth/model/auth-store";

export const httpClient = axios.create({
  baseURL: appConfig.apiUrl,
  timeout: 10_000,
});

httpClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().reset();
      window.location.href = "/auth/sign-in";
    }
    return Promise.reject(error);
  }
);
