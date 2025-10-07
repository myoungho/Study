import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { TodosPage } from "./pages/TodosPage";
import { TodoDetailPage } from "./pages/TodoDetailPage";
import { AboutPage } from "./pages/AboutPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout을 사용하는 라우트 */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="todos" element={<TodosPage />} />
          <Route path="todos/:id" element={<TodoDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="login" element={<LoginPage />} />

          {/* 404 페이지 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
