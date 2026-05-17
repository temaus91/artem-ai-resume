create extension if not exists pgcrypto;

create table if not exists chat_history (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists chat_history_session_created_idx
  on chat_history (session_id, created_at desc);
