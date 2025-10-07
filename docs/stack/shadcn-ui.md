# shadcn/ui 실무 온보딩 가이드

## 초급: WPF 컨트롤 템플릿 경험 살리기
- **shadcn/ui = WPF Custom Control 템플릿**: 접근성, 상태 관리가 포함된 Radix Primitive + Tailwind 스타일.
- **variant/size props = WPF `Style` `BasedOn`**: 옵션을 전달해 외형을 즉시 바꿀 수 있습니다.
- **Slot 패턴 = ContentPresenter**: `asChild`를 사용하면 기존 엘리먼트에 동작을 주입합니다.

### 실습 1: 기본 사용
```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QuickStartCard() {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>오늘의 작업</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>shadcn/ui 컴포넌트는 Tailwind와 Radix 기반입니다.</p>
        <Button variant="secondary">시작하기</Button>
      </CardContent>
    </Card>
  );
}
```

## 중급: 커스터마이징과 확장
### Variant 확장
```tsx
import { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

function SaveButton(props: ButtonVariantProps) {
  return (
    <button className={buttonVariants({ variant: "default", size: "lg", ...props })}>
      저장
    </button>
  );
}
```
- WPF의 ControlTemplate에서 Setter를 추가해 새로운 스타일을 만드는 것과 유사합니다.

### Radix Primitive 직접 조합
```tsx
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function ConfirmDialog({ open, onOpenChange, onConfirm }: Props) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Trigger asChild>
        <Button variant="outline">삭제</Button>
      </DialogPrimitive.Trigger>
      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>정말 삭제할까요?</DialogTitle>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => onConfirm(false)}>취소</Button>
            <Button onClick={() => onConfirm(true)}>삭제</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DialogPrimitive.Root>
  );
}
```
- Radix의 포커스 트랩, 키보드 네비게이션은 WPF ControlTemplate에 내장된 기본 동작과 유사합니다.

## 고급: 디자인 시스템과 협업
- **components.json 관리**: WPF ResourceDictionary처럼 디자인 토큰을 중앙에서 관리.
- **문서화**: 확장한 컴포넌트는 Storybook/문서에 변형 목록을 기록 (WPF Control Catalog와 비슷한 개념).
- **접근성 검증**: WPF `AutomationProperties` 경험을 살려 ARIA 속성을 유지하고 스크린리더 테스트.
- **업데이트 전략**: shadcn/ui는 코드 생성 템플릿이므로, 패키지 업데이트 시 diff를 확인하고 우리 수정 사항을 유지.

## 실무 체크리스트
- [ ] 새 UI 요구사항 발생 시 먼저 `src/components/ui`에 유사한 컴포넌트가 있는지 확인.
- [ ] Tailwind 클래스 수정 시 `cn()` 헬퍼로 조건부 클래스를 관리.
- [ ] Radix `Trigger`에는 `asChild`를 잊지 말아 중첩된 `<button>`을 피함.
- [ ] 접근성(포커스, 키보드, ARIA)을 실제로 테스트.

## 프로젝트 숙제
1. `AlertDialog` 컴포넌트로 삭제 확인 모달 구현.
2. `Card` 컴포넌트에 `tone` variant를 추가해 색상 테마 확장.
3. `Command` 컴포넌트를 활용해 글로벌 명령 팔레트(CTRL+K) 구현.

## 참고 자료
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [Radix UI Docs](https://www.radix-ui.com/docs/primitives/overview/introduction)
- [WPF Control Templates 개요](https://learn.microsoft.com/dotnet/desktop/wpf/controls/control-templates-overview)
