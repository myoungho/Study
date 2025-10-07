/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import "./App.css";
import { useTodoStore } from "./store/useTodoStore";
import { TodoHeader } from "./components/TodoHeader";
import { TodoInput } from "./components/TodoInput";
import { TodoStats } from "./components/TodoStats";
import { TodoList } from "./components/TodoList";
import { ErrorAlert } from "./components/ErrorAlert";

function App() {
  const { loading, todos, fetchTodos } = useTodoStore();

  useEffect(() => {
    fetchTodos();
  }, []);

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
        <TodoHeader />
        <ErrorAlert />
        <TodoInput />
        <TodoStats />
        <TodoList />
      </div>
    </div>
  );
}

export default App;
