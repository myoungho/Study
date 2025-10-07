import { useTodoQuery, useToggleTodoMutation } from "@/entities/todo/model/hooks";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { PageContainer, PageHeader, PageSubtitle, PageTitle } from "@/shared/ui/layout";

interface TodoDetailPageProps {
  todoId: number;
}

export function TodoDetailPage({ todoId }: TodoDetailPageProps) {
  const { data: todo, isPending, isError } = useTodoQuery(todoId);
  const toggleMutation = useToggleTodoMutation();

  const handleToggle = () => {
    if (!todo) return;
    toggleMutation.mutate({ id: todo.id, completed: !todo.completed });
  };

  return (
    <PageContainer>
      <PageHeader className="space-y-3">
        <PageTitle>업무 상세</PageTitle>
        <PageSubtitle className="text-muted">
          단일 업무의 진행 상황과 메타데이터를 확인하세요.
        </PageSubtitle>
      </PageHeader>

      {isPending && <p className="text-sm text-muted">업무를 불러오는 중...</p>}
      {isError && (
        <p className="rounded-lg border border-rose-400/40 bg-rose-500/10 p-4 text-sm text-rose-300 dark:border-rose-200 dark:bg-rose-100/60 dark:text-rose-700">
          해당 업무를 찾을 수 없습니다.
        </p>
      )}

      {todo && (
        <Card>
          <CardHeader>
            <CardTitle>{todo.title}</CardTitle>
            <CardDescription>업무 번호 #{todo.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="surface-card rounded-xl border border-surface p-4">
              <span className="text-sm text-muted">현재 상태</span>
              <span className="text-sm font-semibold text-primary">
                {todo.completed ? "완료" : "진행중"}
              </span>
            </div>
            <Button onClick={handleToggle} disabled={toggleMutation.isPending}>
              {todo.completed ? "다시 진행 상태로" : "완료로 표시"}
            </Button>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}
