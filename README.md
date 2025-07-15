# 전설과의 대화

역사적인 과학자들과 대화할 수 있는 AI 채팅 애플리케이션입니다.

## 🚀 기능

- **아인슈타인**: 유머러스하고 친근한 과학자
- **피타고라스**: 종교적 색채를 가진 수학자
- **가우스**: 정중하고 진지한 수학자
- 이미지 업로드 및 분석 기능
- 실시간 채팅 인터페이스
- 캐릭터별 대화 기록 관리

## 🛠️ 설치 및 설정

### 1. 저장소 클론
```bash
git clone <repository-url>
cd chat-with-legends
```

### 2. API 키 설정
1. `.env.example` 파일을 `.env`로 복사
```bash
cp .env.example .env
```

2. `.env` 파일에 실제 Gemini API 키 입력
```
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. 실행
웹 서버를 통해 실행하세요:
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .

# 또는 다른 웹 서버 사용
```

브라우저에서 `http://localhost:8000`으로 접속

## 🔧 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **API**: Google Gemini AI
- **이미지 처리**: FileReader API

## 📁 프로젝트 구조

```
├── index.html          # 메인 HTML 파일
├── style.css           # 스타일시트
├── script.js           # JavaScript 로직
├── .env.example        # 환경변수 예시
├── .gitignore          # Git 제외 파일
└── README.md           # 프로젝트 문서
```

## 🔒 보안

- API 키는 환경변수로 관리
- 클라이언트 사이드에서 API 키 노출 방지
- 파일 업로드 검증 (타입, 크기 제한)
- HTML 이스케이프 처리

## 🎨 주요 개선사항

### 보안 강화
- ✅ API 키 환경변수 관리
- ✅ 파일 업로드 검증
- ✅ HTML 이스케이프 처리

### 코드 품질
- ✅ 클래스 기반 구조화
- ✅ 에러 처리 강화
- ✅ 코드 모듈화

### 사용자 경험
- ✅ 에러 메시지 표시
- ✅ 파일 크기 제한 (5MB)
- ✅ 이미지 타입 검증

## 🐛 알려진 이슈

- 브라우저에서 환경변수 접근 제한으로 인해 실제 배포 시에는 서버 사이드 프록시 구현 필요

## 📝 라이선스

Made by BTY &copy; 2024

## 🤝 기여

버그 리포트나 기능 제안은 이슈로 등록해주세요.