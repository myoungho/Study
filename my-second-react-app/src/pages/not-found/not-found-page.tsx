import { Link } from "@tanstack/react-router";
import { Button } from "@/shared/ui/button";
import { PageContainer, PageHeader, PageSubtitle, PageTitle } from "@/shared/ui/layout";

export function NotFoundPage() {
  return (
    <PageContainer className="items-center text-center">
      <PageHeader className="space-y-3">
        <PageTitle>404 - 페이지를 찾을 수 없습니다</PageTitle>
        <PageSubtitle>
          URL을 다시 확인하거나, 대시보드로 돌아가 프로젝트를 계속 진행하세요.
        </PageSubtitle>
      </PageHeader>
      <Button asChild>
        <Link to="/">대시보드로 이동</Link>
      </Button>
    </PageContainer>
  );
}
