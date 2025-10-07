# Axios 실무 온보딩 가이드

## 초급: ASP.NET Core `HttpClient`와 비교
- **Axios 인스턴스 = Typed HttpClient**: baseURL, 공통 헤더, 타임아웃을 묶어 재사용.
- **인터셉터 = DelegatingHandler**: 요청/응답 전에 토큰 주입, 에러 처리.
- **제네릭 응답 타입 = C# `HttpClient.GetFromJsonAsync<T>`**: 응답 구조를 타입으로 지정.

### 실습 1: 인스턴스 생성
```ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10_000,
});
```
- ASP.NET Core `services.AddHttpClient("Api", client => { client.BaseAddress = ... })`와 동일한 개념.

### 실습 2: CRUD 요청
```ts
const { data } = await api.get<Todo[]>("/todos");
const created = await api.post<Todo>("/todos", { title });
await api.patch(`/todos/${id}`, { completed: true });
await api.delete(`/todos/${id}`);
```
- `HttpClient`에서 `GetFromJsonAsync<T>`/`PostAsJsonAsync`를 사용하던 패턴을 그대로 적용합니다.

## 중급: 인터셉터와 에러 전략
### 인증 토큰 주입
```ts
import { useAuthStore } from "@/store/useAuthStore";

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```
- ASP.NET Core DelegatingHandler에서 `Authorization` 헤더를 추가하던 패턴과 동일.

### 응답 에러 처리
```ts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```
- ASP.NET Core에서 `HttpClient` 핸들러에서 401 처리 후 인증 재시도 혹은 로그아웃을 수행하던 패턴.

### 요청 취소
```ts
const controller = new AbortController();
api.get("/todos", { signal: controller.signal });
// 컴포넌트 언마운트 시
controller.abort();
```
- `HttpClient`의 `CancellationToken`과 동일한 방식으로 요청을 취소합니다.

## 고급: 재시도, 로깅, 멀티파트
- **재시도 로직**: Polly와 유사한 재시도 구현을 유틸 함수로 작성.
```ts
async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise((resolve) => setTimeout(resolve, 500));
    return withRetry(fn, retries - 1);
  }
}
```
- **로깅**: 인터셉터에서 요청/응답 시간을 측정해 Application Insights처럼 로그를 전송.
- **멀티파트 업로드**: FormData를 사용해 WPF `HttpClient`에서 파일 업로드하던 방식과 동일합니다.
```ts
const form = new FormData();
form.append("file", file);
await api.post("/attachments", form, {
  headers: { "Content-Type": "multipart/form-data" },
});
```

## 실무 체크리스트
- [ ] API 호출은 공용 인스턴스를 사용해 헤더/에러 로직을 공유.
- [ ] 응답은 Zod 혹은 타입 가드로 검증 후 Zustand/React Query에 전달.
- [ ] 에러 메시지는 사용자 친화적으로 가공해 토스트/다이얼로그로 표시.
- [ ] 토큰 갱신 로직을 별도 인터셉터로 구성하고, 무한 루프 방지를 위해 플래그 사용.

## 프로젝트 숙제
1. 토큰 만료 시 Refresh API를 호출해 토큰을 갱신하고 원래 요청을 재시도하는 인터셉터 작성.
2. `withRetry` 헬퍼를 만들어 Todo 생성 실패 시 3회 재시도 후 사용자에게 안내.
3. ASP.NET Core Minimal API와 요청/응답 스키마를 문서화해 Axios 호출과 비교.

## 참고 자료
- [Axios Docs](https://axios-http.com/docs/intro)
- [HttpClient Factory 패턴](https://learn.microsoft.com/aspnet/core/fundamentals/http-requests)
- [Axios Interceptor Patterns](https://axios-http.com/docs/interceptors)
