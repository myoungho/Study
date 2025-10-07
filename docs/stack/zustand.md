# Zustand 실무 온보딩 가이드

## 초급: WPF ViewModel 경험과 연결
- **Zustand 스토어 = WPF ViewModel + DI 컨테이너**: 전역 상태를 정의하고 필요한 컴포넌트에서 훅으로 주입.
- **Selector = WPF Binding Path**: 특정 필드만 구독해 렌더 최소화.
- **persist 미들웨어 = ASP.NET Core IDistributedCache or WPF Settings**: 로컬 스토리지에 상태를 저장.

### 실습 1: 기본 스토어 만들기
```ts
import { create } from "zustand";

type UIState = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
```
- `set` 내부에서 이전 상태를 기반으로 새 객체를 반환하는 패턴은 WPF에서 `INotifyPropertyChanged` 이벤트 후 새 값을 설정하는 것과 동일한 역할.

### 실습 2: 컴포넌트 활용
```tsx
const isOpen = useUIStore((state) => state.isSidebarOpen);
const toggle = useUIStore((state) => state.toggleSidebar);
```
- ASP.NET Core에서 DI된 서비스 메서드를 호출하듯, 훅으로 액션을 호출합니다.

## 중급: 비동기 로직과 미들웨어
### 비동기 액션
```ts
import api from "@/api/axios";
import type { Todo } from "@/types/todo";

interface TodoStore {
  todos: Todo[];
  loading: boolean;
  fetchTodos: () => Promise<void>;
}

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  loading: false,
  fetchTodos: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get<Todo[]>("/todos");
      set({ todos: data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
}));
```
- ASP.NET Core 서비스에서 `HttpClient` 호출 후 DTO 반환하는 패턴과 동일하게 try/catch로 에러를 노출.

### persist & devtools
```ts
import { persist, devtools } from "zustand/middleware";

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        login: async (email, password) => { /* ... */ },
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({ user: state.user, token: state.token }),
      }
    )
  )
);
```
- `partialize`는 Redis 캐싱에서 필요한 필드만 저장하는 것과 유사.

## 고급: 구조화와 테스트
- **상태 분할**: ASP.NET Core 모듈화처럼 도메인별로 스토어를 나누고, 공통 로직은 `createStoreHelpers.ts`로 추출.
- **미들웨어 체이닝**: 로그, 캐시, Immer 등을 조합해 복잡도를 관리.
- **테스트**: xUnit 테스트처럼 `useStore.getState()`로 초기 상태를 검증하고, 액션 호출 후 변화를 `expect`로 단언.
- **React Query와 역할 분리**: 서버 상태는 Query, UI 상태는 Zustand — Razor Page의 TempData vs 서비스 캐시 구분과 동일합니다.

## 실무 체크리스트
- [ ] 인터페이스 정의 후 `create<Interface>(...)`로 타입 안전성 확보.
- [ ] 액션에서 비동기 호출 시 로딩/에러 상태를 명확히 설정.
- [ ] 스토어를 사용하는 컴포넌트는 필요한 조각만 구독 (Selector + `shallow`).
- [ ] persist 저장소 초기화 방법(`useAuthStore.persist.clearStorage()`)을 문서화.

## 프로젝트 숙제
1. `useUIStore`로 모달, 토스트, 테마 상태를 관리하고 각 컴포넌트에 연결.
2. Todo 완료 토글을 옵티미스틱 업데이트로 구현, 실패 시 상태 롤백.
3. ASP.NET Core 백엔드의 JWT 갱신 로직과 연동되는 `refreshToken` 액션 작성.

## 참고 자료
- [Zustand 공식 문서](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Zustand + Immer 패턴](https://docs.pmnd.rs/zustand/integrations/immer)
- [Redux DevTools와 함께 쓰기](https://github.com/pmndrs/zustand#redux-devtools)
