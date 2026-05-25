import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const title = form.get('title') as string;
  const slug = form.get('slug') as string;
  const url = form.get('url') as string;
  const categoryPath = JSON.parse(form.get('categoryPath') as string) as string[];
  const content = form.get('content') as string;
  const beforeFile = form.get('beforeImage') as File;
  const afterFile = form.get('afterImage') as File;

  const saveImage = async (file: File | null, prefix: string) => {
    if (!file) return '';
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = file.name.split('.').pop();
    const fileName = `${prefix}-${uuidv4()}.${ext}`;
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', fileName);
    await fs.promises.mkdir(path.dirname(uploadPath), { recursive: true });
    await fs.promises.writeFile(uploadPath, buffer);
    return `/uploads/${fileName}`;
  };

  const beforeImage = await saveImage(beforeFile, 'before');
  const afterImage = await saveImage(afterFile, 'after');

  const post = {
    title,
    slug,
    url,
    categoryPath,
    beforeImage,
    afterImage,
    content,
    createdAt: new Date().toISOString(),
  };

  const postsDir = path.join(process.cwd(), 'app', 'posts');
  await fs.promises.mkdir(postsDir, { recursive: true });
  const filePath = path.join(postsDir, `${slug}.json`);
  await fs.promises.writeFile(filePath, JSON.stringify(post, null, 2));

  return NextResponse.json(post, { status: 201 });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const slug = url.searchParams.get('slug');
  if (!slug) return NextResponse.json([], { status: 200 });
  const filePath = path.join(process.cwd(), 'app', 'posts', `${slug}.json`);
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (e) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
