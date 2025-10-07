import { useAuthStore } from "@/store/useAuthStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function ProfilePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>프로필</CardTitle>
          <CardDescription>계정 정보</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">이름</label>
            <p className="text-lg">{user?.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">이메일</label>
            <p className="text-lg">{user?.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">사용자 ID</label>
            <p className="text-sm text-gray-600">{user?.id}</p>
          </div>

          <Button variant="destructive" onClick={handleLogout}>
            로그아웃
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
