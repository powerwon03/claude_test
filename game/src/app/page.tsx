import { Game } from "@/components/Game";
import { History } from "@/components/History";
import { getSupabase } from "@/lib/supabase";
import type { GameRow, Stats } from "@/lib/types";

// 매 요청마다 DB 에서 최신 기록을 읽도록 설정
export const dynamic = "force-dynamic";

async function loadHistory(): Promise<{ games: GameRow[]; stats: Stats; error: string | null }> {
  const empty: Stats = { total: 0, win: 0, lose: 0, draw: 0 };
  const supabase = getSupabase();
  if (!supabase) return { games: [], stats: empty, error: null };

  // 최근 10판
  const recent = await supabase
    .from("games")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);
  if (recent.error) return { games: [], stats: empty, error: recent.error.message };

  // 전체 통계 (result 컬럼만 가져와서 개수 세기)
  const all = await supabase.from("games").select("result");
  if (all.error) return { games: [], stats: empty, error: all.error.message };

  const stats: Stats = { ...empty, total: all.data.length };
  for (const row of all.data as { result: "win" | "lose" | "draw" }[]) {
    stats[row.result] += 1;
  }

  return { games: recent.data as GameRow[], stats, error: null };
}

export default async function Home() {
  const canSave = getSupabase() !== null;
  const { games, stats, error } = await loadHistory();

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-8 sm:py-12">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">✊✋✌️ 2024026025 이지원 게임</h1>
        <p className="mt-1 text-sm text-gray-500">컴퓨터와 대결하고 기록을 남겨 보세요.</p>
      </header>

      <section className="mb-10 rounded-2xl border border-gray-200 p-6 shadow-sm dark:border-gray-700">
        <Game canSave={canSave} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">전체 기록</h2>
        <History games={games} stats={stats} error={error} />
      </section>
    </main>
  );
}
