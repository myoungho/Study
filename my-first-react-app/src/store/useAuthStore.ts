/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // 로그인
      login: async (email: string, password: string) => {
        try {
          // 실제로는 API 호출
          // const response = await loginApi(email, password);

          // 테스트용 더미 데이터
          const dummyUser = {
            id: "1",
            email: email,
            name: "테스트 사용자",
          };
          const dummyToken = "dummy_jwt_token_" + Date.now();

          set({
            user: dummyUser,
            token: dummyToken,
            isAuthenticated: true,
          });
        } catch (error) {
          throw new Error("로그인 실패");
        }
      },

      // 회원가입
      signup: async (name: string, email: string, password: string) => {
        try {
          // 실제로는 API 호출
          // const response = await signupApi(name, email, password);

          // 테스트용 더미 데이터
          const dummyUser = {
            id: "1",
            email: email,
            name: name,
          };
          const dummyToken = "dummy_jwt_token_" + Date.now();

          set({
            user: dummyUser,
            token: dummyToken,
            isAuthenticated: true,
          });
        } catch (error) {
          throw new Error("회원가입 실패");
        }
      },

      // 로그아웃
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      // 인증 확인 (토큰 검증)
      checkAuth: () => {
        const { token } = get();
        if (token) {
          // 실제로는 토큰 검증 API 호출
          // validateToken(token)
          set({ isAuthenticated: true });
        } else {
          set({ isAuthenticated: false });
        }
      },
    }),
    {
      name: "auth-storage", // localStorage 키
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
