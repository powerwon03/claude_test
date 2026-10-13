# 전화번호부

Next.js + Supabase 로 만든 간단한 전화번호 관리 사이트입니다. Vercel 에 배포합니다.

## 기능

- 연락처 추가 / 수정 / 삭제 (이름, 전화번호, 이메일, 메모)
- 이름, 번호, 이메일, 메모 통합 검색
- 전화번호 자동 정리 (`01012345678` 입력 시 `010-1234-5678` 로 표시)
- 번호 클릭 시 바로 전화 걸기 (모바일)

## 1. Supabase 설정

1. https://supabase.com 에서 새 프로젝트를 만듭니다.
2. 왼쪽 메뉴 **SQL Editor** 를 열고 `supabase/schema.sql` 내용을 붙여넣어 실행합니다.
3. **Settings > API** 에서 `Project URL` 과 `anon public` 키를 복사합니다.

## 2. 로컬 실행

```bash
copy .env.example .env.local   # 복사 후 값 채우기 (mac/linux: cp)
npm install
npm run dev
```

`.env.local` 내용:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

http://localhost:3000 에서 확인합니다.

## 3. Vercel 배포

1. 이 저장소를 GitHub 에 push 합니다.
2. https://vercel.com/new 에서 저장소를 Import 합니다.
3. **Environment Variables** 에 위 두 값을 추가합니다.
4. Deploy 를 누르면 끝입니다. 이후 `main` 브랜치에 push 할 때마다 자동 배포됩니다.

## 구조

```
src/app/page.tsx          목록 + 검색 (서버 컴포넌트)
src/app/actions.ts        추가/수정/삭제 서버 액션
src/components/           폼, 목록, 검색창
src/lib/supabase.ts       Supabase 클라이언트
src/lib/phone.ts          전화번호 정규화/표시
supabase/schema.sql       테이블 + RLS 정책
```

## 보안 메모

현재 RLS 정책은 anon 키로 누구나 읽고 쓸 수 있게 열려 있습니다 (개인용 전제).
외부에 공개할 경우 Supabase Auth 를 붙이고 정책을 `auth.uid()` 기준으로 좁히세요.
