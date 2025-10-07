# React Hook Form 실무 온보딩 가이드

## 초급: ASP.NET Core Model Binding에서 React Hook Form으로
- **useForm = ControllerBase.ModelState**: 입력 값과 검증 상태를 추적하는 컨테이너.
- **register = Razor `asp-for`**, WPF `Binding Path`와 동일하게 필드를 폼 상태에 연결.
- **resolver + Zod = DataAnnotations + FluentValidation**: 스키마 기반 검증을 통해 에러 메시지를 관리합니다.

### 실습 1: 기본 폼 구성
```tsx
import { useForm } from "react-hook-form";

type LoginValues = {
  email: string;
  password: string;
};

export function SimpleLoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>();

  const onSubmit = async (values: LoginValues) => {
    await fakeLogin(values); // ASP.NET Core의 AuthService 호출과 유사
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <label className="block">
        이메일
        <input
          type="email"
          {...register("email", {
            required: "필수 입력",
            pattern: { value: /@/, message: "이메일 형식을 확인하세요" },
          })}
          className="w-full rounded border px-3 py-2"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </label>
      <label className="block">
        비밀번호
        <input
          type="password"
          {...register("password", { minLength: { value: 8, message: "8자 이상" } })}
          className="w-full rounded border px-3 py-2"
        />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
      </label>
      <button type="submit" disabled={isSubmitting} className="w-full rounded bg-blue-600 py-2 text-white">
        로그인
      </button>
    </form>
  );
}
```

### 실습 2: Controller와 shadcn/ui 결합
```tsx
import { Controller, useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";

<Controller
  name="terms"
  control={control}
  rules={{ required: "약관 동의 필요" }}
  render={({ field }) => (
    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
  )}
/>
```
- ASP.NET Core TagHelper가 커스텀 input을 처리하는 것과 유사하게 `Controller`가 값을 매핑합니다.

## 중급: Zod 결합과 폼 모듈화
### resolver 설정
```ts
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

type SignupValues = z.infer<typeof signupSchema>;

const methods = useForm<SignupValues>({
  resolver: zodResolver(signupSchema),
  defaultValues: {
    name: "",
    email: "",
    password: "",
  },
});
```
- ASP.NET Core에서 `FluentValidation`을 DI 컨테이너에 등록하던 방식과 동일한 검증 체계를 얻습니다.

### FormProvider로 큰 폼 구성
```tsx
import { FormProvider } from "react-hook-form";

<FormProvider {...methods}>
  <form onSubmit={methods.handleSubmit(onSubmit)}>
    <ProfileSection />
    <PasswordSection />
  </form>
</FormProvider>
```
- WPF에서 ViewModel을 DataContext로 내려주는 것과 동일한 패턴입니다.

## 고급: 실무 패턴
- **비동기 검증**: 이메일 중복 확인 같은 서버 검증은 `handleSubmit` 안에서 API 호출 후 `setError`로 결과를 전달.
- **폼 상태 관찰**: `watch`, `useWatch`로 특정 필드 변화에 반응 — Razor의 `ModelState` 관찰과 유사.
- **필드 배열**: `useFieldArray`로 동적 폼을 구현하면 WPF `ItemsControl` + DataTemplate과 유사한 구조.
- **성과 최적화**: 필요한 컴포넌트만 렌더하기 위해 `FormField` 컴포넌트를 만들고 `Controller`로 감싸 재사용.

## 실무 체크리스트
- [ ] `isSubmitting`, `isValid`, `isDirty` 등 상태를 활용해 UX 제어.
- [ ] 서버 에러는 `setError("root", { message: "" })`로 표시.
- [ ] 제출 성공 후 `reset()`으로 폼 초기화 혹은 기존 값 유지.
- [ ] 값이 종속된 필드는 `watch`로 관찰하고, WPF `PropertyChanged` 이벤트처럼 후속 로직을 실행.

## 프로젝트 숙제
1. 회원가입 폼에 비밀번호 확인 필드를 추가하고 `superRefine`으로 일치 여부 검증.
2. ASP.NET Core API를 호출해 이메일 중복 검사를 수행하고 `setError`로 메시지를 노출.
3. WPF Wizard를 참고해 Step-by-step 다중 폼을 `FormProvider`로 구성.

## 참고 자료
- [React Hook Form Docs](https://react-hook-form.com/get-started)
- [ASP.NET Core Model Binding 개념](https://learn.microsoft.com/aspnet/core/mvc/models/model-binding)
- [Zod + React Hook Form 패턴](https://react-hook-form.com/docs/useform#resolver)
