# RePrompt Chrome Extension

YouTube와 Instagram 비디오에서 AI 프롬프트를 추출하는 Chrome Extension입니다.

## 📁 프로젝트 구조

```
chrome-extension/
├── src/
│   ├── types/           # TypeScript 타입 정의
│   │   └── chrome.d.ts
│   ├── common/          # 공통 유틸리티 및 상수
│   │   ├── constants.ts
│   │   └── utils.ts
│   ├── content/         # Content Scripts
│   │   └── content.ts
│   ├── popup/           # Popup 관련 파일
│   │   ├── popup.html
│   │   └── popup.ts
│   └── background/      # Background Scripts (예정)
│       └── background.ts
├── public/              # 정적 리소스
│   ├── manifest.json
│   └── icons/
│       └── icon.png
├── dist/                # 빌드 결과물
└── docs/                # 문서
```

## 🚀 시작하기

### 설치

```bash
npm install
```

### 개발

```bash
npm run dev
```

### 빌드

```bash
npm run build
```

### 프로덕션 빌드

```bash
npm run build:prod
```

## 🔧 개발 환경

- **TypeScript**: 타입 안전성을 위한 TypeScript 사용
- **Vite**: 빠른 번들링과 개발 서버
- **React**: 현대적인 UI 컴포넌트 (선택적)
- **ESLint**: 코드 품질 관리

## 📦 Chrome Extension 설치

1. `npm run build:prod`로 빌드
2. Chrome 브라우저에서 `chrome://extensions/` 접속
3. "개발자 모드" 활성화
4. "압축해제된 확장 프로그램을 로드합니다" 클릭
5. `dist` 폴더 선택

## 🛠️ 주요 기능

- **비디오 정보 추출**: YouTube, Instagram 비디오 제목 및 설명 추출
- **플랫폼 감지**: 자동으로 현재 플랫폼 감지
- **타입 안전성**: TypeScript로 구현된 타입 안전한 코드
- **모던 UI**: 깔끔하고 직관적인 사용자 인터페이스

## 📝 스크립트 명령어

- `npm run dev`: 개발 모드 (watch 모드)
- `npm run build`: 빌드
- `npm run build:prod`: 프로덕션 빌드 (에셋 복사 포함)
- `npm run lint`: 코드 린팅
- `npm run clean`: 빌드 폴더 정리

## 🌟 개선된 점

### 1. 구조화된 폴더 시스템
- 기능별로 명확하게 분리된 폴더 구조
- 공통 로직의 재사용성 증대

### 2. TypeScript 지원
- 타입 안전성 보장
- 개발자 경험 향상
- Chrome API 타입 지원

### 3. 모던 빌드 시스템
- Vite를 사용한 빠른 빌드
- 개발 중 실시간 업데이트
- 최적화된 번들링

### 4. 향상된 UX
- 직관적인 팝업 인터페이스
- 로딩 상태 표시
- 에러 핸들링

## 🔄 마이그레이션 가이드

기존 구조에서 새로운 구조로 마이그레이션된 주요 변경사항:

1. **파일 위치 변경**:
   - `popup/` → `src/popup/`
   - `content.js` → `src/content/content.ts`
   - `manifest.json` → `public/manifest.json`

2. **TypeScript 도입**:
   - JavaScript 파일들을 TypeScript로 변환
   - 타입 정의 추가

3. **빌드 시스템 개선**:
   - Vite 설정 최적화
   - 다중 엔트리 포인트 지원

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스하에 배포됩니다.
# re-prompt-chrome-extension
