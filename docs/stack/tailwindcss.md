# Tailwind CSS 4 실무 온보딩 가이드

## 초급: WPF XAML 스타일과의 연결
- **Tailwind 유틸리티 클래스 = XAML `Setter` + `Style`**: 미리 정의된 속성 조합을 클래스 하나로 부여합니다.
- **Responsive Prefix (`sm:`, `lg:`) = Adaptive Trigger**: WPF `VisualStateManager`나 `AdaptiveTrigger`처럼 조건별 스타일 적용.
- **다크 모드 = ResourceDictionary 전환**: CSS 변수와 프리셋으로 테마를 바꿉니다.

### 실습 1: 기본 레이아웃 작성
```tsx
export function HeroSection() {
  return (
    <section className="mx-auto max-w-3xl space-y-6 rounded-3xl bg-slate-900 px-8 py-12 text-white shadow-xl">
      <h1 className="text-4xl font-bold tracking-tight">Todo Dashboard</h1>
      <p className="text-slate-200 leading-relaxed">
        Tailwind 유틸리티 클래스를 조합해 UI를 빠르게 구축하세요.
      </p>
      <div className="flex flex-wrap gap-3">
        <button className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold hover:bg-emerald-600">
          시작하기
        </button>
        <button className="rounded-lg border border-white/20 px-4 py-2 hover:bg-white/10">
          문서 보기
        </button>
      </div>
    </section>
  );
}
```
- XAML에서 `Grid`, `StackPanel`로 배치를 조합하던 방식처럼 클래스를 조합합니다.

## 중급: 디자인 시스템 연동
### class-variance-authority(cva)
```ts
import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold",
  {
    variants: {
      tone: {
        info: "bg-sky-100 text-sky-700",
        success: "bg-emerald-100 text-emerald-700",
        danger: "bg-rose-100 text-rose-700",
      },
    },
    defaultVariants: {
      tone: "info",
    },
  }
);
```
- WPF 스타일에서 `BasedOn`으로 변형을 만들던 경험을 Tailwind에서도 재현.

### 디자인 토큰 관리
- `components.json`과 `src/index.css`에서 CSS 변수를 정의하면 WPF ResourceDictionary처럼 모든 컴포넌트에서 공유합니다.
- 예) `:root { --primary: 99 102 241; }` → `bg-primary/90`로 사용.

## 고급: 생산성 향상 기법
- **tailwind-merge / clsx**: 중복 클래스 정리 → XAML `StaticResource` 재사용과 비슷한 효과.
- **동적 클래스 safelist**: `bg-${color}`처럼 런타임에 결정되는 클래스는 `safelist`에 등록해 빌드 시 제거되지 않도록.
- **애니메이션**: `tw-animate-css` 또는 `@keyframes`로 WPF Storyboard와 유사한 효과 구현.
- **디자인 검증**: WPF Blend처럼 Tailwind Play(https://play.tailwindcss.com/)에서 빠르게 프로토타입.

## 실무 체크리스트
- [ ] 공통 UI는 `src/components/ui/`의 shadcn/ui 래퍼를 우선 활용.
- [ ] spacing/폰트/컬러는 Tailwind 기본 스케일을 사용해 일관성을 유지.
- [ ] 반응형 요구가 있다면 `sm:`, `md:`, `lg:` 순으로 구성하고 모바일 우선으로 설계.
- [ ] 커스텀 CSS는 최소화하고, 재사용 가능한 조합은 `cva` 혹은 헬퍼 함수로 추출.

## 프로젝트 숙제
1. Todo 카드 컴포넌트를 만들어 상태별 색상(`Completed`, `Pending`)을 적용.
2. 다크/라이트 테마 토글을 Zustand와 연동해 CSS 클래스 전환.
3. WPF 스타일 가이드 문서를 참고해 Tailwind 토큰 매핑표 작성.

## 참고 자료
- [Tailwind CSS Docs](https://tailwindcss.com/docs/utility-first)
- [Tailwind Play](https://play.tailwindcss.com/)
- [XAML Styles vs Tailwind 비교 글](https://dev.to/azure/tailwind-css-for-xaml-developers-2g8o)
