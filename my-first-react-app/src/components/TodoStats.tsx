import { Card, CardContent } from "@/components/ui/card";
import { useTodoStore } from "@/store/useTodoStore";

export function TodoStats() {
  const todos = useTodoStore((state) => state.todos);

  const total = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;
  const pending = total - completed;

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{total}</p>
            <p className="text-sm text-gray-600">전체</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{completed}</p>
            <p className="text-sm text-gray-600">완료</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">{pending}</p>
            <p className="text-sm text-gray-600">미완료</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
