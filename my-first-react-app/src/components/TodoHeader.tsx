import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function TodoHeader() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">
          나의 Todo 앱
        </CardTitle>
        <CardDescription className="text-center">
          Zustand 상태 관리 버전
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
