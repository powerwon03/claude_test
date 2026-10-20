import type { Choice, Result } from "./game";

// Supabase games 테이블 한 줄
export type GameRow = {
  id: string;
  nickname: string;
  player_choice: Choice;
  computer_choice: Choice;
  result: Result;
  created_at: string;
};

export type Stats = { total: number; win: number; lose: number; draw: number };
