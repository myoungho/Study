import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTodoStore } from "@/store/useTodoStore";

export function HomePage() {
  const todos = useTodoStore((state) => state.todos);
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;

  return (
    <div className="space-y-8">
      {/* 환영 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-bold">
            할 일 관리 앱에 오신 것을 환영합니다!
          </CardTitle>
          <CardDescription className="text-lg">
            효율적으로 할 일을 관리하고 생산성을 높이세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/todos">
            <Button size="lg">시작하기 →</Button>
          </Link>
        </CardContent>
      </Card>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-blue-600">
              {total}
            </CardTitle>
            <CardDescription>전체 할 일</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-green-600">
              {completed}
            </CardTitle>
            <CardDescription>완료된 할 일</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-orange-600">
              {pending}
            </CardTitle>
            <CardDescription>남은 할 일</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* 기능 소개 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>✅ 간편한 관리</CardTitle>
            <CardDescription>
              할 일을 쉽게 추가하고 관리할 수 있습니다
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🔄 실시간 동기화</CardTitle>
            <CardDescription>
              API를 통해 데이터를 실시간으로 동기화합니다
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📊 통계 제공</CardTitle>
            <CardDescription>
              진행 상황을 한눈에 확인할 수 있습니다
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🎨 아름다운 UI</CardTitle>
            <CardDescription>shadcn/ui로 만든 세련된 디자인</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
