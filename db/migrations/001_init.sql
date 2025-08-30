-- Create subscriptions table
create table if not exists subscriptions (
  id serial primary key,
  tg_user_id bigint not null,
  plan text not null,
  status text not null default 'inactive',
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
