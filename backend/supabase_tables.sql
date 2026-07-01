

-- 1. USERS
create table users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password text not null,
  role text not null default 'student',
  created_at timestamptz default now()
);


-- 2. EVENTS
create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  date text not null,
  time text default '',
  venue text not null,
  category text not null,
  capacity int default 100,
  registered int default 0,
  image text,
  tags text[] default '{}',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz
);


-- 3. PROJECTS
create table projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  tech_stack text[] default '{}',
  github_url text,
  live_url text,
  category text not null,
  team_members text[] default '{}',
  status text default 'In Progress',
  featured boolean default false,
  image text,
  created_at timestamptz default now(),
  updated_at timestamptz
);


-- 4. TEAM MEMBERS
create table team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  department text default '',
  year text default '',
  bio text default '',
  linkedin text,
  github text,
  avatar text,
  "order" int default 0
);


-- 5. ANNOUNCEMENTS
create table announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  type text default 'general',
  is_pinned boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz
);


-- 6. REGISTRATIONS
create table registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  event_title text,
  name text not null,
  email text not null,
  phone text,
  roll_number text,
  branch text,
  year text,
  registered_at timestamptz default now()
);


-- 7. CONTACT MESSAGES
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text default 'General Inquiry',
  message text not null,
  is_read boolean default false,
  submitted_at timestamptz default now(),
  read_at timestamptz
);


-- 8. MENTOR ASSIGNMENTS
create table mentor_assignments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references users(id) on delete cascade,
  mentor_id uuid references users(id) on delete cascade,
  assigned_at timestamptz default now(),
  unique(student_id)
);


-- 9. TASKS
create table tasks (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid references users(id) on delete set null,
  title text not null,
  description text default '',
  assigned_to text default 'all',
  deadline text not null,
  domain text default 'General',
  status text default 'Pending',
  created_at timestamptz default now()
);


-- ============================================================
-- SEED: Default admin and mentor users
-- Replace the password hashes with bcrypt hashed values
-- ============================================================

insert into users (id, name, email, password, role) values
  ('00000000-0000-0000-0000-000000000001', 'SkillForge Admin', 'admin@skillforge.club', '$2a$10$REPLACE_WITH_BCRYPT_HASH', 'admin'),
  ('00000000-0000-0000-0000-000000000002', 'Mentor',           'mentor@gmail.com',       '$2a$10$REPLACE_WITH_BCRYPT_HASH', 'mentor');
