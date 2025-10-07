import { Link } from "@tanstack/react-router";
import { useTodosQuery } from "@/entities/todo/model/hooks";
import { TodoCard } from "@/entities/todo/ui";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { PageContainer, PageHeader, PageSubtitle, PageTitle } from "@/shared/ui/layout";

export function HomePage() {
  const { data: todos, isPending } = useTodosQuery();
  const topTodos = todos?.slice(0, 3) ?? [];

  return (
    <PageContainer>
      <PageHeader className="space-y-3">
        <PageTitle>오늘의 업무를 계획해보세요</PageTitle>
        <PageSubtitle>
          진행 중인 업무를 한눈에 살펴보고, 완료율을 높이기 위한 집중 영역을 찾아보세요.
        </PageSubtitle>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/todos">업무 보드로 이동</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/auth/sign-in">팀에 합류하기</Link>
          </Button>
        </div>
      </PageHeader>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>새로운 업무 흐름</CardTitle>
            <CardDescription>
              React Query, Zustand, TanStack Router로 구성된 현대적인 프론트엔드 아키텍처를 체험하세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted">
            이 프로젝트는 Feature-Sliced Design을 기반으로 도메인을 분리하고, 서버 상태와 클라이언트 상태를 명확히 구분합니다. ASP.NET Core와 WPF 개발 경험을 그대로 살려 빠르게 적응할 수 있도록 구성했습니다.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>기술 스택 하이라이트</CardTitle>
            <CardDescription>
              React 19 · TanStack Router · React Query · Zustand · Tailwind CSS 4 · Sonner
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted">
            QueryClientProvider로 HTTP 캐시를 관리하고, Zustand는 세션, 필터, 테마 같은 UI 상태를 담당합니다. Tailwind와 cva로 디자인 시스템을 수립해 추후 확장도 용이합니다.
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <PageTitle className="text-2xl">최근 업무</PageTitle>
          <Button variant="ghost" asChild>
            <Link to="/todos">전체 보기</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {isPending && <p className="text-sm text-muted">업무를 불러오는 중입니다...</p>}
          {!isPending &&
            topTodos.map((todo) => (
              <TodoCard key={todo.id} todo={todo} />
            ))}
        </div>
      </section>
    </PageContainer>
  );
}
