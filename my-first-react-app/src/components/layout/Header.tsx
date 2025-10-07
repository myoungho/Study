import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Todo App
          </Link>

          {/* 네비게이션 */}
          <nav className="flex gap-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-blue-600 transition-colors ${
                  isActive ? "text-blue-600 font-semibold" : "text-gray-600"
                }`
              }
            >
              홈
            </NavLink>
            <NavLink
              to="/todos"
              className={({ isActive }) =>
                `hover:text-blue-600 transition-colors ${
                  isActive ? "text-blue-600 font-semibold" : "text-gray-600"
                }`
              }
            >
              할 일
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `hover:text-blue-600 transition-colors ${
                  isActive ? "text-blue-600 font-semibold" : "text-gray-600"
                }`
              }
            >
              소개
            </NavLink>
          </nav>

          {/* 로그인 버튼 */}
          <Link to="/login">
            <Button>로그인</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
