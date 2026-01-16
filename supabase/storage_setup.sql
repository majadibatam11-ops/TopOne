-- Add document columns to employees table
alter table public.employees 
add column if not exists doc_id_copy text,
add column if not exists doc_proof_account text,
add column if not exists doc_sars text,
add column if not exists doc_contract text,
add column if not exists doc_supporting_docs text[];

-- Create storage bucket for employee documents
insert into storage.buckets (id, name, public)
values ('employee-docs', 'employee-docs', true)
on conflict (id) do nothing;

-- Set up storage policies
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'employee-docs' );

create policy "Authenticated Upload"
  on storage.objects for insert
  with check ( bucket_id = 'employee-docs' );
