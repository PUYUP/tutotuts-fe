"use client";

import { useEffect, useMemo, useState } from "react";

interface CategoryNode {
  id: string;
  name: string;
  children?: CategoryNode[];
}

interface Props {
  onChange: (path: string[], categoryId: string) => void;
  selectedId?: string;
}

export default function CategorySelect({ onChange, selectedId }: Props) {
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // ✅ Memoize so the array reference is stable between renders
  const options = useMemo(() => {
    const flatten = (
      nodes: CategoryNode[],
      prefix: string[] = []
    ): { id: string; label: string; path: string[] }[] => {
      return nodes.flatMap((node) => {
        const currentPath = [...prefix, node.name];
        return node.children
          ? [
            { id: node.id, label: currentPath.join(" / "), path: currentPath },
            ...flatten(node.children, currentPath),
          ]
          : [{ id: node.id, label: currentPath.join(" / "), path: currentPath }];
      });
    };
    return flatten(categories);
  }, [categories]); // ✅ Only recomputes when categories actually changes

  // ✅ Now safe: effect only re-runs when selectedId or options reference changes
  useEffect(() => {
    if (selectedId) {
      const opt = options.find((o) => o.id === selectedId);
      if (opt) {
        setSelectedPath(opt.path);
      }
    }
  }, [selectedId, options]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const opt = options.find((o) => o.id === id);
    if (opt) {
      setSelectedPath(opt.path);
      onChange(opt.path, id);
    }
  };

  return (
    <div>
      <label className="block font-medium mb-1">Category</label>
      <select
        className="w-full rounded border p-2"
        onChange={handleSelect}
        value={selectedId ?? ""}
      >
        <option value="" disabled>
          Select a category
        </option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}