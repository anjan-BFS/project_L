-- Supabase schema for CareerCraft AI backend
-- Run this in the Supabase SQL editor for project gaizkpzuhemyixcvpxad.

create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email varchar not null unique,
  password_hash varchar not null,
  full_name varchar not null,
  created_at timestamp with time zone not null default now()
);

create table if not exists resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title varchar not null,
  content_json jsonb not null,
  ats_score integer,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table if not exists cover_letters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  job_title varchar not null,
  company_name varchar not null,
  content text not null,
  created_at timestamp with time zone not null default now()
);

-- Disable Row Level Security for backend-controlled tables
alter table users disable row level security;
alter table resumes disable row level security;
alter table cover_letters disable row level security;
