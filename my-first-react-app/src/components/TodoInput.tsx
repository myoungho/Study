import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useTodoStore } from "@/store/useTodoStore";

export function TodoInput() {
  const { loading, addTodo } = useTodoStore();
  const [inputText, setInputText] = useState("");

  const handleAddTodo = async () => {
    await addTodo(inputText);
    setInputText("");
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex gap-2">
          <Input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
            placeholder="할 일을 입력하세요"
            className="flex-1"
            disabled={loading}
          />
          <Button onClick={handleAddTodo} disabled={loading}>
            {loading ? "추가 중..." : "추가"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
