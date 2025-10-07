# Zod 실무 온보딩 가이드

## 초급: C# DataAnnotations와의 연결
- **Zod 스키마 = ASP.NET Core `DataAnnotations` + FluentValidation**: 런타임 검증과 타입 추출을 동시에 제공합니다.
- **`z.infer` = C# `typeof(T)`와 유사**: 스키마에서 타입을 직접 빌려옵니다.

### 실습 1: 로그인 스키마
```ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "유효한 이메일을 입력하세요." }),
  password: z.string().min(8, { message: "비밀번호는 8자 이상" }),
});

type LoginValues = z.infer<typeof loginSchema>;
```
- ASP.NET Core `Required`, `EmailAddress` 속성을 붙이던 방식을 떠올리면 쉽게 대응됩니다.

## 중급: 복합 검증과 변환
### Cross-field 검증 (superRefine)
```ts
const signupSchema = z
  .object({
    name: z.string().min(2),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .superRefine((value, ctx) => {
    if (value.password !== value.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "비밀번호가 일치하지 않습니다.",
      });
    }
  });
```
- FluentValidation에서 `RuleFor(x => x.Password).Equal(x => x.ConfirmPassword)`와 동일한 패턴.

### 데이터 전처리
```ts
const todoSchema = z.object({
  title: z.string().transform((value) => value.trim()),
  dueDate: z.preprocess((value) => new Date(value as string), z.date()),
});
```
- ASP.NET Core 모델 바인딩에서 `IModelBinder`를 커스터마이즈하던 것과 비슷하게 입력을 정제합니다.

### Partial/DeepPartial
```ts
const todoUpdateSchema = todoSchema.partial();
```
- PATCH 요청처럼 일부 필드만 업데이트할 때 C# `JsonPatch` 문서와 유사한 역할.

## 고급: 타입 안전 API와 공유 모델
- **API 응답 보호**
```ts
const response = await api.get("/todos");
const todos = z.array(todoSchema).parse(response.data);
```
  - ASP.NET Core에서 DTO를 역직렬화한 뒤 `ModelState.IsValid`를 확인하는 과정과 동일.
- **공유 스키마**: 백엔드와 프론트가 모두 TypeScript를 쓴다면 `@acme/contracts` 같은 패키지로 스키마를 공유해 Swagger DTO 불일치를 줄일 수 있습니다.
- **에러 메시지 커스터마이징**: `z.setErrorMap`으로 글로벌 메시지를 지정하면 다국어 지원(ASP.NET Core `IStringLocalizer`)과 유사하게 동작합니다.

## 실무 체크리스트
- [ ] 스키마는 `src/types` 혹은 도메인 폴더로 분리.
- [ ] 사용자 입력에는 항상 `safeParse` 사용 → 실패 시 UI/로깅 처리.
- [ ] Zod와 React Hook Form resolver를 결합해 폼 검증을 일원화.
- [ ] API 응답 검증 유틸 `validateResponse(schema, data)`를 만들어 재사용.

## 프로젝트 숙제
1. `profileSchema`를 정의해 닉네임, 한 줄 소개, 연락처(정규식) 검증.
2. Todo API 응답을 `safeParse`로 감싸고, 실패 시 Sentry에 로깅.
3. C# DTO ↔ Zod 스키마 매핑 표를 작성해 백엔드 변경 사항을 추적.

## 참고 자료
- [Zod 공식 문서](https://zod.dev/?id=basic-usage)
- [DataAnnotations vs Zod 비교 글](https://dev.to/dceddia/validating-react-forms-with-zod)
- [FluentValidation to Zod 패턴](https://khalilstemmler.com/blogs/typescript/zod)
