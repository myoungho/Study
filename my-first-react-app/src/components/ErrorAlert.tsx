import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTodoStore } from "@/store/useTodoStore";

export function ErrorAlert() {
  const { error, setError } = useTodoStore();

  if (!error) return null;

  return (
    <Card className="mb-6 border-red-300 bg-red-50">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2">
          <span className="text-red-600">⚠️</span>
          <p className="text-red-700">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setError(null)}
            className="ml-auto"
          >
            닫기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
