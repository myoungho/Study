# TypeScript 실무 온보딩 가이드

## 초급: C# 개발자를 위한 개념 브리지
- **기본 타입 mapping**: `number ↔ int/double`, `string ↔ string`, `boolean ↔ bool`. `any`는 `object`보다 느슨한 타입으로 남용 금지.
- **인터페이스 = C# interface**지만 선택적 속성(`?`)과 인덱싱 시그니처가 추가됨.
- **제네릭 = C# 제네릭**과 동일한 개념. 단, 공변성/반공변성은 명시적으로 다루지 않습니다.

### 실습 1: 타입 선언과 추론
```ts
let counter = 0; // number로 추론
const appName: string = "Todo";

function add(a: number, b: number): number {
  return a + b;
}
```
- C#에서 `var`를 사용할 때와 동일하게, 초기 값으로 타입을 추론하지만 `strict` 모드에서는 `any` 허용 X.

### 실습 2: 인터페이스/타입 별칭
```ts
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

type TodoDraft = Omit<Todo, "id"> & { tempId: string };
```
- `Omit`, `Pick`은 C#의 `Select`, `Where`처럼 타입 차원에서 필드를 조작하는 유틸리티입니다.

## 중급: ASP.NET Core 패턴과 연결
### DTO/엔터티 매핑
```ts
import { z } from "zod";

export const todoSchema = z.object({
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
});

export type Todo = z.infer<typeof todoSchema>;
```
- ASP.NET Core에서 DTO 클래스를 정의하던 방식과 유사. Zod와 조합하면 모델 + 검증을 한 번에 정의할 수 있습니다.

### 제네릭 제약과 mapped type
```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```
- C#의 `where TKey : struct`와 유사하게 `K extends keyof T`로 허용 가능한 키를 제한합니다.

### 타입 가드
```ts
function isTodo(value: unknown): value is Todo {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof (value as { id: unknown }).id === "number"
  );
}
```
- C#의 `is` 패턴 매칭과 유사. 런타임 체크 결과를 컴파일러가 인지하도록 `value is Todo` 형태로 선언합니다.

## 고급: 대규모 코드베이스 관리
- **조건부 타입**: C#의 제네릭 특수화 같은 효과.
```ts
type Nullable<T> = T | null;
type ApiResponse<T> = T extends infer U ? { data: U; error?: never } : never;
```
- **템플릿 리터럴 타입**으로 라우트/권한 문자열을 안전하게 관리합니다.
```ts
type ApiRoute = `/api/${"todos" | "profile"}`;
```
- **모듈 보강(Module Augmentation)**: ASP.NET Core에서 `AddMvc` 옵션 확장하듯 외부 타입을 확장.

## 실무 체크리스트
- [ ] `any` 대신 `unknown` + 타입 가드 사용.
- [ ] 공통 타입은 `src/types`에서 관리하고 barrel 파일(`index.ts`)로 재노출.
- [ ] Axios/React Query 호출에는 제네릭을 지정해 응답 구조를 보장.
- [ ] ESLint + TS 오류는 무시하지 말고 즉시 수정.

## 프로젝트 숙제
1. `Todo` 모델에 `priority: "Low" | "Medium" | "High"` 추가하고 관련 컴포넌트/스토어 업데이트.
2. ASP.NET Core ViewModel ↔ TypeScript 타입 매핑 문서를 작성해 백엔드/프론트 타입 동기화 전략을 세우세요.
3. `Result<TSuccess, TError>` 스타일의 유틸 타입을 만들어 API 응답 패턴에 적용.

## 참고 자료
- [TypeScript 핸드북 (한국어 버전)](https://typescript-kr.github.io/) — C# 개발자에게 친숙한 설명.
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/) — 고급 문법 참고.
- [C# ↔ TypeScript Generics 비교 블로그](https://learn.microsoft.com/archive/msdn-magazine/2017/september/typescript-and-csharp-a-smoother-on-ramp-for-c-developers) — MS 공식 자료.
