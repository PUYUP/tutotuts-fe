import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BUCKET = 'tutorials';

const saveImage = async (file: File | null, prefix: string): Promise<string> => {
  if (!file) return '';
  const ext = file.name.split('.').pop();
  const fileName = `${prefix}-${crypto.randomUUID()}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, buffer, { contentType: file.type, upsert: false });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  return data.publicUrl;
};

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const title = form.get('title') as string;
  const slug = form.get('slug') as string;
  const sourceId = form.get('sourceId') as string;
  const sourceUrl = form.get('sourceUrl') as string;
  const content = form.get('content') as string;
  const categoryId = form.get('categoryId') as string | null;
  const thumbnailFile = form.get('thumbnail') as File | null;
  const beforeFile = form.get('imageBefore') as File | null;
  const afterFile = form.get('imageAfter') as File | null;

  const [thumbnail, imageBefore, imageAfter] = await Promise.all([
    saveImage(thumbnailFile, 'thumbnail'),
    saveImage(beforeFile, 'before'),
    saveImage(afterFile, 'after'),
  ]);

  // Insert tutorial
  const { data: tutorial, error: tutorialError } = await supabase
    .from('tutorials')
    .insert({
      title,
      slug,
      source_id: sourceId,
      source_url: sourceUrl,
      content,
      thumbnail_url: thumbnail || null,
      image_before_url: imageBefore || null,
      image_after_url: imageAfter || null,
      is_published: true,
    })
    .select()
    .single();

  if (tutorialError) {
    return NextResponse.json({ error: tutorialError.message }, { status: 500 });
  }

  // Insert category relation if categoryId provided
  if (categoryId) {
    const { error: categoryError } = await supabase
      .from('tutorial_categories')
      .insert({
        tutorial_id: tutorial.id,
        category_id: categoryId,
      });

    if (categoryError) {
      return NextResponse.json({ error: categoryError.message }, { status: 500 });
    }
  }

  return NextResponse.json(tutorial, { status: 201 });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const slug = url.searchParams.get('slug');
  const id = url.searchParams.get('id');
  const from = url.searchParams.get('from') ?? 0;
  const to = url.searchParams.get('to') ?? 25;
  const categoryId = url.searchParams.get('categoryId');

  if (!slug && !id) {
    let qs = supabase
      .from('tutorials')
      .select(
        categoryId
          ? '*, tutorial_categories!inner(category_id, categories(id, name))'
          : '*, tutorial_categories(category_id, categories(id, name))'
      )
      .order('created_at', { ascending: false })
      .range(Number(from), Number(to));

    if (categoryId) {
      qs = qs.eq('tutorial_categories.category_id', categoryId);
    }

    const { data, error } = await qs;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  let query = supabase
    .from('tutorials')
    .select('*, tutorial_categories(category_id, categories(id, name))');

  // Query berdasarkan slug ATAU id
  if (slug) {
    query = query.eq('slug', slug);
  } else if (id) {
    query = query.eq('id', id);
  }

  const { data, error } = await query.single();

  if (error) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}