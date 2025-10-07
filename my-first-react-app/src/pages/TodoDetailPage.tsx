import { useParams, useNavigate, Link } from "react-router-dom";
import { useTodoStore } from "@/store/useTodoStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export function TodoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { todos, toggleTodo, removeTodo } = useTodoStore();

  const todo = todos.find((t) => t.id === Number(id));

  if (!todo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>할 일을 찾을 수 없습니다</CardTitle>
          <CardDescription>존재하지 않는 할 일입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/todos">
            <Button>목록으로 돌아가기</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const handleDelete = async () => {
    await removeTodo(todo.id);
    navigate("/todos");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">할 일 상세</CardTitle>
          <CardDescription>ID: {todo.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 내용 */}
          <div>
            <h3 className="font-semibold mb-2">내용</h3>
            <p className="text-lg">{todo.title}</p>
          </div>

          {/* 완료 상태 */}
          <div className="flex items-center gap-3">
            <Checkbox
              id="completed"
              checked={todo.completed}
              onCheckedChange={() => toggleTodo(todo.id)}
            />
            <label htmlFor="completed" className="cursor-pointer">
              {todo.completed ? "완료됨 ✅" : "미완료"}
            </label>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <Link to="/todos">
              <Button variant="outline">← 목록으로</Button>
            </Link>
            <Link to={`/todos/${id}/edit`}>
              <Button>수정</Button>
            </Link>
            <Button variant="destructive" onClick={handleDelete}>
              삭제
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
