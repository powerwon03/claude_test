"use server";

import { revalidatePath } from "next/cache";
import { getSupabase } from "@/lib/supabase";
import { isChoice, judge } from "@/lib/game";

export type SaveResult = { ok: true } | { ok: false; error: string };

export async function saveGame(input: {
  nickname: string;
  player: string;
  computer: string;
}): Promise<SaveResult> {
  const nickname = input.nickname.trim();
  if (!nickname) return { ok: false, error: "닉네임을 입력해 주세요." };
  if (nickname.length > 20) return { ok: false, error: "닉네임은 20자 이내로 입력해 주세요." };
  if (!isChoice(input.player) || !isChoice(input.computer)) {
    return { ok: false, error: "잘못된 선택입니다." };
  }

  const supabase = getSupabase();
  if (!supabase) {
    return { ok: false, error: "Supabase 환경 변수가 없어 기록을 저장하지 않았습니다." };
  }

  // 승패는 클라이언트 값을 믿지 않고 서버에서 다시 계산합니다.
  const result = judge(input.player, input.computer);

  const { error } = await supabase.from("games").insert({
    nickname,
    player_choice: input.player,
    computer_choice: input.computer,
    result,
  });
  if (error) return { ok: false, error: `저장 실패: ${error.message}` };

  revalidatePath("/"); // 메인 페이지의 기록/통계를 새로 불러오게 함
  return { ok: true };
}
