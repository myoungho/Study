const env = import.meta.env;

export const appConfig = {
  apiUrl: env.VITE_API_URL ?? "https://jsonplaceholder.typicode.com",
  appName: env.VITE_APP_NAME ?? "Second Brain Todo",
};
