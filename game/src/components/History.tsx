import { CHOICE_INFO, RESULT_INFO } from "@/lib/game";
import type { GameRow, Stats } from "@/lib/types";

type Props = { games: GameRow[]; stats: Stats; error: string | null };

export function History({ games, stats, error }: Props) {
  if (error) {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950">
        기록을 불러오지 못했습니다: {error}
      </div>
    );
  }

  const winRate = stats.total ? Math.round((stats.win / stats.total) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2 text-center text-sm">
        <Box label="전체" value={stats.total} />
        <Box label="승" value={stats.win} />
        <Box label="패" value={stats.lose} />
        <Box label="승률" value={`${winRate}%`} />
      </div>

      {games.length === 0 ? (
        <p className="text-sm text-gray-500">아직 기록이 없습니다. 첫 게임을 해보세요!</p>
      ) : (
        <ul className="divide-y divide-gray-200 rounded-xl border border-gray-200 dark:divide-gray-700 dark:border-gray-700">
          {games.map((g) => (
            <li key={g.id} className="flex items-center justify-between px-4 py-2 text-sm">
              <span className="font-medium">{g.nickname}</span>
              <span className="text-lg">
                {CHOICE_INFO[g.player_choice].emoji} vs {CHOICE_INFO[g.computer_choice].emoji}
              </span>
              <span className={`w-14 text-right font-semibold ${RESULT_INFO[g.result].color}`}>
                {RESULT_INFO[g.result].label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Box({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}
