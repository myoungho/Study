# React 실무 온보딩 가이드

## 초급: ASP.NET/WPF 개발자를 위한 개념 연결
- **React 컴포넌트 = ASP.NET Razor 컴포넌트 or WPF UserControl**: props는 Razor의 `parameters`, WPF `DependencyProperty`와 유사하게 부모가 데이터를 주입합니다.
- **상태(state) = WPF ViewModel의 Property + INotifyPropertyChanged**: `useState` 업데이트가 곧 렌더 트리 재평가입니다.
- **렌더 함수 = Razor View + XAML 템플릿**: JSX는 HTML과 JavaScript가 결합된 문법으로, Razor의 `@{ }`, WPF의 `{Binding }`에 해당하는 표현식을 `{ }`로 적습니다.

### 실습 1: 함수형 컴포넌트와 state
```tsx
import { useState } from "react";

type GreetingProps = { name: string };

export function Greeting({ name }: GreetingProps) {
  const [count, setCount] = useState(0);

  return (
    <section className="space-y-2">
      <p>{name}님, 반갑습니다.</p>
      <button
        className="rounded bg-emerald-600 px-3 py-2 text-white"
        onClick={() => setCount((prev) => prev + 1)}
      >
        오늘 인사한 횟수: {count}
      </button>
    </section>
  );
}
```
- ASP.NET Core Razor에서 `ViewComponent`를 만들던 방식과 비교해보세요. state는 Razor의 `TempData`가 아니라 WPF `ViewModel`처럼 UI 전체와 즉시 동기화됩니다.

### 실습 2: 사이드이펙트와 라이프사이클
```tsx
import { useEffect, useRef, useState } from "react";

export function SearchBox() {
  const [term, setTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus(); // WPF Loaded 이벤트와 유사
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => console.log("검색", term), 300);
    return () => window.clearTimeout(id); // WPF DispatcherTimer 정리 패턴
  }, [term]);

  return (
    <input
      ref={inputRef}
      className="w-full rounded border px-3 py-2"
      value={term}
      onChange={(event) => setTerm(event.target.value)}
      placeholder="검색어"
    />
  );
}
```
- `useEffect`는 ASP.NET Core 미들웨어 파이프라인에서 `Dispose` 구현 또는 WPF `Loaded/Unloaded`에 대응합니다.

## 중급: 프로덕션 패턴과 백엔드 연동 감각
### 렌더 성능 최적화
- ASP.NET Core에서 OutputCache를 사용하는 것처럼, React에서는 `memo`, `useMemo`, `useCallback`으로 렌더 비용을 제어합니다.
```tsx
import { memo } from "react";

export const TodoList = memo(function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
});
```

### Suspense와 Error Boundary
- ASP.NET Core에서 미들웨어로 예외를 잡고, WPF에서 Splash 화면을 보여주는 것과 동일한 사용자 경험을 제공합니다.
```tsx
import { Suspense, lazy } from "react";
const TodoDetail = lazy(() => import("@/pages/TodoDetailPage"));

export function TodosPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <TodoDetail />
    </Suspense>
  );
}
```

### 상태 레이어 분리
- ASP.NET Core에서 Domain Service, Repository를 나누듯 `src/hooks/`, `src/store/`, `src/components/`로 관심사를 분리하세요.
- 로컬 state ↔ 전역 state(Zustand) ↔ 서버 state(React Query)를 구분하면 WPF MVVM의 ViewModel/Model 구성이 떠오릅니다.

## 고급: 규모 확장과 협업 대비
- **코드 스플리팅 전략**: Razor Pages를 영역별로 나누듯, React는 라우트 단위 Lazy Loading으로 초기 번들을 줄입니다.
- **접근성(A11y)**: WPF의 AutomationProperties, ASP.NET Core의 `aria-*` 속성을 다뤘던 경험을 살려 React에서도 semantic HTML과 ARIA를 명시하세요.
- **테스트 전략**: xUnit/자동 UI 테스트 경험을 살려 React Testing Library로 사용자 중심 테스트를 작성합니다.
- **상태 머신/고급 패턴**: 복잡한 폼 흐름은 XState 같은 상태 머신으로 표현하면 WPF `VisualStateManager`와 닮은 구조를 얻습니다.

## 실무 체크리스트
- [ ] 컴포넌트 파일명 `PascalCase`, 기본 export 대신 이름 있는 export 사용.
- [ ] 비즈니스 로직은 커스텀 훅(`src/hooks/useXxx.ts`)으로 분리해 Razor의 Service 계층처럼 재사용.
- [ ] `useEffect` 내 비동기 로직은 내부에서 `async` 함수를 선언해 호출 (`await` 직접 사용 금지).
- [ ] 에러/로딩 UI는 공통 컴포넌트(`ErrorAlert`, `Spinner`)로 통합.
- [ ] Storybook 혹은 Styleguidist로 컴포넌트 카탈로그 구축을 검토.

## 프로젝트 숙제
1. `Greeting`을 확장해 WPF `ObservableCollection`처럼 사람 목록을 렌더하고 검색/필터 기능 추가.
2. `SearchBox` 값을 `TodosPage` 상위 컴포넌트로 올려 React Query 쿼리 키에 반영.
3. Suspense + ErrorBoundary를 Todos 상세 페이지에 적용하고, API 장애 시 사용자 메시지를 노출.

## 참고 자료
- [React Docs: Quick Start](https://react.dev/learn) — Razor Page 개발자가 JSX와 state 개념을 익히기에 적합.
- [Kent C. Dodds: React for Beginners with other frameworks](https://kentcdodds.com) — 다른 프레임워크 출신 개발자 대상 비교 자료.
- [Razor vs React 비교 블로그](https://learn.microsoft.com/aspnet/core/client-side/spa/react) — Microsoft 공식 가이드.
