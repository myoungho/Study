import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { TodosPage } from "./pages/TodosPage";
import { TodoDetailPage } from "./pages/TodoDetailPage";
import { AboutPage } from "./pages/AboutPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { TodoEditPage } from "./pages/TodoEditPage";
import { SignupPage } from "./pages/SignupPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route
            path="todos"
            element={
              <ProtectedRoute>
                <TodosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="todos/:id"
            element={
              <ProtectedRoute>
                <TodoDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="todos/:id/edit"
            element={
              <ProtectedRoute>
                <TodoEditPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
