# 9단계: 인증 (Authentication)

## 목표
JWT 기반 사용자 인증 시스템 구현

**학습 내용:**
- JWT (JSON Web Token) 이해
- 로그인/회원가입 구현
- 토큰 저장 및 관리
- Protected Routes
- 인증 상태 관리
- 자동 로그인

---

## Step 1: JWT 이해

### JWT란?

**JSON Web Token**
- 서버와 클라이언트 간 정보를 안전하게 전송하는 토큰
- Header.Payload.Signature 구조
- 서버가 발급하고 클라이언트가 저장

### JWT 구조

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**디코딩:**
```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022,
  "exp": 1516242622
}
```

### C# 개발자를 위한 비교

**C# ASP.NET Core:**
```csharp
var token = new JwtSecurityTokenHandler().WriteToken(
    new JwtSecurityToken(
        claims: new[] { new Claim("userId", userId) },
        expires: DateTime.UtcNow.AddHours(1),
        signingCredentials: credentials
    )
);
```

**JavaScript:**
```typescript
// 서버에서 생성된 토큰을 받아서 저장
localStorage.setItem("token", token);
```

---

## Step 2: 인증 Store 생성

### 2-1. useAuthStore.ts

**파일:** `src/store/useAuthStore.ts` (새로 생성)

```typescript
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
```

**주요 개념:**

**persist 미들웨어:**
- 상태를 localStorage에 자동 저장
- 새로고침해도 유지됨
- 로그인 상태 유지

---

## Step 3: Protected Route 컴포넌트

### 3-1. ProtectedRoute.tsx

**파일:** `src/components/auth/ProtectedRoute.tsx` (새로 생성)

```tsx
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    // 로그인 페이지로 리다이렉트
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

### 3-2. App.tsx에 적용

**파일:** `src/App.tsx`

```tsx
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Routes 수정
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<HomePage />} />
    <Route path="about" element={<AboutPage />} />
    <Route path="login" element={<LoginPage />} />
    <Route path="signup" element={<SignupPage />} />

    {/* Protected Routes */}
    <Route
      path="todos"
      element={
        <ProtectedRoute>
          <TodosPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="todos/:id"
      element={
        <ProtectedRoute>
          <TodoDetailPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="todos/:id/edit"
      element={
        <ProtectedRoute>
          <TodoEditPage />
        </ProtectedRoute>
      }
    />

    <Route path="*" element={<NotFoundPage />} />
  </Route>
</Routes>
```

---

## Step 4: 로그인 페이지 완성

### 4-1. LoginPage.tsx 수정

**파일:** `src/pages/LoginPage.tsx`

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { loginSchema, type LoginInput } from "@/types/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setError(null);
      await login(data.email, data.password);
      navigate("/todos"); // 로그인 성공 시 할 일 페이지로
    } catch (err) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>로그인</CardTitle>
          <CardDescription>계정에 로그인하세요</CardDescription>
        </CardHeader>
        <CardContent>
          {/* 에러 메시지 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* 이메일 */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 비밀번호 */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 로그인 버튼 */}
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "로그인 중..." : "로그인"}
              </Button>

              {/* 회원가입 링크 */}
              <p className="text-center text-sm text-gray-600">
                계정이 없으신가요?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline">
                  회원가입
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Step 5: 회원가입 페이지 완성

### 5-1. SignupPage.tsx 수정

**파일:** `src/pages/SignupPage.tsx`

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { signupSchema, type SignupInput } from "@/types/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function SignupPage() {
  const navigate = useNavigate();
  const signup = useAuthStore((state) => state.signup);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });

  const onSubmit = async (data: SignupInput) => {
    try {
      setError(null);
      await signup(data.name, data.email, data.password);
      navigate("/todos"); // 회원가입 성공 시 할 일 페이지로
    } catch (err) {
      setError("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>회원가입</CardTitle>
          <CardDescription>새 계정을 만드세요</CardDescription>
        </CardHeader>
        <CardContent>
          {/* 에러 메시지 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* 이름 */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input placeholder="홍길동" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 이메일 */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 비밀번호 */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 비밀번호 확인 */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호 확인</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 회원가입 버튼 */}
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "가입 중..." : "회원가입"}
              </Button>

              {/* 로그인 링크 */}
              <p className="text-center text-sm text-gray-600">
                이미 계정이 있으신가요?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  로그인
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Step 6: Header에 로그인/로그아웃 추가

### 6-1. Header.tsx 수정

**파일:** `src/components/layout/Header.tsx`

```tsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Todo App
          </Link>

          {/* 네비게이션 */}
          <nav className="flex gap-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-blue-600 transition-colors ${
                  isActive ? "text-blue-600 font-semibold" : "text-gray-600"
                }`
              }
            >
              홈
            </NavLink>
            {isAuthenticated && (
              <NavLink
                to="/todos"
                className={({ isActive }) =>
                  `hover:text-blue-600 transition-colors ${
                    isActive ? "text-blue-600 font-semibold" : "text-gray-600"
                  }`
                }
              >
                할 일
              </NavLink>
            )}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `hover:text-blue-600 transition-colors ${
                  isActive ? "text-blue-600 font-semibold" : "text-gray-600"
                }`
              }
            >
              소개
            </NavLink>
          </nav>

          {/* 로그인/로그아웃 */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">
                  {user?.name}님
                </span>
                <Button onClick={handleLogout} variant="outline">
                  로그아웃
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button>로그인</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
```

---

## Step 7: Axios Interceptor 설정

### 7-1. axios 인스턴스 생성

**파일:** `src/api/axios.ts` (새로 생성)

```typescript
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 10000,
});

// Request Interceptor: 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: 401 에러 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 로그아웃
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 7-2. todoApi.ts 수정

```typescript
import api from "./axios";

// axios 대신 api 사용
export const getTodos = async () => {
  const response = await api.get("/todos");
  return response.data;
};
```

---

## Step 8: 프로필 페이지 (선택사항)

### 8-1. ProfilePage.tsx

**파일:** `src/pages/ProfilePage.tsx` (새로 생성)

```tsx
import { useAuthStore } from "@/store/useAuthStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function ProfilePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>프로필</CardTitle>
          <CardDescription>계정 정보</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">이름</label>
            <p className="text-lg">{user?.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">이메일</label>
            <p className="text-lg">{user?.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">사용자 ID</label>
            <p className="text-sm text-gray-600">{user?.id}</p>
          </div>

          <Button variant="destructive" onClick={handleLogout}>
            로그아웃
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 핵심 개념 정리

### 1. 인증 흐름

```
1. 로그인 → 서버에서 JWT 발급
2. 토큰 저장 → localStorage
3. API 요청 → Header에 토큰 포함
4. 토큰 검증 → 서버에서 확인
5. 토큰 만료 → 재로그인
```

### 2. Protected Route

```tsx
function ProtectedRoute({ children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
}
```

### 3. Token Storage

**LocalStorage (사용 중):**
- 장점: 간단, 자동 저장
- 단점: XSS 공격 위험

**Cookie (httpOnly):**
- 장점: XSS 방어
- 단점: CSRF 공격 위험

---

## C# 개발자를 위한 비교

### ASP.NET Core Identity vs Custom Auth

**ASP.NET Core:**
```csharp
[Authorize]
public class TodoController : Controller
{
    // 인증된 사용자만 접근
}
```

**React Protected Route:**
```tsx
<Route
  path="/todos"
  element={<ProtectedRoute><TodosPage /></ProtectedRoute>}
/>
```

---

## 체크리스트

- [ ] JWT 개념 이해
- [ ] useAuthStore 생성
- [ ] ProtectedRoute 구현
- [ ] LoginPage 완성
- [ ] SignupPage 완성
- [ ] Header에 로그인/로그아웃 추가
- [ ] Axios Interceptor 설정
- [ ] 로그인 테스트
- [ ] 로그아웃 테스트
- [ ] Protected Route 테스트

---

## 다음 단계

9단계를 완료했다면 **10단계: 배포 (Vercel)**로 진행합니다.

---

**작성일:** 2025-10-07
**난이도:** ⭐⭐⭐⭐☆
**소요 시간:** 4-5시간

**주의:** 이 가이드는 데모용입니다. 실제 프로덕션에서는 백엔드 API가 필요합니다!
