create table public.employees (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  employee_no text not null,
  name text not null,
  surname text not null,
  id_number text not null,
  gender text not null,
  passport_no text,
  marital_status text not null,
  contact text not null,
  address text not null,
  employment_date date not null,
  bank_name text not null,
  account_no text not null,
  branch_code text not null,
  emergency_name text not null,
  emergency_surname text not null,
  emergency_relationship text not null,
  emergency_contact text not null,
  emergency_address text not null
);

-- Set up Row Level Security (RLS)
alter table public.employees enable row level security;

-- Create policies
create policy "Allow public read access"
  on public.employees for select
  using (true);

create policy "Allow public insert access"
  on public.employees for insert
  with check (true);

create policy "Allow public update access"
  on public.employees for update
  using (true);

create policy "Allow public delete access"
  on public.employees for delete
  using (true);
