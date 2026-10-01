-- Production starting point for Quizreise Deutschland.
-- The mobile app never receives a service_role key. Run this in Supabase SQL editor.

create table if not exists public.questions (
  id text primary key,
  text_de text not null,
  options jsonb not null check (jsonb_array_length(options) = 4),
  correct_index integer not null check (correct_index between 0 and 3),
  category text not null,
  difficulty integer not null check (difficulty between 1 and 5),
  state_ids text[] default '{}',
  hint text not null,
  explanation text not null,
  source_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.player_progress (
  player_id uuid primary key references auth.users(id) on delete cascade,
  wallet integer not null default 0 check (wallet >= 0),
  unlocked_states text[] not null default array['HH'],
  completed_states text[] not null default '{}',
  category_best jsonb not null default '{}',
  final_rewards_claimed text[] not null default '{}',
  quick_quiz_high_score integer not null default 0,
  seen_question_ids text[] not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.questions enable row level security;
alter table public.player_progress enable row level security;

create policy "active questions are readable" on public.questions for select using (active = true);
create policy "players read own progress" on public.player_progress for select using (auth.uid() = player_id);
create policy "players update own non-economic preferences" on public.player_progress for update using (auth.uid() = player_id);

-- Call this RPC from a trusted server boundary after re-checking all conditions.
-- It is deliberately SECURITY DEFINER and locks the row to make wallet/state
-- updates atomic. Add an allow-list of implemented states before enabling it.
create or replace function public.purchase_state(p_state_id text)
returns public.player_progress
language plpgsql
security definer
set search_path = public
as $$
declare
  current_progress public.player_progress;
  has_completed_neighbor boolean;
begin
  select * into current_progress from public.player_progress where player_id = auth.uid() for update;
  if current_progress is null then raise exception 'Kein Spielerfortschritt gefunden'; end if;
  if p_state_id = any(current_progress.unlocked_states) then raise exception 'Bundesland bereits freigeschaltet'; end if;
  -- Replace this allow-list with a states table when additional content ships.
  if p_state_id not in ('NI', 'SH') then raise exception 'Bundesland im Prototyp nicht verfügbar'; end if;
  has_completed_neighbor := ('HH' = any(current_progress.completed_states));
  if not has_completed_neighbor then raise exception 'Kein abgeschlossenes Nachbar-Bundesland'; end if;
  if current_progress.wallet < 3500 then raise exception 'Nicht genug Quiz-Euro'; end if;
  update public.player_progress
    set wallet = wallet - 3500,
        unlocked_states = array_append(unlocked_states, p_state_id),
        updated_at = now()
    where player_id = auth.uid()
    returning * into current_progress;
  return current_progress;
end;
$$;

revoke all on function public.purchase_state(text) from public;
grant execute on function public.purchase_state(text) to authenticated;
