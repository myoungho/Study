import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Todo 앱 소개</CardTitle>
          <CardDescription>
            React + TypeScript로 만든 현대적인 할 일 관리 앱
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-bold text-lg mb-2">🚀 기술 스택</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>React 19</li>
              <li>TypeScript</li>
              <li>Vite</li>
              <li>Tailwind CSS v4</li>
              <li>shadcn/ui</li>
              <li>Zustand (상태 관리)</li>
              <li>Axios (HTTP)</li>
              <li>React Router (라우팅)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">✨ 주요 기능</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>할 일 추가/수정/삭제</li>
              <li>완료 상태 관리</li>
              <li>API 연동 (JSONPlaceholder)</li>
              <li>로딩/에러 처리</li>
              <li>반응형 디자인</li>
              <li>다중 페이지 라우팅</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">👨‍💻 개발자</h3>
            <p>C# 백엔드 개발자의 프론트엔드 학습 프로젝트</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
