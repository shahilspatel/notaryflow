import 'server-only';

import { supabaseAdmin } from '@/lib/supabase/admin';

export async function logAuditEvent({
  userId,
  action,
  resourceType,
  resourceId,
  oldValues,
  newValues
}: {
  userId: string;
  action: 'created' | 'updated' | 'deleted';
  resourceType: 'invoice' | 'appointment' | 'client';
  resourceId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
}) {
  try {
    await supabaseAdmin
      .from('audit_logs')
      .insert({
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        old_values: oldValues || null,
        new_values: newValues || null
      });
  } catch (error) {
    console.error('Failed to log audit event:', error);
    // Don't throw – audit logging should never break the main flow
  }
}

// Note: You'll need to create an audit_logs table in Supabase:
/*
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  action text not null check (action in ('created', 'updated', 'deleted')),
  resource_type text not null check (resource_type in ('invoice', 'appointment', 'client')),
  resource_id uuid not null,
  old_values jsonb,
  new_values jsonb
);

create index if not exists audit_logs_user_id_created_at_idx on public.audit_logs (user_id, created_at);
create index if not exists audit_logs_resource_idx on public.audit_logs (resource_type, resource_id);

alter table public.audit_logs enable row level security;

create policy "Users can view their audit logs" on public.audit_logs
for select using (user_id = auth.uid());

create policy "Service role can insert audit logs" on public.audit_logs
for insert with check (true);
*/
