-- Supabase 대시보드 > SQL Editor 에 붙여넣고 Run 하세요.

create extension if not exists "pgcrypto";

create table if not exists public.games (
  id              uuid primary key default gen_random_uuid(),
  nickname        text not null check (char_length(nickname) between 1 and 20),
  player_choice   text not null check (player_choice in ('rock', 'paper', 'scissors')),
  computer_choice text not null check (computer_choice in ('rock', 'paper', 'scissors')),
  result          text not null check (result in ('win', 'lose', 'draw')),
  created_at      timestamptz not null default now()
);

create index if not exists games_created_at_idx on public.games (created_at desc);

-- RLS: anon 키로 읽기/추가만 허용 (수정/삭제는 불가)
alter table public.games enable row level security;

drop policy if exists "games_select" on public.games;
drop policy if exists "games_insert" on public.games;

create policy "games_select" on public.games for select using (true);
create policy "games_insert" on public.games for insert with check (true);
