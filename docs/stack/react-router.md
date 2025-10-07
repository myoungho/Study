# React Router 실무 온보딩 가이드

## 초급: ASP.NET Core/WPF 네비게이션과 비교
- **Route = ASP.NET Core endpoint routing** (`MapControllerRoute`). URL 패턴과 컴포넌트를 매핑합니다.
- **Link = TagHelper `asp-action`, WPF의 `Hyperlink`**: 전체 페이지 새로고침 없이 SPA 방식 이동.
- **`Navigate` = ASP.NET Core Redirect, WPF NavigationService**: 코드에서 경로 이동.

### 실습 1: 라우트 추가
```tsx
<Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
```
- Razor Pages에서 `MapPageRoute`로 새 페이지를 추가하듯, `src/App.tsx`에 라우트를 등록합니다.

### 실습 2: 동적 파라미터
```tsx
import { useParams } from "react-router-dom";

export function TodoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const todo = useTodoStore((state) => state.todos.find((t) => t.id === Number(id)));

  if (!todo) return <Navigate to="/todos" replace />;
  return <TodoDetail todo={todo} />;
}
```
- ASP.NET Core에서 `RouteData.Values["id"]`, WPF에서 URI 파라미터를 읽던 방식과 연결해 이해할 수 있습니다.

## 중급: 보호된 라우트와 데이터 로딩
### 보호된 라우트 패턴
```tsx
import { Navigate, useLocation } from "react-router-dom";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore((state) => state);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}
```
- ASP.NET Core `AuthorizeAttribute`와 동일한 개념. `state.from`은 `ReturnUrl`과 비슷한 역할.

### 데이터 API (React Router v7)
```tsx
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/todos/:id",
    loader: async ({ params }) => {
      const { data } = await api.get(`/todos/${params.id}`);
      return data;
    },
    element: <TodoDetailPage />,
    errorElement: <NotFoundPage />,
  },
]);
```
- ASP.NET Core의 Razor Page `OnGetAsync`에서 데이터를 선 로드하는 것과 동일하게, 라우트에 로더를 정의하면 컴포넌트가 렌더되기 전에 데이터를 준비합니다.

### 네비게이션 상태
```tsx
import { useNavigation } from "react-router-dom";

const navigation = useNavigation();
if (navigation.state === "loading") {
  return <Spinner />;
}
```
- WPF NavigationService의 `NavigationProgress`와 유사한 레벨의 제어.

## 고급: 대규모 앱 설계
- **코드 스플리팅**: ASP.NET MVC Area처럼 라우트 그룹을 나누고 `lazy` 로딩.
- **에러 경계**: Razor Pages에서 `UseExceptionHandler`를 쓰듯, `errorElement`로 라우트별 에러 UI 구성.
- **중첩 라우트**: WPF의 Frame/Page 계층 구조와 동일. 부모 레이아웃에서 `<Outlet />`로 자식 페이지를 렌더.
- **URL 상태 동기화**: 검색/필터 조건을 `useSearchParams`로 관리 → ASP.NET Core의 QueryString 처리와 동일.

## 실무 체크리스트
- [ ] 새 페이지 생성 시 `src/pages`에 컴포넌트를 만들고 라우트에 등록.
- [ ] 인증/권한이 필요한 경로는 `ProtectedRoute`로 감싸 ReturnUrl 전달.
- [ ] 동적 파라미터는 타입 변환/존재 여부 확인 후 처리.
- [ ] 네비게이션 중 로딩/에러 UI를 명확히 노출.

## 프로젝트 숙제
1. `/todos/:id/edit` 라우트를 추가해 폼 제출 후 상세 페이지로 리디렉션.
2. `/settings` 페이지에 역할 기반 보호(`role === "admin"`)를 도입.
3. React Query 로더 연동: `loader`에서 `queryClient.fetchQuery` 사용해 데이터 프리패치.

## 참고 자료
- [React Router Docs](https://reactrouter.com/en/main/start/tutorial)
- [ASP.NET Core Routing vs SPA Routing 비교](https://learn.microsoft.com/aspnet/core/fundamentals/routing)
- [WPF Navigation Overview](https://learn.microsoft.com/dotnet/desktop/wpf/app-development/navigation-overview)
