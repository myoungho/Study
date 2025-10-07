import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { useTodoFilterStore } from "@/features/todo/model/filter-store";
import { TodoCreateForm } from "@/features/todo/create";
import { TodoFilter } from "@/features/todo/filter";
import { useToggleTodoMutation, useTodosQuery } from "@/entities/todo/model/hooks";
import type { TodoEntity, TodoStatus } from "@/entities/todo/model/types";
import { TodoCard } from "@/entities/todo/ui";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { PageContainer, PageHeader, PageSubtitle, PageTitle } from "@/shared/ui/layout";

export function TodosPage() {
  const { data: todos = [], isPending, isError, error } = useTodosQuery();
  const toggleMutation = useToggleTodoMutation();
  const filter = useTodoFilterStore();

  const filteredTodos = useMemo(() => applyFilter(todos, filter.search, filter.status), [
    todos,
    filter.search,
    filter.status,
  ]);

  return (
    <PageContainer>
      <PageHeader className="space-y-3">
        <PageTitle>업무 보드</PageTitle>
        <PageSubtitle className="text-muted">
          상태, 검색어, 개인화된 워크플로우로 업무를 정리하세요.
        </PageSubtitle>
      </PageHeader>

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-6">
          <TodoCreateForm />
          <TodoFilter />
        </div>
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>팀 온보딩 팁</CardTitle>
            <CardDescription>
              ASP.NET Core 백엔드와 연동할 때 고려해야 할 체크리스트입니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted">
            <ul className="list-disc space-y-2 pl-4">
              <li>Todo API를 ASP.NET Minimal API로 래핑하고 Swagger 계약을 공유하세요.</li>
              <li>React Query의 <code>queryFn</code>에 Axios 인스턴스를 주입해 오류를 일관되게 처리하세요.</li>
              <li>Zustand는 클라이언트 상태(필터, 테마)를, 서버 상태는 React Query가 담당합니다.</li>
            </ul>
            <Button variant="ghost" asChild>
              <Link to="/">아키텍처 가이드 보기</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <PageTitle className="text-2xl">업무 목록</PageTitle>
        {isError && (
          <p className="rounded-lg border border-rose-400/40 bg-rose-500/10 p-4 text-sm text-rose-300 dark:border-rose-200 dark:bg-rose-100/60 dark:text-rose-700">
            데이터를 불러오지 못했습니다. {(error as Error).message}
          </p>
        )}
        {isPending ? (
          <p className="text-sm text-muted">업무를 불러오는 중입니다...</p>
        ) : (
          <div className="grid gap-3">
            {filteredTodos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onToggle={(item) =>
                  toggleMutation.mutate({ id: item.id, completed: !item.completed })
                }
              />
            ))}
            {filteredTodos.length === 0 && (
              <p className="surface-card rounded-lg border border-surface p-4 text-sm text-muted">
                조건에 해당하는 업무가 없습니다. 다른 검색어를 시도하세요.
              </p>
            )}
          </div>
        )}
      </section>
    </PageContainer>
  );
}

function applyFilter(todos: TodoEntity[], search: string, status: TodoStatus) {
  const normalizedSearch = search.toLowerCase().trim();
  return todos.filter((todo) => {
    const matchesQuery = normalizedSearch
      ? todo.title.toLowerCase().includes(normalizedSearch)
      : true;

    const matchesStatus =
      status === "all"
        ? true
        : status === "completed"
        ? todo.completed
        : !todo.completed;

    return matchesQuery && matchesStatus;
  });
}
