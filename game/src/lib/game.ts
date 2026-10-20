// 가위바위보 규칙만 모아 둔 파일입니다. 화면/DB 와 무관한 순수 로직입니다.

export const CHOICES = ["rock", "paper", "scissors"] as const;
export type Choice = (typeof CHOICES)[number];

export type Result = "win" | "lose" | "draw";

export const CHOICE_INFO: Record<Choice, { label: string; emoji: string }> = {
  rock: { label: "바위", emoji: "✊" },
  paper: { label: "보", emoji: "✋" },
  scissors: { label: "가위", emoji: "✌️" },
};

export const RESULT_INFO: Record<Result, { label: string; color: string }> = {
  win: { label: "승리", color: "text-green-600" },
  lose: { label: "패배", color: "text-red-500" },
  draw: { label: "무승부", color: "text-gray-500" },
};

// 각 선택이 이기는 상대
const BEATS: Record<Choice, Choice> = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper",
};

export function isChoice(value: unknown): value is Choice {
  return typeof value === "string" && (CHOICES as readonly string[]).includes(value);
}

export function randomChoice(): Choice {
  return CHOICES[Math.floor(Math.random() * CHOICES.length)];
}

export function judge(player: Choice, computer: Choice): Result {
  if (player === computer) return "draw";
  return BEATS[player] === computer ? "win" : "lose";
}
