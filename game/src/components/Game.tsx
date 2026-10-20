"use client";

import { useState, useTransition } from "react";
import { saveGame } from "@/app/actions";
import {
  CHOICES,
  CHOICE_INFO,
  RESULT_INFO,
  judge,
  randomChoice,
  type Choice,
  type Result,
} from "@/lib/game";

type Round = { player: Choice; computer: Choice; result: Result };

export function Game({ canSave }: { canSave: boolean }) {
  const [nickname, setNickname] = useState("");
  const [round, setRound] = useState<Round | null>(null);
  const [score, setScore] = useState({ win: 0, lose: 0, draw: 0 });
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function play(player: Choice) {
    if (!nickname.trim()) {
      setMessage("먼저 닉네임을 입력해 주세요.");
      return;
    }
    const computer = randomChoice();
    const result = judge(player, computer);

    setRound({ player, computer, result });
    setScore((s) => ({ ...s, [result]: s[result] + 1 }));
    setMessage(null);

    if (!canSave) return;
    // 서버 액션으로 Supabase 에 저장 (저장이 끝나면 페이지의 기록 목록이 자동 갱신됨)
    startTransition(async () => {
      const res = await saveGame({ nickname, player, computer });
      if (!res.ok) setMessage(res.error);
    });
  }

  return (
    <div className="space-y-6">
      <label className="block">
        <span className="mb-1 block text-sm font-medium">닉네임</span>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={20}
          placeholder="예: 홍길동"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-900"
        />
      </label>

      <div>
        <p className="mb-2 text-sm font-medium">무엇을 낼까요?</p>
        <div className="grid grid-cols-3 gap-3">
          {CHOICES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => play(c)}
              disabled={isPending}
              className="rounded-xl border border-gray-300 bg-white py-5 text-center transition hover:-translate-y-0.5 hover:border-blue-500 hover:shadow disabled:opacity-50 dark:border-gray-600 dark:bg-gray-900"
            >
              <div className="text-4xl">{CHOICE_INFO[c].emoji}</div>
              <div className="mt-1 text-sm">{CHOICE_INFO[c].label}</div>
            </button>
          ))}
        </div>
      </div>

      {round && (
        <div className="rounded-xl bg-gray-100 p-5 text-center dark:bg-gray-800">
          <div className="flex items-center justify-center gap-6 text-5xl">
            <div>
              {CHOICE_INFO[round.player].emoji}
              <div className="mt-1 text-xs text-gray-500">나</div>
            </div>
            <span className="text-2xl text-gray-400">vs</span>
            <div>
              {CHOICE_INFO[round.computer].emoji}
              <div className="mt-1 text-xs text-gray-500">컴퓨터</div>
            </div>
          </div>
          <p className={`mt-4 text-2xl font-bold ${RESULT_INFO[round.result].color}`}>
            {RESULT_INFO[round.result].label}!
          </p>
        </div>
      )}

      <div className="flex justify-around rounded-xl border border-gray-200 p-4 text-center dark:border-gray-700">
        <Stat label="승" value={score.win} className="text-green-600" />
        <Stat label="패" value={score.lose} className="text-red-500" />
        <Stat label="무" value={score.draw} className="text-gray-500" />
      </div>

      {message && <p className="text-sm text-red-500">{message}</p>}
      {!canSave && (
        <p className="text-xs text-gray-500">
          Supabase 환경 변수가 없어 기록이 저장되지 않습니다. (게임은 정상 동작)
        </p>
      )}
    </div>
  );
}

function Stat({ label, value, className }: { label: string; value: number; className: string }) {
  return (
    <div>
      <div className={`text-3xl font-bold ${className}`}>{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}
