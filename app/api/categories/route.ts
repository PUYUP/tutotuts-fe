import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

export interface CategoryNode {
  id: string;
  name: string;
  children?: CategoryNode[];
}

const DATA_PATH = path.resolve(process.cwd(), 'app/data/categories.json');

function readCategories(): CategoryNode[] {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8')) as CategoryNode[];
  } catch {
    return [];
  }
}

function writeCategories(cats: CategoryNode[]) {
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(cats, null, 2));
}

function insertNode(list: CategoryNode[], parentId: string, newNode: CategoryNode): boolean {
  for (const node of list) {
    if (node.id === parentId) {
      node.children = node.children ?? [];
      node.children.push(newNode);
      return true;
    }
    if (node.children && insertNode(node.children, parentId, newNode)) return true;
  }
  return false;
}

function deleteNode(list: CategoryNode[], id: string): CategoryNode[] {
  return list
    .filter((n) => n.id !== id)
    .map((n) => ({ ...n, children: n.children ? deleteNode(n.children, id) : [] }));
}

function renameNode(list: CategoryNode[], id: string, name: string): boolean {
  for (const node of list) {
    if (node.id === id) { node.name = name; return true; }
    if (node.children && renameNode(node.children, id, name)) return true;
  }
  return false;
}

export async function GET() {
  return NextResponse.json(readCategories());
}

export async function POST(req: NextRequest) {
  const { name, parentId } = await req.json();
  const newNode: CategoryNode = { id: uuidv4(), name, children: [] };
  const cats = readCategories();
  if (parentId) insertNode(cats, parentId, newNode); else cats.push(newNode);
  writeCategories(cats);
  return NextResponse.json(newNode, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { id, name } = await req.json();
  const cats = readCategories();
  renameNode(cats, id, name);
  writeCategories(cats);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const cats = deleteNode(readCategories(), id);
  writeCategories(cats);
  return NextResponse.json({ ok: true });
}
