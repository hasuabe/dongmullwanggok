---

### 1. 프로젝트 개요

### 1.1 동기

> 우리는 매일 가장 가까운 곳에서 우리를 무조건적으로 사랑해 주는 존재들과 함께 살아갑니다. 하지만 그들이 몸짓으로, 눈빛으로, 그리고 작은 소리로 수없이 건네던 말들을 우리는 얼마나 이해하고 있었을까요? 아플 때 아프다고 말하지 못해 혼자 견뎌야 했던 시간들, 기쁨과 슬픔을 온전히 나누지 못해 지나쳐야 했던 순간들은 늘 우리에게 미안함으로 남았습니다.
> 
> 
> 동물어 번역은 단순히 다른 언어를 해석하는 기술이 아닙니다. 말 없는 생명들의 가장 깊은 속삭임을 귀담아듣고, 그동안 전하지 못했던 우리의 진심을 닿게 만드는 '공감의 다리'입니다. 이 기술을 통해 더 이상 일방적인 보살핌이 아닌, 진정한 소통과 교감이 이루어지는 세상을 만들고자 이 길을 시작하게 되었습니다.
> 

### 1.2 목표 (Goals)

- **세부 목표:**
    - **핵심 목표:** 우리가 만든 웹앱으로 실제 동물들과 대화 나눠보기
    - 강아지/고양이 울음소리를 감정 카테고리로 분류
    - 자연스러운 한국어 문장으로 변환 + TTS 음성 출력
    - 성별별 차별화된 목소리로 몰입감 제공
    - **서버/DB 없이** 정적 호스팅만으로 동작
    - 오프라인에서도 동작 (PWA 확장 가능)

### 1.3 타겟 사용자

- 반려동물(강아지/고양이) 보호자
- 반려동물의 감정을 더 잘 이해하고 싶은 사람
- 재미와 교감을 동시에 원하는 캐주얼 유저

### 1.4 플랫폼 및 제약사항

- **반응형 웹페이지** (모바일 우선 설계)
- **지원 브라우저:** Chrome, Safari, Edge 최신 버전
- **MVP 지원 동물:** 강아지, 고양이
- **아키텍처 제약:**
    - ❌ 외부 API 호출 없음 (OpenAI, Hugging Face 등)
    - ❌ 백엔드 서버 없음
    - ❌ 데이터베이스 없음
    - ✅ 모든 데이터는 정적 파일(JSON, 오디오, 이미지)로 번들
    - ✅ 사용자 데이터는 `localStorage`에만 저장

---

### 2. 상세 기획

### 2.1 핵심 컨셉

> 마이크에 동물 소리를 들려주면, 브라우저 내부에서 오디오 특성을 분석하고 사전 정의된 문장 풀에서 매칭해 말풍선과 음성으로 들려준다.
> 

### 2.2 사용자 시나리오 (User Flow)

`1. 웹사이트 접속 (정적 호스팅)
2. 반려동물 정보 등록 (종류, 성별, 이름)
   → localStorage 저장
3. (선택) 반려동물 사진 업로드 → IndexedDB 또는 base64로 localStorage
4. 🎤 마이크 버튼 클릭 → 3~5초 녹음
5. 브라우저 내부에서 오디오 특성 분석 (Web Audio API)
6. 특성값 → 감정 분류 (규칙 기반 + 랜덤 가중치)
7. 감정 → 사전 정의된 문장 풀에서 랜덤 선택
8. 말풍선 표시 + TTS 음성 재생 (Web Speech API)
9. 결과를 localStorage 히스토리에 저장`

### 2.3 주요 기능 명세

### 🛠 기능 1: 동물 정보 설정

| 항목 | 옵션 | 저장 위치 |
| --- | --- | --- |
| 동물 종류 | 강아지 / 고양이 | localStorage |
| 성별 | 수컷 / 암컷 | localStorage |
| 이름 (선택) | 텍스트 입력 | localStorage |
| 나이대 (선택) | 새끼 / 성체 / 노령 | localStorage |
| 사진 (선택) | 이미지 파일 | base64 → localStorage |

### 🛠 기능 2: 소리 입력 및 분석

- **입력 방식**
    - 실시간 마이크 녹음 (MediaRecorder API)
    - 오디오 파일 업로드 (.wav, .mp3, .m4a)
- **분석 처리 (100% 클라이언트)**
    - Web Audio API의 `AnalyserNode`로 오디오 특성 추출
        - **볼륨 (RMS):** 평균 음량
        - **피치 (주파수):** dominant frequency
        - **지속 시간:** 녹음 길이
        - **변동성:** 주파수 변화량 (Zero Crossing Rate)
    - 추출된 특성값을 사전 정의된 규칙에 매핑

### 🛠 기능 3: 감정 분류 로직 (규칙 기반)

**강아지 분류 예시:**

| 감정 | 볼륨 | 피치 | 지속시간 | 변동성 |
| --- | --- | --- | --- | --- |
| 행복/반가움 | 중~높음 | 높음 | 짧음 | 높음 |
| 배고픔 | 중간 | 중간 | 김 | 낮음 |
| 경계/위협 | 높음 | 낮음 | 김 | 낮음 |
| 외로움/불안 | 낮음~중간 | 높음 | 매우 김 | 중간 |
| 통증/불편 | 높음 | 매우 높음 | 짧음 | 높음 |
| 놀이 요청 | 중간 | 중간 | 짧음 | 높음 |

> 단순 분류 정확도는 낮지만, **"재미 위주"** 컨셉으로 가중치 + 랜덤성 추가하면 충분히 매력적입니다.
> 

**고양이도 동일 구조의 별도 규칙 테이블 적용**

### 🛠 기능 4: 번역 문장 생성 (정적 JSON 매핑)

- 감정별 문장 풀을 JSON 파일로 사전 작성
- 분류된 감정에 해당하는 풀에서 랜덤 선택
- 동물 이름이 입력된 경우, `{name}` 자리표시자를 치환

**예시 `src/data/translations.json`:**

json

`{
  "dog": {
    "happy": [
      "주인님 왔다! 너무 좋아!",
      "오늘 같이 산책 가는 거지? 신난다!",
      "{name}는 주인님이 최고로 좋아!"
    ],
    "hungry": [
      "배고파... 밥은 언제 줘?",
      "사료 그릇이 비었어. 봐봐!",
      "간식 하나만 주면 안 될까?"
    ]
  },
  "cat": {
    "satisfied": [
      "음... 지금 기분이 아주 좋다냥.",
      "쓰담쓰담 더 해줘.",
      "여긴 내 자리야. 편안하다냥~"
    ]
  }
}`

### 🛠 기능 5: 음성 출력 (TTS)

- **Web Speech API (`SpeechSynthesis`)** 사용 — 외부 API 불필요
- 텍스트 말풍선 + TTS 음성 동시 출력
- 말 끝에 동물 울음소리 효과음 추가
    - `public/sounds/` 폴더에 미리 번들 (`bark.mp3`, `meow.mp3` 등)
    - HTMLAudioElement로 재생
- 성별 매핑
    - 수컷 → `voice.name`에 "Male" 또는 한국어 남성 음성 필터
    - 암컷 → 여성 음성 필터
    - 음성 목록은 `speechSynthesis.getVoices()`로 조회

### 🛠 기능 6: 시각적 효과

- 녹음 중 파형 시각화 (Canvas + AnalyserNode)
- 결과 출력 시 말풍선 페이드인/바운스 애니메이션 (Tailwind + CSS)
- 동물 사진 업로드 시 캐릭터 자리에 표시
- 감정에 따른 배경색/이모지 변화

### 🛠 기능 7: 대화 히스토리

- 최근 번역 결과 10건 `localStorage`에 저장
- 카드 리스트로 표시 (시간, 감정, 문장)
- "전체 삭제" 버튼 제공

---

### 3. 기술 스택 (프론트엔드 단독)

| 영역 | 기술 | 선정 이유 |
| --- | --- | --- |
| 프레임워크 | **React + Vite** | 빠른 개발, 정적 빌드 |
| 언어 | TypeScript | 타입 안정성 |
| 스타일링 | Tailwind CSS | 빠른 UI 구축 |
| 오디오 입력 | Web Audio API, MediaRecorder | 브라우저 네이티브 |
| 오디오 분석 | AnalyserNode (FFT) | 클라이언트 분석 |
| TTS | Web Speech API | 무료, 내장 |
| 상태 관리 | Zustand | 가볍고 간단 |
| 라우팅 | React Router | 페이지 분기 |
| 영구 저장 | localStorage / IndexedDB | 서버 불필요 |
| 배포 | Vercel / Netlify / GitHub Pages | 정적 호스팅 무료 |

> **백엔드, 데이터베이스, 외부 API 모두 없음.**
> 

---

### 4. 시스템 아키텍처

`┌─────────────────────────────────────────────────┐
│              사용자 브라우저 (Client Only)         │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │  React App (정적 번들)                    │   │
│  │                                           │   │
│  │  ┌─────────────┐  ┌──────────────────┐  │   │
│  │  │ 마이크 녹음   │→ │ 오디오 분석       │  │   │
│  │  │ MediaRecorder│  │ AnalyserNode     │  │   │
│  │  └─────────────┘  │ (볼륨/피치/지속시간) │  │   │
│  │                   └────────┬─────────┘  │   │
│  │                            ▼            │   │
│  │                   ┌──────────────────┐  │   │
│  │                   │ 규칙 기반 분류기   │  │   │
│  │                   │ (TypeScript 함수) │  │   │
│  │                   └────────┬─────────┘  │   │
│  │                            ▼            │   │
│  │                   ┌──────────────────┐  │   │
│  │                   │ 문장 매핑         │  │   │
│  │                   │ translations.json│  │   │
│  │                   └────────┬─────────┘  │   │
│  │                            ▼            │   │
│  │   ┌──────────────────┬──────────────┐  │   │
│  │   ▼                  ▼              ▼  │   │
│  │ 말풍선 UI       Web Speech API   효과음  │   │
│  │                  (TTS)         bark.mp3 │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │ localStorage: 프로필, 히스토리            │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
            ▲
            │ 정적 파일 서빙
            │
   ┌─────────────────────┐
   │ Vercel/Netlify/     │
   │ GitHub Pages        │
   └─────────────────────┘`

---

### 5. 프로젝트 폴더 구조

`pettalk/
├── public/
│   ├── sounds/
│   │   ├── bark_short.mp3      # 강아지 짧은 짖음
│   │   ├── bark_long.mp3       # 강아지 긴 짖음
│   │   ├── meow_short.mp3      # 고양이 짧은 울음
│   │   └── meow_long.mp3       # 고양이 긴 울음
│   ├── images/
│   │   ├── dog_default.png
│   │   └── cat_default.png
│   └── favicon.ico
│
├── src/
│   ├── components/
│   │   ├── PetSetupForm.tsx        # 동물 정보 등록 폼
│   │   ├── MicRecorder.tsx          # 마이크 녹음 컴포넌트
│   │   ├── WaveformVisualizer.tsx   # 파형 시각화
│   │   ├── SpeechBubble.tsx         # 말풍선 UI
│   │   ├── HistoryList.tsx          # 히스토리 카드 리스트
│   │   └── PetAvatar.tsx            # 동물 아바타/사진
│   │
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Setup.tsx
│   │   ├── Translate.tsx            # 메인 번역 페이지
│   │   └── History.tsx
│   │
│   ├── lib/
│   │   ├── audioAnalyzer.ts         # 오디오 특성 추출
│   │   ├── emotionClassifier.ts     # 규칙 기반 분류
│   │   ├── translator.ts            # 감정 → 문장 매핑
│   │   ├── tts.ts                   # Web Speech API 래퍼
│   │   └── storage.ts               # localStorage 헬퍼
│   │
│   ├── data/
│   │   ├── translations.json        # 감정별 문장 풀
│   │   └── classificationRules.json # 분류 규칙 테이블
│   │
│   ├── store/
│   │   └── usePetStore.ts           # Zustand 전역 상태
│   │
│   ├── types/
│   │   └── index.ts                 # 타입 정의
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md`

---

### 6. 핵심 모듈 설계

### 6.1 `audioAnalyzer.ts` — 오디오 특성 추출

typescript

`export interface AudioFeatures {
  volumeRMS: number;       // 0~1
  dominantFreq: number;    // Hz
  duration: number;        // seconds
  zeroCrossingRate: number; // 변동성
}

export async function analyzeAudio(blob: Blob): Promise<AudioFeatures> {
  const arrayBuffer = await blob.arrayBuffer();
  const audioCtx = new AudioContext();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  // FFT 분석으로 특성 추출...
}`

### 6.2 `emotionClassifier.ts` — 규칙 기반 분류

typescript

`export type Emotion = 'happy' | 'hungry' | 'alert' | 'lonely' | 'pain' | 'play';

export function classifyEmotion(
  features: AudioFeatures,
  animal: 'dog' | 'cat'
): Emotion {
  // classificationRules.json 기반 점수 계산
  // 가중치 + 약간의 랜덤성으로 자연스러운 결과
}`

### 6.3 `translator.ts` — 문장 매핑

typescript

`import translations from '../data/translations.json';

export function getTranslation(
  animal: 'dog' | 'cat',
  emotion: Emotion,
  petName?: string
): string {
  const pool = translations[animal][emotion];
  const random = pool[Math.floor(Math.random() * pool.length)];
  return petName ? random.replace('{name}', petName) : random;
}`

### 6.4 `tts.ts` — Web Speech API 래퍼

typescript

`export function speak(text: string, gender: 'male' | 'female') {
  const utter = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();
  const korean = voices.filter(v => v.lang.startsWith('ko'));
  // 성별 매칭 로직...
  utter.voice = matched;
  speechSynthesis.speak(utter);
}`

---

### 7. UI/UX 설계

### 7.1 페이지 구조

1. **홈 / 온보딩 페이지** — 서비스 소개, 시작 버튼
2. **반려동물 등록 페이지** — 종류, 성별, 이름, 사진
3. **메인 번역 페이지** ⭐
    - 중앙: 동물 사진/일러스트
    - 하단: 큰 마이크 버튼
    - 녹음 중: 파형 애니메이션
    - 결과: 말풍선 표시
4. **히스토리 페이지** — 과거 번역 결과 카드

### 7.2 컬러 팔레트

- Primary: 따뜻한 베이지 (`#F5E6D3`)
- Accent: 코럴 핑크 (`#FF8A80`) / 스카이 블루 (`#81D4FA`)
- Text: 다크 브라운 (`#3E2723`)

---

### 8. 개발 일정 (4~5주)

| 주차 | 작업 내용 | 산출물 |
| --- | --- | --- |
| **1주차** | 프로젝트 세팅, 디자인 와이어프레임, 라우팅 구성 | Figma 시안, 레포 초기화 |
| **2주차** | 반려동물 등록, localStorage 연동, 사진 업로드 | 프로필 등록 완성 |
| **3주차** | 마이크 녹음, Web Audio 특성 추출, 파형 시각화 | 오디오 분석 동작 |
| **4주차** | 감정 분류 로직, 문장 매핑, TTS, 효과음 | 전체 플로우 완성 |
| **5주차** | 히스토리, 시각효과 다듬기, 정적 배포, 데모 영상 | 라이브 서비스 |

---

### 9. 역할 분담 (팀 예시)

| 역할 | 주요 업무 |
| --- | --- |
| **프론트엔드 A** | UI 컴포넌트, 라우팅, 상태 관리 |
| **프론트엔드 B** | 오디오 녹음/분석, TTS, 효과음 |
| **데이터/규칙** | translations.json, classificationRules.json 작성, 감정 매핑 튜닝 |
| **디자인/기획** | 와이어프레임, 캐릭터 일러스트, 발표 자료 |

---

### 10. 위험 요소 및 대응

| 위험 | 영향 | 대응 |
| --- | --- | --- |
| 규칙 기반 분류 정확도 낮음 | 사용자 경험 저하 | "재미 위주" 컨셉으로 포지셔닝, 문장 풀 다양화 |
| Web Speech API 한국어 품질 | 어색한 TTS | 브라우저별 음성 테스트, 속도/피치 조정 |
| 마이크 권한 거부 | 핵심 기능 불가 | 오디오 파일 업로드 옵션 제공 |
| iOS Safari 호환성 | 일부 기능 동작 안 함 | MediaRecorder 폴리필, 사용 가이드 명시 |
| 사진 base64가 localStorage 한도 초과 | 저장 실패 | 사진은 IndexedDB로 분리 |
| 데모 시 실제 동물 없음 | 시연 어려움 | 샘플 오디오 파일 미리 번들 |

---

### 11. MVP 완료 기준

- ✅ 강아지/고양이 선택 + 정보 입력 가능
- ✅ 마이크로 3~5초 녹음 후 분석 결과 표시
- ✅ 최소 5가지 감정 카테고리 분류
- ✅ 한국어 문장 + TTS 음성 출력
- ✅ 성별에 따른 음성 차별화
- ✅ 사진 업로드 및 표시
- ✅ 히스토리 저장/조회
- ✅ 모바일 브라우저에서 정상 작동
- ✅ 정적 호스팅(Vercel/Netlify)에 배포

