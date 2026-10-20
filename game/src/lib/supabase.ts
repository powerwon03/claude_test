import { createClient } from "@supabase/supabase-js";

// 환경 변수가 없으면 null 을 돌려줍니다.
// → DB 없이도 게임은 돌아가고, 기록 저장만 건너뜁니다.
export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
