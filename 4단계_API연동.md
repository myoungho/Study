# 4단계: API 연동 (REST API + Axios)

## 목표
Todo 앱을 실제 백엔드 API와 연동하여 데이터를 서버에 저장하고 불러오기

**학습 내용:**
- REST API 이해
- Axios 라이브러리 사용
- async/await 패턴
- useEffect Hook
- 로딩 상태 관리
- 에러 핸들링

**환경:**
- Windows 11
- 테스트 API: JSONPlaceholder (https://jsonplaceholder.typicode.com)

---

## Step 1: REST API 이해

### REST API란?

**Representational State Transfer API**
- HTTP 프로토콜을 사용한 API
- CRUD 작업을 HTTP 메서드로 표현

### HTTP 메서드

| 메서드 | 의미 | CRUD | 예시 |
|--------|------|------|------|
| GET | 조회 | Read | 목록 가져오기 |
| POST | 생성 | Create | 새 항목 추가 |
| PUT | 전체 수정 | Update | 항목 전체 수정 |
| PATCH | 부분 수정 | Update | 항목 일부 수정 |
| DELETE | 삭제 | Delete | 항목 삭제 |

### C# 개발자를 위한 비교

**C# (HttpClient):**
```csharp
var client = new HttpClient();
var response = await client.GetAsync("https://api.example.com/todos");
var data = await response.Content.ReadAsStringAsync();
```

**TypeScript (fetch):**
```typescript
const response = await fetch("https://api.example.com/todos");
const data = await response.json();
```

---

## Step 2: Axios 설치

### 왜 Axios를 사용하나?

**fetch vs Axios**

| 기능 | fetch | Axios |
|------|-------|-------|
| 내장 여부 | 브라우저 내장 | npm 설치 필요 |
| JSON 변환 | 수동 (.json()) | 자동 |
| 에러 처리 | 복잡 | 간단 |
| 요청 취소 | 복잡 | 간단 |
| 인터셉터 | 없음 | 있음 |

### 2-1. Axios 설치

터미널에서:
```bash
npm install axios
```

### 2-2. 설치 확인

`package.json`에 추가됨:
```json
{
  "dependencies": {
    "axios": "^1.x.x"
  }
}
```

---

## Step 3: JSONPlaceholder API 테스트

### JSONPlaceholder란?

**무료 테스트 API 서비스**
- URL: https://jsonplaceholder.typicode.com
- 실제 HTTP 요청 가능
- 데이터는 저장되지 않음 (가짜 응답)
- 연습용으로 완벽!

### API 엔드포인트

```
GET    /todos        모든 할 일 목록
GET    /todos/1      ID가 1인 할 일
POST   /todos        새 할 일 추가
PUT    /todos/1      ID가 1인 할 일 수정
DELETE /todos/1      ID가 1인 할 일 삭제
```

### 브라우저에서 테스트

1. 브라우저에서 접속:
   ```
   https://jsonplaceholder.typicode.com/todos
   ```

2. JSON 데이터 확인:
   ```json
   [
     {
       "userId": 1,
       "id": 1,
       "title": "delectus aut autem",
       "completed": false
     },
     ...
   ]
   ```

---

## Step 4: API 서비스 파일 생성

### 4-1. api 폴더 생성

프로젝트 구조:
```
src/
├── api/
│   └── todoApi.ts          ← 새로 생성
├── components/
├── App.tsx
└── ...
```

### 4-2. todoApi.ts 작성

**파일:** `src/api/todoApi.ts`

```typescript
import axios from "axios";

const BASE_URL = "https://jsonplaceholder.typicode.com";

export interface Todo {
  userId?: number;
  id: number;
  title: string;
  completed: boolean;
}

// 모든 할 일 가져오기
export const getTodos = async (): Promise<Todo[]> => {
  const response = await axios.get(`${BASE_URL}/todos`);
  return response.data;
};

// 할 일 추가
export const createTodo = async (
  title: string
): Promise<Todo> => {
  const response = await axios.post(`${BASE_URL}/todos`, {
    title,
    completed: false,
    userId: 1,
  });
  return response.data;
};

// 할 일 완료 상태 변경
export const updateTodo = async (
  id: number,
  completed: boolean
): Promise<Todo> => {
  const response = await axios.patch(`${BASE_URL}/todos/${id}`, {
    completed,
  });
  return response.data;
};

// 할 일 삭제
export const deleteTodo = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/todos/${id}`);
};
```

**설명:**
- `axios.get()`: GET 요청
- `axios.post()`: POST 요청 (body 포함)
- `axios.patch()`: PATCH 요청 (일부 수정)
- `axios.delete()`: DELETE 요청
- `Promise<T>`: 비동기 함수 반환 타입

### C# 비교

**TypeScript:**
```typescript
export const getTodos = async (): Promise<Todo[]> => {
  const response = await axios.get(`${BASE_URL}/todos`);
  return response.data;
};
```

**C#:**
```csharp
public async Task<List<Todo>> GetTodos()
{
    var response = await _client.GetAsync($"{BaseUrl}/todos");
    var json = await response.Content.ReadAsStringAsync();
    return JsonSerializer.Deserialize<List<Todo>>(json);
}
```

---

## Step 5: useEffect Hook 이해

### useEffect란?

**컴포넌트가 렌더링된 후 실행되는 부수 효과(Side Effect)**
- 데이터 가져오기
- 구독 설정
- DOM 직접 조작
- 타이머 설정

### 기본 문법

```typescript
useEffect(() => {
  // 실행할 코드
}, [의존성 배열]);
```

**의존성 배열:**
- `[]`: 컴포넌트 마운트 시 1번만 실행
- `[변수]`: 변수가 변경될 때마다 실행
- 없음: 매 렌더링마다 실행

### 예시

```typescript
// 컴포넌트 마운트 시 1번만
useEffect(() => {
  console.log("컴포넌트 마운트됨!");
}, []);

// count가 변경될 때마다
useEffect(() => {
  console.log(`count: ${count}`);
}, [count]);
```

### C# 비교

**TypeScript useEffect:**
```typescript
useEffect(() => {
  fetchData();
}, []);
```

**C# (WPF):**
```csharp
public MainWindow()
{
    InitializeComponent();
    Loaded += async (s, e) => await FetchData();
}
```

---

## Step 6: 로딩 상태 관리

### 왜 필요한가?

API 요청은 시간이 걸립니다:
1. 요청 전: 초기 상태
2. 요청 중: 로딩 표시
3. 요청 완료: 데이터 표시 또는 에러 표시

### 상태 변수 추가

```typescript
const [todos, setTodos] = useState<Todo[]>([]);
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<string | null>(null);
```

### 로딩 플로우

```typescript
const fetchTodos = async () => {
  setLoading(true);
  setError(null);

  try {
    const data = await getTodos();
    setTodos(data.slice(0, 10)); // 처음 10개만
  } catch (err) {
    setError("데이터를 불러오는데 실패했습니다.");
  } finally {
    setLoading(false);
  }
};
```

### C# 비교

**TypeScript:**
```typescript
setLoading(true);
try {
  const data = await getTodos();
} catch (err) {
  setError(err.message);
} finally {
  setLoading(false);
}
```

**C#:**
```csharp
IsLoading = true;
try
{
    var data = await GetTodos();
}
catch (Exception ex)
{
    Error = ex.Message;
}
finally
{
    IsLoading = false;
}
```

---

## Step 7: App.tsx 업데이트

### 7-1. Import 추가

```typescript
import { useState, useEffect } from "react";
import { getTodos, createTodo, updateTodo, deleteTodo } from "./api/todoApi";
```

### 7-2. Interface 수정

기존:
```typescript
interface TodoItem {
  id: number;
  text: string;
  isCompleted: boolean;
}
```

수정:
```typescript
interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
}
```

**이유:** API 응답 형식에 맞춤

### 7-3. 상태 변수 추가

```typescript
const [todos, setTodos] = useState<TodoItem[]>([]);
const [inputText, setInputText] = useState<string>("");
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<string | null>(null);
```

### 7-4. fetchTodos 함수

```typescript
const fetchTodos = async () => {
  setLoading(true);
  setError(null);

  try {
    const data = await getTodos();
    // 처음 10개만 가져오기
    setTodos(data.slice(0, 10));
  } catch (err) {
    setError("데이터를 불러오는데 실패했습니다.");
    console.error(err);
  } finally {
    setLoading(false);
  }
};
```

### 7-5. useEffect 추가

```typescript
useEffect(() => {
  fetchTodos();
}, []);
```

**의미:** 컴포넌트가 처음 마운트될 때 데이터 가져오기

### 7-6. addTodo 함수 수정

```typescript
const addTodo = async () => {
  if (inputText.trim() === "") return;

  setLoading(true);
  try {
    const newTodo = await createTodo(inputText);
    // API는 가짜 ID를 반환하므로, 로컬에서 임시 ID 생성
    setTodos([{ ...newTodo, id: Date.now() }, ...todos]);
    setInputText("");
  } catch (err) {
    setError("할 일 추가에 실패했습니다.");
  } finally {
    setLoading(false);
  }
};
```

### 7-7. toggleTodo 함수 수정

```typescript
const toggleTodo = async (id: number) => {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;

  try {
    await updateTodo(id, !todo.completed);
    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  } catch (err) {
    setError("상태 변경에 실패했습니다.");
  }
};
```

### 7-8. deleteTodo 함수 수정

```typescript
const handleDeleteTodo = async (id: number) => {
  try {
    await deleteTodo(id);
    setTodos(todos.filter((t) => t.id !== id));
  } catch (err) {
    setError("삭제에 실패했습니다.");
  }
};
```

---

## Step 8: 로딩 UI 추가

### 8-1. 로딩 스피너

**return 문 맨 위에 추가:**

```typescript
if (loading && todos.length === 0) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">데이터를 불러오는 중...</p>
      </div>
    </div>
  );
}
```

### 8-2. 에러 메시지

**통계 카드 위에 추가:**

```typescript
{error && (
  <Card className="mb-6 border-red-300 bg-red-50">
    <CardContent className="pt-6">
      <div className="flex items-center gap-2">
        <span className="text-red-600">⚠️</span>
        <p className="text-red-700">{error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setError(null)}
          className="ml-auto"
        >
          닫기
        </Button>
      </div>
    </CardContent>
  </Card>
)}
```

### 8-3. 버튼 로딩 상태

**추가 버튼 수정:**

```typescript
<Button onClick={addTodo} disabled={loading}>
  {loading ? "추가 중..." : "추가"}
</Button>
```

---

## Step 9: 전체 코드

### App.tsx 완성본

```typescript
import { useState, useEffect } from "react";
import "./App.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTodos, createTodo, updateTodo, deleteTodo } from "./api/todoApi";

interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 데이터 가져오기
  const fetchTodos = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getTodos();
      setTodos(data.slice(0, 10)); // 처음 10개만
    } catch (err) {
      setError("데이터를 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchTodos();
  }, []);

  // 할 일 추가
  const addTodo = async () => {
    if (inputText.trim() === "") return;

    setLoading(true);
    try {
      const newTodo = await createTodo(inputText);
      setTodos([{ ...newTodo, id: Date.now(), title: inputText }, ...todos]);
      setInputText("");
    } catch (err) {
      setError("할 일 추가에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 완료 상태 변경
  const toggleTodo = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      await updateTodo(id, !todo.completed);
      setTodos(
        todos.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (err) {
      setError("상태 변경에 실패했습니다.");
    }
  };

  // 할 일 삭제
  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      setError("삭제에 실패했습니다.");
    }
  };

  // 로딩 중
  if (loading && todos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 카드 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              나의 Todo 앱
            </CardTitle>
            <CardDescription className="text-center">
              JSONPlaceholder API 연동 버전
            </CardDescription>
          </CardHeader>
        </Card>

        {/* 에러 메시지 */}
        {error && (
          <Card className="mb-6 border-red-300 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <span className="text-red-600">⚠️</span>
                <p className="text-red-700">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setError(null)}
                  className="ml-auto"
                >
                  닫기
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 입력 카드 */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTodo()}
                placeholder="할 일을 입력하세요"
                className="flex-1"
                disabled={loading}
              />
              <Button onClick={addTodo} disabled={loading}>
                {loading ? "추가 중..." : "추가"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 통계 카드 */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {todos.length}
                </p>
                <p className="text-sm text-gray-600">전체</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {todos.filter((todo) => todo.completed).length}
                </p>
                <p className="text-sm text-gray-600">완료</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {todos.filter((todo) => !todo.completed).length}
                </p>
                <p className="text-sm text-gray-600">미완료</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Todo 목록 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>할 일 목록</CardTitle>
          </CardHeader>
          <CardContent>
            {todos.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                할 일이 없습니다.
              </p>
            ) : (
              <div className="space-y-2">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                      />
                      <span
                        className={`${
                          todo.completed
                            ? "line-through text-gray-400"
                            : "text-gray-900"
                        }`}
                      >
                        {todo.title}
                      </span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteTodo(todo.id)}
                    >
                      삭제
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
```

---

## Step 10: 테스트

### 10-1. 서버 시작

```bash
npm run dev
```

### 10-2. 브라우저 확인

1. **초기 로딩**
   - 스피너 표시
   - "데이터를 불러오는 중..." 메시지

2. **데이터 로드 완료**
   - JSONPlaceholder에서 10개 할 일 표시
   - 이미 완료된 항목도 있음

3. **추가 테스트**
   - 새 할 일 추가
   - 목록 맨 위에 추가됨

4. **완료 체크**
   - 체크박스 클릭
   - API 호출 (실제로는 가짜 응답)

5. **삭제 테스트**
   - 삭제 버튼 클릭
   - 목록에서 제거

---

## 문제 해결

### 문제 1: CORS 에러

**증상:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**해결:**
- JSONPlaceholder는 CORS를 허용하므로 발생하지 않음
- 실제 백엔드 개발 시 서버에서 CORS 설정 필요

### 문제 2: 네트워크 에러

**증상:**
```
Network Error
```

**해결:**
1. 인터넷 연결 확인
2. API URL 확인
3. 브라우저 콘솔에서 상세 에러 확인

### 문제 3: 데이터가 저장되지 않음

**이유:**
- JSONPlaceholder는 테스트용 API
- 실제로 데이터를 저장하지 않음
- 가짜 응답만 반환

**해결:**
- 실제 백엔드 API를 만들거나
- Firebase, Supabase 같은 서비스 사용

---

## 핵심 개념 정리

### 1. async/await

**동기 코드처럼 보이지만 비동기:**
```typescript
const data = await getTodos(); // 대기
console.log(data); // 완료 후 실행
```

### 2. useEffect

**컴포넌트 생명주기:**
```typescript
useEffect(() => {
  // 마운트 시 1번만 실행
  fetchData();
}, []);
```

### 3. try-catch-finally

**에러 처리:**
```typescript
try {
  await apiCall();
} catch (err) {
  handleError(err);
} finally {
  cleanup();
}
```

### 4. 상태 관리

**로딩, 데이터, 에러:**
```typescript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

---

## 체크리스트

- [ ] Axios 설치
- [ ] todoApi.ts 생성
- [ ] Interface 수정 (text → title)
- [ ] useEffect로 초기 데이터 로드
- [ ] 로딩 상태 관리
- [ ] 에러 처리
- [ ] UI에 로딩 스피너 추가
- [ ] 에러 메시지 표시
- [ ] 모든 API 함수 테스트

---

## 다음 단계

4단계를 완료했다면 **5단계: 상태 관리 (Zustand)**로 진행합니다.

5단계에서 배울 내용:
- 전역 상태 관리
- Zustand 라이브러리
- Store 생성
- Actions 정의
- 컴포넌트 분리

---

**작성일:** 2025-10-07
**난이도:** ⭐⭐⭐☆☆
**소요 시간:** 2-3시간
