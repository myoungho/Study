import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTodoStore } from "@/store/useTodoStore";
import { updateTodoSchema, type UpdateTodoInput } from "@/types/todo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export function TodoEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { todos } = useTodoStore();

  const todo = todos.find((t) => t.id === Number(id));

  const form = useForm<UpdateTodoInput>({
    resolver: zodResolver(updateTodoSchema),
    defaultValues: {
      title: "",
      description: "",
      completed: false,
    },
  });

  useEffect(() => {
    if (todo) {
      form.reset({
        title: todo.title,
        description: todo.description || "",
        completed: todo.completed,
      });
    }
  }, [todo, form]);

  if (!todo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>할 일을 찾을 수 없습니다</CardTitle>
        </CardHeader>
        <CardContent>
          <Link to="/todos">
            <Button>목록으로 돌아가기</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const onSubmit = async (data: UpdateTodoInput) => {
    // 여기서는 제목과 설명만 업데이트
    // 실제로는 API 호출이 필요하지만, JSONPlaceholder는 지원 안 함
    console.log("Update data:", data);
    navigate(`/todos/${id}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>할 일 수정</CardTitle>
          <CardDescription>할 일을 수정하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* 제목 */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>제목</FormLabel>
                    <FormControl>
                      <Input placeholder="할 일 제목" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 설명 */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>설명</FormLabel>
                    <FormControl>
                      <Textarea placeholder="상세 설명" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 완료 상태 */}
              <FormField
                control={form.control}
                name="completed"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer">완료됨</FormLabel>
                  </FormItem>
                )}
              />

              {/* 버튼 */}
              <div className="flex gap-3">
                <Button type="submit">저장</Button>
                <Link to={`/todos/${id}`}>
                  <Button type="button" variant="outline">
                    취소
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
