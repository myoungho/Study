- Vite 청크 크기 경고 감소
  1. devtools 컴포넌트를 개발 모드에서만 로드 (import.meta.env.DEV)
  2. React.lazy로 페이지와 무거운 위젯을 분리 로딩
  3. vite.config.ts에서 manualChunks 설정으로 vendor 묶음 분리

