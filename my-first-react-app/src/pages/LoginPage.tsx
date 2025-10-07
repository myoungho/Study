import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginPage() {
  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>로그인</CardTitle>
          <CardDescription>9단계에서 구현 예정</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">이메일</label>
            <Input type="email" placeholder="your@email.com" disabled />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">비밀번호</label>
            <Input type="password" placeholder="••••••••" disabled />
          </div>
          <Button className="w-full" disabled>
            로그인 (준비 중)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
