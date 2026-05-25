import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

export interface CategoryRow {
  id: string;
  name: string;
  parent_id: string | null;
}

export interface CategoryNode {
  id: string;
  name: string;
  children: CategoryNode[];
}

/** Ubah flat rows → nested tree */
function buildTree(rows: CategoryRow[], parentId: string | null = null): CategoryNode[] {
  return rows
    .filter((r) => r.parent_id === parentId)
    .map((r) => ({
      id: r.id,
      name: r.name,
      children: buildTree(rows, r.id),
    }));
}

export async function GET() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, parent_id')
    .order('name');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(buildTree(data as CategoryRow[]));
}

export async function POST(req: NextRequest) {
  const { name, parent_id, slug } = await req.json();

  const { data, error } = await supabase
    .from('categories')
    .insert({ name, parent_id: parent_id ?? null, slug })
    .select('id, name, parent_id')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { id, name } = await req.json();

  const { error } = await supabase
    .from('categories')
    .update({ name })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  // cascade delete anak-anaknya otomatis via FK on delete cascade
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}