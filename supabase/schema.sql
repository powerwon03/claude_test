-- Supabase SQL Editor 에서 실행하세요.

create extension if not exists "pgcrypto";

create table if not exists public.contacts (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text not null,
  email       text,
  memo        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists contacts_name_idx on public.contacts (name);
create index if not exists contacts_phone_idx on public.contacts (phone);

-- updated_at 자동 갱신
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists contacts_set_updated_at on public.contacts;
create trigger contacts_set_updated_at
  before update on public.contacts
  for each row execute function public.set_updated_at();

-- RLS: anon 키로 읽기/쓰기 허용 (개인용 단순 구성)
alter table public.contacts enable row level security;

drop policy if exists "contacts_select" on public.contacts;
drop policy if exists "contacts_insert" on public.contacts;
drop policy if exists "contacts_update" on public.contacts;
drop policy if exists "contacts_delete" on public.contacts;

create policy "contacts_select" on public.contacts for select using (true);
create policy "contacts_insert" on public.contacts for insert with check (true);
create policy "contacts_update" on public.contacts for update using (true) with check (true);
create policy "contacts_delete" on public.contacts for delete using (true);
