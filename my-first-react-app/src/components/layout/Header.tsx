import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
            {isAuthenticated && (
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
            )}
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

          {/* 로그인/로그아웃 */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">{user?.name}님</span>
                <Button onClick={handleLogout} variant="outline">
                  로그아웃
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button>로그인</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
