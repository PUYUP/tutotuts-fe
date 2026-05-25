"use client";

import { useEffect, useState, useCallback } from "react";

interface CategoryNode {
  id: string;
  name: string;
  children?: CategoryNode[];
}

// ---------- helpers ----------
function flattenWithDepth(
  nodes: CategoryNode[],
  depth = 0
): { node: CategoryNode; depth: number }[] {
  return nodes.flatMap((n) => [
    { node: n, depth },
    ...flattenWithDepth(n.children ?? [], depth + 1),
  ]);
}

// ---------- components ----------

function CategoryRow({
  node,
  depth,
  allNodes,
  onAdded,
  onRenamed,
  onDeleted,
}: {
  node: CategoryNode;
  depth: number;
  allNodes: CategoryNode[];
  onAdded: () => void;
  onRenamed: () => void;
  onDeleted: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(node.name);
  const [adding, setAdding] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRename = async () => {
    if (!editName.trim()) return;
    setLoading(true);
    await fetch("/api/categories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: node.id, name: editName }),
    });
    setLoading(false);
    setEditing(false);
    onRenamed();
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${node.name}" and all its children?`)) return;
    setLoading(true);
    await fetch("/api/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: node.id }),
    });
    setLoading(false);
    onDeleted();
  };

  const handleAddChild = async () => {
    if (!newChildName.trim()) return;
    setLoading(true);
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newChildName, parentId: node.id }),
    });
    setLoading(false);
    setAdding(false);
    setNewChildName("");
    onAdded();
  };

  return (
    <div
      className="group flex flex-col border-b border-gray-100 last:border-0"
      style={{ paddingLeft: `${depth * 1.5}rem` }}
    >
      <div className="flex items-center gap-2 py-2 pr-3">
        {/* tree connector */}
        {depth > 0 && (
          <span className="text-gray-300 select-none">{"└─"}</span>
        )}

        {editing ? (
          <>
            <input
              autoFocus
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              className="flex-1 rounded border border-indigo-400 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              onClick={handleRename}
              disabled={loading}
              className="rounded bg-indigo-600 px-2 py-1 text-xs text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={() => { setEditing(false); setEditName(node.name); }}
              className="rounded border px-2 py-1 text-xs hover:bg-gray-100"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <span className="flex-1 text-sm font-medium text-gray-800">
              {node.name}
            </span>
            <span className="ml-2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
              id: {node.id.slice(0, 8)}…
            </span>
            <button
              title="Add child"
              onClick={() => setAdding((v) => !v)}
              className="rounded p-1 text-xs text-indigo-600 hover:bg-indigo-50"
            >
              + Child
            </button>
            <button
              title="Rename"
              onClick={() => setEditing(true)}
              className="rounded p-1 text-xs text-gray-500 hover:bg-gray-100"
            >
              ✏️
            </button>
            <button
              title="Delete"
              onClick={handleDelete}
              disabled={loading}
              className="rounded p-1 text-xs text-red-500 hover:bg-red-50 disabled:opacity-50"
            >
              🗑️
            </button>
          </>
        )}
      </div>

      {/* add-child inline form */}
      {adding && (
        <div
          className="flex items-center gap-2 pb-2"
          style={{ paddingLeft: "1.5rem" }}
        >
          <input
            autoFocus
            placeholder="New child name…"
            value={newChildName}
            onChange={(e) => setNewChildName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddChild()}
            className="flex-1 rounded border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button
            onClick={handleAddChild}
            disabled={loading || !newChildName.trim()}
            className="rounded bg-indigo-600 px-3 py-1 text-xs text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            Add
          </button>
          <button
            onClick={() => setAdding(false)}
            className="rounded border px-2 py-1 text-xs hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- page ----------

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRootName, setNewRootName] = useState("");
  const [addingRoot, setAddingRoot] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/categories");
    setCategories(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAddRoot = async () => {
    if (!newRootName.trim()) return;
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newRootName }),
    });
    setNewRootName("");
    setAddingRoot(false);
    load();
  };

  const flat = flattenWithDepth(categories);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-sm text-gray-500 mt-1">
              Unlimited depth tree — add, rename, delete
            </p>
          </div>
          <button
            onClick={() => setAddingRoot((v) => !v)}
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 transition-colors"
          >
            + New Root
          </button>
        </div>

        {/* add root form */}
        {addingRoot && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-indigo-200 bg-white p-3 shadow-sm">
            <input
              autoFocus
              placeholder="Root category name…"
              value={newRootName}
              onChange={(e) => setNewRootName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddRoot()}
              className="flex-1 rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              onClick={handleAddRoot}
              disabled={!newRootName.trim()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              Add
            </button>
            <button
              onClick={() => setAddingRoot(false)}
              className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        )}

        {/* category tree */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading…</div>
          ) : flat.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              No categories yet. Click <strong>+ New Root</strong> to get started.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {flat.map(({ node, depth }) => (
                <CategoryRow
                  key={node.id}
                  node={node}
                  depth={depth}
                  allNodes={categories}
                  onAdded={load}
                  onRenamed={load}
                  onDeleted={load}
                />
              ))}
            </div>
          )}
        </div>

        {/* stats */}
        {!loading && flat.length > 0 && (
          <p className="mt-4 text-xs text-center text-gray-400">
            {flat.length} categor{flat.length === 1 ? "y" : "ies"} total
          </p>
        )}
      </div>
    </main>
  );
}
