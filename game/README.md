# 2024026025 이지원 게임

Next.js + Supabase 로 만든 가위바위보 웹 게임입니다. Vercel 에 배포합니다.

## 기능

- 가위 / 바위 / 보 버튼을 누르면 컴퓨터가 랜덤으로 선택하고 승패를 판정
- 이번 접속 동안의 승 / 패 / 무 점수 표시
- 닉네임과 함께 매 판 결과를 Supabase 에 저장
- 최근 10판 기록과 전체 승률 표시

## 1. Supabase 설정

1. https://supabase.com 에서 프로젝트를 만듭니다. (기존 프로젝트를 써도 됩니다)
2. 왼쪽 메뉴 **SQL Editor** 를 열고 `supabase/schema.sql` 내용을 붙여넣어 **Run** 합니다.
3. **Project Settings > API** 에서 `Project URL` 과 `anon public` 키를 복사합니다.

## 2. 로컬 실행

```bash
copy .env.example .env.local   # mac/linux: cp .env.example .env.local
npm install
npm run dev
```

`.env.local` 에 복사한 값을 넣습니다.

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

http://localhost:3000 에서 확인합니다. 환경 변수가 없어도 게임은 동작하고, 기록 저장만 생략됩니다.

## 3. GitHub 에 올리기

```bash
git add game
git commit -m "Add rock-paper-scissors game"
git push
```

## 4. Vercel 배포

1. https://vercel.com/new 에서 GitHub 저장소를 Import 합니다.
2. **Root Directory** 를 `game` 으로 지정합니다. (이 폴더가 저장소의 하위 폴더이기 때문)
3. **Environment Variables** 에 위 두 값을 추가합니다.
4. **Deploy** 를 누르면 끝입니다. 이후 push 할 때마다 자동 배포됩니다.

## 파일 구조

```
src/lib/game.ts           가위바위보 규칙 (승패 판정, 랜덤 선택)
src/lib/supabase.ts       Supabase 클라이언트
src/lib/types.ts          DB 행 타입
src/app/page.tsx          메인 페이지 (기록 불러오기, 서버 컴포넌트)
src/app/actions.ts        결과 저장 서버 액션
src/components/Game.tsx   게임 UI (클라이언트 컴포넌트)
src/components/History.tsx 기록 / 통계 표시
supabase/schema.sql       games 테이블 + RLS 정책
```

## 동작 흐름

1. 버튼 클릭 → `Game.tsx` 에서 컴퓨터 선택과 승패를 계산해 바로 화면에 표시
2. 동시에 서버 액션 `saveGame` 을 호출 → 서버에서 승패를 다시 계산해 `games` 테이블에 insert
3. 저장 후 `revalidatePath("/")` 가 실행되어 아래쪽 기록 목록이 자동으로 갱신
