# 2단계: Todo 앱 만들기

## 목표
React + TypeScript의 핵심 개념을 Todo 앱을 만들면서 학습

---

## 배울 내용
- 컴포넌트 분리 (Component)
- Props로 데이터 전달
- 배열 렌더링 (map 함수)
- 이벤트 핸들링
- CRUD 기능 (추가, 읽기, 삭제)
- TypeScript interface 활용

---

## 최종 결과물

간단한 Todo 앱:
- 할 일 추가
- 할 일 목록 표시
- 완료 체크
- 할 일 삭제

---

## 1단계: 데이터 구조 설계 (TypeScript Interface)

### C#과 비교

**C# 클래스:**
```csharp
public class TodoItem
{
    public int Id { get; set; }
    public string Text { get; set; }
    public bool IsCompleted { get; set; }
}
```

**TypeScript Interface:**
```typescript
interface TodoItem {
  id: number
  text: string
  isCompleted: boolean
}
```

### 실습

`src/App.tsx` 파일의 맨 위에 interface를 추가하세요:

```typescript
import { useState } from 'react'
import './App.css'

// TodoItem 타입 정의
interface TodoItem {
  id: number
  text: string
  isCompleted: boolean
}

function App() {
  // 여기에 코드 작성
}
```

---

## 2단계: 상태 관리 (State)

### C#과 비교

**C# 리스트:**
```csharp
private List<TodoItem> _todos = new List<TodoItem>();
```

**TypeScript useState:**
```typescript
const [todos, setTodos] = useState<TodoItem[]>([])
```

### 실습

App 함수 안에 상태 변수를 추가하세요:

```typescript
function App() {
  // Todo 목록 상태
  const [todos, setTodos] = useState<TodoItem[]>([])

  // 입력창 상태
  const [inputText, setInputText] = useState<string>('')

  return (
    <div className="App">
      <h1>나의 Todo 앱</h1>
    </div>
  )
}
```

---

## 3단계: Todo 추가 기능

### C#과 비교

**C# 메서드:**
```csharp
private void AddTodo()
{
    if (string.IsNullOrWhiteSpace(inputText)) return;

    var newTodo = new TodoItem
    {
        Id = todos.Count + 1,
        Text = inputText,
        IsCompleted = false
    };

    todos.Add(newTodo);
    inputText = "";
}
```

**TypeScript 함수:**
```typescript
const addTodo = () => {
  if (inputText.trim() === '') return

  const newTodo: TodoItem = {
    id: Date.now(), // 간단한 ID 생성
    text: inputText,
    isCompleted: false
  }

  setTodos([...todos, newTodo]) // spread 연산자로 새 배열 생성
  setInputText('') // 입력창 초기화
}
```

### 중요 개념: Spread 연산자 (...)

**C#과 비교:**
```csharp
// C#
var newList = new List<TodoItem>(todos);
newList.Add(newTodo);
```

```typescript
// TypeScript - 더 간결함!
setTodos([...todos, newTodo])
// ...todos는 기존 배열의 모든 요소를 펼침
```

### 실습

App 함수에 `addTodo` 함수를 추가하세요:

```typescript
function App() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [inputText, setInputText] = useState<string>('')

  // Todo 추가 함수
  const addTodo = () => {
    if (inputText.trim() === '') return

    const newTodo: TodoItem = {
      id: Date.now(),
      text: inputText,
      isCompleted: false
    }

    setTodos([...todos, newTodo])
    setInputText('')
  }

  return (
    <div className="App">
      <h1>나의 Todo 앱</h1>

      <div style={{ margin: '20px' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="할 일을 입력하세요"
          style={{
            padding: '10px',
            fontSize: '16px',
            width: '300px',
            marginRight: '10px'
          }}
        />
        <button
          onClick={addTodo}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          추가
        </button>
      </div>
    </div>
  )
}
```

**새로운 개념:**
- `onKeyPress`: 엔터키로도 추가 가능
- `e.key === 'Enter' && addTodo()`: 조건부 실행

---

## 4단계: Todo 목록 렌더링 (배열 map)

### C#과 비교

**C# LINQ:**
```csharp
// Razor 뷰
@foreach (var todo in todos)
{
    <div>
        <span>@todo.Text</span>
    </div>
}
```

**TypeScript map:**
```typescript
{todos.map(todo => (
  <div key={todo.id}>
    <span>{todo.text}</span>
  </div>
))}
```

### 중요: key 속성

React에서 배열을 렌더링할 때는 **반드시 key를 지정**해야 합니다.
- 성능 최적화를 위해 필요
- 각 항목을 고유하게 식별

### 실습

return 문에 Todo 목록을 추가하세요:

```typescript
return (
  <div className="App">
    <h1>나의 Todo 앱</h1>

    {/* 입력 영역 */}
    <div style={{ margin: '20px' }}>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        placeholder="할 일을 입력하세요"
        style={{
          padding: '10px',
          fontSize: '16px',
          width: '300px',
          marginRight: '10px'
        }}
      />
      <button onClick={addTodo} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
        추가
      </button>
    </div>

    {/* Todo 목록 */}
    <div style={{ margin: '20px' }}>
      {todos.length === 0 ? (
        <p style={{ color: '#888' }}>할 일이 없습니다.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todos.map(todo => (
            <li
              key={todo.id}
              style={{
                padding: '10px',
                margin: '5px 0',
                border: '1px solid #ddd',
                borderRadius: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>{todo.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
)
```

**테스트:**
1. 할 일을 입력하고 추가 버튼 클릭
2. 여러 개 추가해보기
3. 엔터키로도 추가해보기

---

## 5단계: 완료 체크 기능

### C#과 비교

**C# 메서드:**
```csharp
private void ToggleTodo(int id)
{
    var todo = todos.FirstOrDefault(t => t.Id == id);
    if (todo != null)
    {
        todo.IsCompleted = !todo.IsCompleted;
    }
}
```

**TypeScript 함수:**
```typescript
const toggleTodo = (id: number) => {
  setTodos(
    todos.map(todo =>
      todo.id === id
        ? { ...todo, isCompleted: !todo.isCompleted }
        : todo
    )
  )
}
```

### 중요 개념: 불변성 (Immutability)

React에서는 **상태를 직접 수정하면 안 됩니다**.
- ❌ `todo.isCompleted = !todo.isCompleted` (직접 수정)
- ✅ `{ ...todo, isCompleted: !todo.isCompleted }` (새 객체 생성)

**왜?**
- React는 객체 참조가 변경되어야 리렌더링
- C#의 ImmutableList와 유사한 개념

### 실습

`toggleTodo` 함수를 추가하세요:

```typescript
function App() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [inputText, setInputText] = useState<string>('')

  const addTodo = () => {
    // ... 기존 코드
  }

  // 완료 상태 토글
  const toggleTodo = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id
          ? { ...todo, isCompleted: !todo.isCompleted }
          : todo
      )
    )
  }

  // ... return
}
```

그리고 Todo 항목에 체크박스를 추가하세요:

```typescript
<li
  key={todo.id}
  style={{
    padding: '10px',
    margin: '5px 0',
    border: '1px solid #ddd',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }}
>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <input
      type="checkbox"
      checked={todo.isCompleted}
      onChange={() => toggleTodo(todo.id)}
      style={{ marginRight: '10px', cursor: 'pointer' }}
    />
    <span
      style={{
        textDecoration: todo.isCompleted ? 'line-through' : 'none',
        color: todo.isCompleted ? '#888' : '#000'
      }}
    >
      {todo.text}
    </span>
  </div>
</li>
```

**테스트:**
1. Todo 항목의 체크박스를 클릭
2. 완료된 항목은 취소선이 그어짐
3. 다시 클릭하면 취소선 사라짐

---

## 6단계: Todo 삭제 기능

### C#과 비교

**C# 메서드:**
```csharp
private void DeleteTodo(int id)
{
    todos.RemoveAll(t => t.Id == id);
}
```

**TypeScript 함수:**
```typescript
const deleteTodo = (id: number) => {
  setTodos(todos.filter(todo => todo.id !== id))
}
```

### filter 메서드

**C# LINQ Where와 동일:**
```csharp
// C#
var filtered = todos.Where(t => t.Id != id).ToList();
```

```typescript
// TypeScript
const filtered = todos.filter(todo => todo.id !== id)
```

### 실습

`deleteTodo` 함수를 추가하세요:

```typescript
function App() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [inputText, setInputText] = useState<string>('')

  const addTodo = () => {
    // ... 기존 코드
  }

  const toggleTodo = (id: number) => {
    // ... 기존 코드
  }

  // Todo 삭제
  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  // ... return
}
```

그리고 삭제 버튼을 추가하세요:

```typescript
<li
  key={todo.id}
  style={{
    padding: '10px',
    margin: '5px 0',
    border: '1px solid #ddd',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }}
>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <input
      type="checkbox"
      checked={todo.isCompleted}
      onChange={() => toggleTodo(todo.id)}
      style={{ marginRight: '10px', cursor: 'pointer' }}
    />
    <span
      style={{
        textDecoration: todo.isCompleted ? 'line-through' : 'none',
        color: todo.isCompleted ? '#888' : '#000'
      }}
    >
      {todo.text}
    </span>
  </div>

  {/* 삭제 버튼 추가 */}
  <button
    onClick={() => deleteTodo(todo.id)}
    style={{
      padding: '5px 10px',
      backgroundColor: '#ff4444',
      color: 'white',
      border: 'none',
      borderRadius: '3px',
      cursor: 'pointer'
    }}
  >
    삭제
  </button>
</li>
```

**테스트:**
1. Todo 항목 추가
2. 삭제 버튼 클릭
3. 해당 항목이 목록에서 사라짐

---

## 7단계: 통계 표시

### 실습

Todo 목록 위에 통계를 추가하세요:

```typescript
{/* 통계 */}
<div style={{ margin: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
  <p>전체: {todos.length}개</p>
  <p>완료: {todos.filter(todo => todo.isCompleted).length}개</p>
  <p>미완료: {todos.filter(todo => !todo.isCompleted).length}개</p>
</div>
```

**C#과 비교:**
```csharp
// C# LINQ
int total = todos.Count;
int completed = todos.Count(t => t.IsCompleted);
int notCompleted = todos.Count(t => !t.IsCompleted);
```

```typescript
// TypeScript
const total = todos.length
const completed = todos.filter(todo => todo.isCompleted).length
const notCompleted = todos.filter(todo => !todo.isCompleted).length
```

---

## 완성된 전체 코드

`src/App.tsx`:

```typescript
import { useState } from 'react'
import './App.css'

interface TodoItem {
  id: number
  text: string
  isCompleted: boolean
}

function App() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [inputText, setInputText] = useState<string>('')

  const addTodo = () => {
    if (inputText.trim() === '') return

    const newTodo: TodoItem = {
      id: Date.now(),
      text: inputText,
      isCompleted: false
    }

    setTodos([...todos, newTodo])
    setInputText('')
  }

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id
          ? { ...todo, isCompleted: !todo.isCompleted }
          : todo
      )
    )
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <div className="App">
      <h1>나의 Todo 앱</h1>

      {/* 입력 영역 */}
      <div style={{ margin: '20px' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="할 일을 입력하세요"
          style={{
            padding: '10px',
            fontSize: '16px',
            width: '300px',
            marginRight: '10px'
          }}
        />
        <button
          onClick={addTodo}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          추가
        </button>
      </div>

      {/* 통계 */}
      <div style={{ margin: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <p>전체: {todos.length}개</p>
        <p>완료: {todos.filter(todo => todo.isCompleted).length}개</p>
        <p>미완료: {todos.filter(todo => !todo.isCompleted).length}개</p>
      </div>

      {/* Todo 목록 */}
      <div style={{ margin: '20px' }}>
        {todos.length === 0 ? (
          <p style={{ color: '#888' }}>할 일이 없습니다.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {todos.map(todo => (
              <li
                key={todo.id}
                style={{
                  padding: '10px',
                  margin: '5px 0',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={todo.isCompleted}
                    onChange={() => toggleTodo(todo.id)}
                    style={{ marginRight: '10px', cursor: 'pointer' }}
                  />
                  <span
                    style={{
                      textDecoration: todo.isCompleted ? 'line-through' : 'none',
                      color: todo.isCompleted ? '#888' : '#000'
                    }}
                  >
                    {todo.text}
                  </span>
                </div>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
```

---

## 핵심 개념 정리

### 1. TypeScript Interface
```typescript
interface TodoItem {
  id: number
  text: string
  isCompleted: boolean
}
```
- C#의 클래스/인터페이스와 동일
- 타입 안정성 제공

### 2. useState Hook
```typescript
const [todos, setTodos] = useState<TodoItem[]>([])
```
- 상태 관리
- 값 변경 시 자동 리렌더링

### 3. 배열 메서드

**map** - 변환 (C# Select)
```typescript
todos.map(todo => ({ ...todo, isCompleted: !todo.isCompleted }))
```

**filter** - 필터링 (C# Where)
```typescript
todos.filter(todo => !todo.isCompleted)
```

**Spread 연산자** - 복사
```typescript
[...todos, newTodo]
{ ...todo, isCompleted: true }
```

### 4. 조건부 렌더링
```typescript
{todos.length === 0 ? <p>비어있음</p> : <ul>...</ul>}
{todo.isCompleted && <span>완료!</span>}
```

### 5. 이벤트 핸들링
```typescript
onClick={() => deleteTodo(todo.id)}
onChange={(e) => setInputText(e.target.value)}
onKeyPress={(e) => e.key === 'Enter' && addTodo()}
```

---

## 실습 체크리스트

- [ ] interface TodoItem 정의 완료
- [ ] useState로 상태 관리 완료
- [ ] Todo 추가 기능 구현
- [ ] Todo 목록 렌더링 (map)
- [ ] 완료 체크 기능 구현
- [ ] Todo 삭제 기능 구현
- [ ] 통계 표시 기능 추가
- [ ] 전체 기능 테스트 완료

---

## 다음 단계

2단계를 완료했다면 **3단계: shadcn/ui 학습**으로 진행합니다.

3단계에서는:
- Tailwind CSS 설정
- shadcn/ui 설치
- 이 Todo 앱을 shadcn/ui 컴포넌트로 리팩토링
- 프로페셔널한 UI로 업그레이드

---

## 추가 실습 과제 (선택)

더 연습하고 싶다면:

1. **수정 기능 추가**
   - Todo 텍스트를 더블클릭하면 수정 모드
   - 수정 후 저장

2. **필터 기능**
   - 전체 / 완료 / 미완료 필터
   - 버튼으로 전환

3. **LocalStorage 저장**
   - 새로고침해도 데이터 유지
   - useEffect Hook 사용

4. **우선순위 기능**
   - 높음 / 중간 / 낮음
   - 색상으로 구분

---

**작성일**: 2025-10-07
**소요 시간**: 2-3시간
**난이도**: ⭐⭐☆☆☆
