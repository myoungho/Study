import { useState } from "react";
import "./App.css";

interface TodoItem {
  id: number;
  text: string;
  isCompleted: boolean;
}

function App() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputText, setInputText] = useState<string>("");

  const addTodo = () => {
    if (inputText.trim() === "") return;
    const newTodo: TodoItem = {
      id: Date.now(),
      text: inputText,
      isCompleted: false,
    };
    setTodos([...todos, newTodo]);
    setInputText("");
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="App">
      <h1>나의 Todo 앱</h1>
      <div style={{ margin: "20px" }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="할 일을 입력하세요."
          style={{
            padding: "10px",
            width: "300px",
            fontSize: "16px",
            marginRight: "10px",
          }}
        />
        <button
          onClick={addTodo}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          추가
        </button>
      </div>

      <div
        style={{
          margin: "20px",
          padding: "10px",
          backgroundColor: "#f5f5f5",
          borderRadius: "5px",
        }}
      >
        <p>전체: {todos.length}개</p>
        <p>완료: {todos.filter((todo) => todo.isCompleted).length}개</p>
        <p>미완료: {todos.filter((todo) => !todo.isCompleted).length}개</p>
      </div>

      <div style={{ margin: "20px" }}>
        {todos.length === 0 ? (
          <p>할 일이 없습니다.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {todos.map((todo) => (
              <li
                key={todo.id}
                style={{
                  padding: "10px",
                  margin: "5px 0",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={todo.isCompleted}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  <span
                    style={{
                      textDecoration: todo.isCompleted
                        ? "line-through"
                        : "none",
                      color: todo.isCompleted ? "#888" : "#000",
                    }}
                  >
                    {todo.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#ff4444",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
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
  );
}

export default App;
