-- The Gift Architects — initial schema (run in your Supabase SQL editor)
create extension if not exists "pgcrypto";

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  recipient_name text not null,
  relationship text,
  occasion text,
  personality_tags text[] default '{}',
  inside_joke text,
  spotify_url text,
  card_message text,
  tier_selected text not null,
  add_ons text[] default '{}',
  total_amount integer not null default 0,
  payment_status text not null default 'pending',
  fulfilment_status text not null default 'received',
  shipping_address jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  uuid_slug uuid not null unique default gen_random_uuid(),
  recipient_name text not null,
  sender_name text,
  letter_text text,
  spotify_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.memory_photos (
  id uuid primary key default gen_random_uuid(),
  memory_id uuid references public.memories(id) on delete cascade,
  photo_url text not null,
  created_at timestamptz not null default now()
);

grant select, insert on public.orders to anon, authenticated;
grant select, insert on public.memories to anon, authenticated;
grant select, insert on public.memory_photos to anon, authenticated;
grant all on public.orders, public.memories, public.memory_photos to service_role;

alter table public.orders enable row level security;
alter table public.memories enable row level security;
alter table public.memory_photos enable row level security;

create policy "anyone can create an order" on public.orders for insert to anon, authenticated with check (true);
create policy "orders readable" on public.orders for select to anon, authenticated using (true);
create policy "anyone can create a memory" on public.memories for insert to anon, authenticated with check (true);
create policy "memories readable by uuid slug" on public.memories for select to anon, authenticated using (true);
create policy "anyone can attach photos" on public.memory_photos for insert to anon, authenticated with check (true);
create policy "memory photos readable" on public.memory_photos for select to anon, authenticated using (true);

insert into storage.buckets (id, name, public)
values ('gift-memories', 'gift-memories', true)
on conflict (id) do nothing;

create policy "public read gift memories"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'gift-memories');

create policy "checkout uploads to gift memories"
  on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'gift-memories');
