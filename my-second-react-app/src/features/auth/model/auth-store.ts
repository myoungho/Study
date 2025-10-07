import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  status: "anonymous" | "authenticated" | "loading";
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signUp: (credentials: { name: string; email: string; password: string }) => Promise<void>;
  signOut: () => void;
  bootstrap: () => void;
  reset: () => void;
}

const STORAGE_KEY = "my-second-react-app-auth";

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set) => ({
      user: null,
      token: null,
      status: "anonymous",
      async signIn({ email }) {
        set((state) => {
          state.status = "loading";
        });

        await new Promise((resolve) => setTimeout(resolve, 600));

        set((state) => {
          state.user = {
            id: crypto.randomUUID(),
            email,
            name: email.split("@")[0] ?? "Guest",
          };
          state.token = `dummy-token-${Date.now()}`;
          state.status = "authenticated";
        });
      },
      async signUp({ name, email }) {
        set((state) => {
          state.status = "loading";
        });

        await new Promise((resolve) => setTimeout(resolve, 600));

        set((state) => {
          state.user = {
            id: crypto.randomUUID(),
            email,
            name,
          };
          state.token = `dummy-token-${Date.now()}`;
          state.status = "authenticated";
        });
      },
      signOut() {
        set((state) => {
          state.user = null;
          state.token = null;
          state.status = "anonymous";
        });
      },
      bootstrap() {
        set((state) => {
          if (state.user && state.token) {
            state.status = "authenticated";
          }
        });
      },
      reset() {
        set((state) => {
          state.user = null;
          state.token = null;
          state.status = "anonymous";
        });
      },
    })),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        state?.bootstrap();
      },
    }
  )
);
