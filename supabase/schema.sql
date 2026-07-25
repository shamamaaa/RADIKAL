-- RADIKAL birthday site — Supabase schema
-- Run this once in the Supabase SQL editor for your project.

-- 1. Global celebration counter -------------------------------------------

create table if not exists celebrations (
  id smallint primary key default 1,
  count bigint not null default 0,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into celebrations (id, count)
values (1, 0)
on conflict (id) do nothing;

alter table celebrations enable row level security;

create policy "Anyone can read the celebration count"
  on celebrations for select
  to anon
  using (true);

create or replace function increment_celebration_count()
returns bigint
language sql
security definer
set search_path = public
as $$
  update celebrations
  set count = count + 1, updated_at = now()
  where id = 1
  returning count;
$$;

grant execute on function increment_celebration_count() to anon;

-- enable realtime updates for the counter row
alter publication supabase_realtime add table celebrations;

-- 2. Game leaderboards ------------------------------------------------------

create table if not exists scores (
  id uuid primary key default gen_random_uuid(),
  game_id text not null,
  player_name text not null check (char_length(player_name) between 2 and 25),
  score integer not null check (score >= 0 and score <= 1000000),
  created_at timestamptz not null default now(),
  unique (game_id, player_name)
);

create index if not exists scores_game_id_score_idx
  on scores (game_id, score desc);

alter table scores enable row level security;

create policy "Anyone can read scores"
  on scores for select
  to anon
  using (true);

-- Writes only happen through submit_score() below, which keeps each
-- player's best score per game instead of piling up a new row every play.
create or replace function submit_score(
  p_game_id text,
  p_player_name text,
  p_score integer
)
returns void
language sql
security definer
set search_path = public
as $$
  insert into scores (game_id, player_name, score)
  values (p_game_id, p_player_name, p_score)
  on conflict (game_id, player_name)
  do update set
    score = greatest(scores.score, excluded.score),
    created_at = case
      when excluded.score > scores.score then now()
      else scores.created_at
    end;
$$;

grant execute on function submit_score(text, text, integer) to anon;

-- 3. Fan letters --------------------------------------------------------

create table if not exists letters (
  id uuid primary key default gen_random_uuid(),
  member_id text not null check (member_id in ('vedat', 'yusa', 'ibrahim', 'yusufemre')),
  sender_name text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists letters_member_id_created_at_idx
  on letters (member_id, created_at desc);

alter table letters enable row level security;

create policy "Anyone can read letters"
  on letters for select
  to anon
  using (true);

create policy "Anyone can submit a letter"
  on letters for insert
  to anon
  with check (
    char_length(sender_name) between 2 and 25
    and char_length(message) between 1 and 5000
  );
