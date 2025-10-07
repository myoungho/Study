# 7단계: React Hook Form + Zod (폼 관리)

## 목표
복잡한 폼을 효율적으로 관리하고 강력한 유효성 검증 구현

**학습 내용:**
- React Hook Form 설치 및 기본
- useForm Hook
- Zod 스키마 정의
- zodResolver 통합
- shadcn/ui Form 컴포넌트
- 에러 메시지 표시

---

## Step 1: 패키지 설치

### 1-1. React Hook Form + Zod 설치

```bash
npm install react-hook-form zod @hookform/resolvers
```

### 1-2. shadcn/ui Form 컴포넌트 설치

```bash
npx shadcn@latest add form
npx shadcn@latest add label
npx shadcn@latest add textarea
```

### 1-3. 설치 확인

`package.json`:
```json
{
  "dependencies": {
    "react-hook-form": "^7.x.x",
    "zod": "^3.x.x",
    "@hookform/resolvers": "^3.x.x"
  }
}
```

---

## Step 2: Zod 스키마 이해

### C# 개발자를 위한 비교

**C# Data Annotations:**
```csharp
public class TodoDto
{
    [Required(ErrorMessage = "제목은 필수입니다")]
    [StringLength(100, MinimumLength = 3)]
    public string Title { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }
}
```

**Zod Schema:**
```typescript
const todoSchema = z.object({
  title: z.string()
    .min(3, "제목은 최소 3자 이상이어야 합니다")
    .max(100, "제목은 최대 100자까지 가능합니다"),
  description: z.string()
    .max(500, "설명은 최대 500자까지 가능합니다")
    .optional()
});
```

---

## Step 3: Todo 추가 폼 개선

### 3-1. types 폴더 생성

```
src/
├── types/
│   └── todo.ts           ← 새로 생성
```

### 3-2. todo.ts

**파일:** `src/types/todo.ts`

```typescript
import { z } from "zod";

// Todo 타입
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  description?: string;
}

// Todo 추가 스키마
export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, "할 일을 입력해주세요")
    .min(3, "할 일은 최소 3자 이상이어야 합니다")
    .max(100, "할 일은 최대 100자까지 가능합니다"),
  description: z
    .string()
    .max(500, "설명은 최대 500자까지 가능합니다")
    .optional()
    .or(z.literal("")),
});

// Todo 수정 스키마
export const updateTodoSchema = z.object({
  title: z
    .string()
    .min(1, "할 일을 입력해주세요")
    .min(3, "할 일은 최소 3자 이상이어야 합니다")
    .max(100, "할 일은 최대 100자까지 가능합니다"),
  description: z
    .string()
    .max(500, "설명은 최대 500자까지 가능합니다")
    .optional()
    .or(z.literal("")),
  completed: z.boolean(),
});

// 타입 추출
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
```

### 3-3. TodoInput.tsx 개선

**파일:** `src/components/TodoInput.tsx`

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { useTodoStore } from "@/store/useTodoStore";
import { createTodoSchema, type CreateTodoInput } from "@/types/todo";

export function TodoInput() {
  const { loading, addTodo } = useTodoStore();

  const form = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: CreateTodoInput) => {
    await addTodo(data.title);
    form.reset();
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* 제목 */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>할 일</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="할 일을 입력하세요"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 설명 (선택) */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>설명 (선택)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="상세 설명을 입력하세요"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 버튼 */}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "추가 중..." : "추가"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
```

**주요 개념:**

**useForm Hook:**
```typescript
const form = useForm<CreateTodoInput>({
  resolver: zodResolver(createTodoSchema),  // Zod 검증
  defaultValues: { title: "", description: "" }
});
```

**FormField:**
```tsx
<FormField
  control={form.control}
  name="title"
  render={({ field }) => (
    <FormItem>
      <FormLabel>레이블</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />  {/* 에러 메시지 자동 표시 */}
    </FormItem>
  )}
/>
```

---

## Step 4: Todo 수정 페이지 생성

### 4-1. TodoEditPage.tsx

**파일:** `src/pages/TodoEditPage.tsx`

```tsx
import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTodoStore } from "@/store/useTodoStore";
import { updateTodoSchema, type UpdateTodoInput } from "@/types/todo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export function TodoEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { todos, toggleTodo } = useTodoStore();

  const todo = todos.find((t) => t.id === Number(id));

  const form = useForm<UpdateTodoInput>({
    resolver: zodResolver(updateTodoSchema),
    defaultValues: {
      title: "",
      description: "",
      completed: false,
    },
  });

  useEffect(() => {
    if (todo) {
      form.reset({
        title: todo.title,
        description: todo.description || "",
        completed: todo.completed,
      });
    }
  }, [todo, form]);

  if (!todo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>할 일을 찾을 수 없습니다</CardTitle>
        </CardHeader>
        <CardContent>
          <Link to="/todos">
            <Button>목록으로 돌아가기</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const onSubmit = async (data: UpdateTodoInput) => {
    // 여기서는 제목과 설명만 업데이트
    // 실제로는 API 호출이 필요하지만, JSONPlaceholder는 지원 안 함
    console.log("Update data:", data);
    navigate(`/todos/${id}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>할 일 수정</CardTitle>
          <CardDescription>할 일을 수정하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* 제목 */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>제목</FormLabel>
                    <FormControl>
                      <Input placeholder="할 일 제목" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 설명 */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>설명</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="상세 설명"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 완료 상태 */}
              <FormField
                control={form.control}
                name="completed"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer">완료됨</FormLabel>
                  </FormItem>
                )}
              />

              {/* 버튼 */}
              <div className="flex gap-3">
                <Button type="submit">저장</Button>
                <Link to={`/todos/${id}`}>
                  <Button type="button" variant="outline">
                    취소
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 4-2. TodoDetailPage에 수정 버튼 추가

**파일:** `src/pages/TodoDetailPage.tsx`

기존 버튼 부분에 수정 버튼 추가:

```tsx
{/* 버튼 */}
<div className="flex gap-3">
  <Link to="/todos">
    <Button variant="outline">← 목록으로</Button>
  </Link>
  <Link to={`/todos/${id}/edit`}>
    <Button>수정</Button>
  </Link>
  <Button variant="destructive" onClick={handleDelete}>
    삭제
  </Button>
</div>
```

---

## Step 5: 로그인 폼 구현 (준비)

### 5-1. 로그인 스키마

**파일:** `src/types/auth.ts` (새로 생성)

```typescript
import { z } from "zod";

// 로그인 스키마
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다"),
  password: z
    .string()
    .min(1, "비밀번호를 입력해주세요")
    .min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
});

// 회원가입 스키마
export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력해주세요")
      .email("올바른 이메일 형식이 아닙니다"),
    password: z
      .string()
      .min(1, "비밀번호를 입력해주세요")
      .min(6, "비밀번호는 최소 6자 이상이어야 합니다")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "비밀번호는 대소문자와 숫자를 포함해야 합니다"
      ),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요"),
    name: z
      .string()
      .min(1, "이름을 입력해주세요")
      .min(2, "이름은 최소 2자 이상이어야 합니다"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

// 타입 추출
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
```

### 5-2. LoginPage 개선

**파일:** `src/pages/LoginPage.tsx`

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
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
import { loginSchema, type LoginInput } from "@/types/auth";

export function LoginPage() {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    console.log("Login data:", data);
    // 9단계에서 실제 구현
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>로그인</CardTitle>
          <CardDescription>계정에 로그인하세요</CardDescription>
        </CardHeader>
        <CardContent>
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

              {/* 버튼 */}
              <Button type="submit" className="w-full">
                로그인
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

## Step 6: 회원가입 페이지

### 6-1. SignupPage.tsx

**파일:** `src/pages/SignupPage.tsx` (새로 생성)

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
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
import { signupSchema, type SignupInput } from "@/types/auth";

export function SignupPage() {
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
    console.log("Signup data:", data);
    // 9단계에서 실제 구현
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>회원가입</CardTitle>
          <CardDescription>새 계정을 만드세요</CardDescription>
        </CardHeader>
        <CardContent>
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

              {/* 버튼 */}
              <Button type="submit" className="w-full">
                회원가입
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

## Step 7: 라우트 추가

### 7-1. App.tsx 수정

```tsx
import { TodoEditPage } from "./pages/TodoEditPage";
import { SignupPage } from "./pages/SignupPage";

// Routes에 추가
<Route path="todos/:id/edit" element={<TodoEditPage />} />
<Route path="signup" element={<SignupPage />} />
```

---

## 핵심 개념 정리

### 1. useForm Hook

```typescript
const form = useForm<FormData>({
  resolver: zodResolver(schema),  // 검증 로직
  defaultValues: { ... },          // 초기값
  mode: "onChange",                // 검증 시점
});
```

### 2. Zod 스키마

```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
}).refine(
  (data) => data.password === data.confirmPassword,
  { message: "비밀번호 불일치" }
);
```

### 3. FormField

```tsx
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      <FormLabel>레이블</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

## C# 개발자를 위한 비교

### ASP.NET Core MVC vs React Hook Form

**ASP.NET Core:**
```csharp
[HttpPost]
public IActionResult Create([FromBody] TodoDto dto)
{
    if (!ModelState.IsValid)
        return BadRequest(ModelState);

    // 처리
}
```

**React Hook Form:**
```typescript
const onSubmit = (data: FormData) => {
  // 이미 검증됨!
  // 처리
};
```

---

## 체크리스트

- [ ] React Hook Form + Zod 설치
- [ ] shadcn/ui Form 컴포넌트 설치
- [ ] types/todo.ts 생성
- [ ] types/auth.ts 생성
- [ ] TodoInput 개선
- [ ] TodoEditPage 생성
- [ ] LoginPage 개선
- [ ] SignupPage 생성
- [ ] 라우트 추가
- [ ] 모든 폼 테스트

---

## 다음 단계

7단계를 완료했다면 **8단계: TanStack Query**로 진행합니다.

---

**작성일:** 2025-10-07
**난이도:** ⭐⭐⭐⭐☆
**소요 시간:** 3-4시간
