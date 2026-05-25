"use client";
import { useEffect, useState } from "react";

interface CategoryNode {
  id: string;
  name: string;
  children?: CategoryNode[];
}

interface Props {
  onChange: (path: string[]) => void;
}

export default function CategorySelect({ onChange }: Props) {
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // flatten tree for a simple <select>
  const flatten = (nodes: CategoryNode[], prefix: string[] = []): { id: string; label: string; path: string[] }[] => {
    return nodes.flatMap((node) => {
      const currentPath = [...prefix, node.id];
      const entry = { id: node.id, label: prefix.concat(node.name).join(" / "), path: currentPath };
      return node.children ? [entry, ...flatten(node.children, currentPath)] : [entry];
    });
  };

  const options = flatten(categories);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const opt = options.find((o) => o.id === id);
    if (opt) {
      setSelectedPath(opt.path);
      onChange(opt.path);
    }
  };

  return (
    <div>
      <label className="block font-medium mb-1">Category</label>
      <select className="w-full rounded border p-2" onChange={handleSelect} defaultValue="">
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
