create table if not exists subscriptions (
  id serial primary key,
  tg_user_id text not null,
  plan text not null,
  status text not null,
  expires_at timestamptz not null default now()
);
