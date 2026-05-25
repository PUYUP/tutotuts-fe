"use client";
import { useState } from "react";
import CategorySelect from "./CategorySelect";
import markdownIt from "markdown-it";

export default function PostForm() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [url, setUrl] = useState("");
  const [categoryPath, setCategoryPath] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);

  const generateSlug = (t: string) =>
    t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setSlug(generateSlug(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", title);
    form.append("slug", slug);
    form.append("url", url);
    form.append("categoryPath", JSON.stringify(categoryPath));
    form.append("content", content);
    if (beforeImage) form.append("beforeImage", beforeImage);
    if (afterImage) form.append("afterImage", afterImage);

    const res = await fetch("/api/posts", { method: "POST", body: form });
    if (res.ok) alert("Post created!");
    else alert("Error creating post");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div>
        <label className="block font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="w-full rounded border p-2"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Slug (auto‑generated)</label>
        <input
          type="text"
          value={slug}
          readOnly
          className="w-full rounded border p-2 bg-gray-100"
        />
      </div>

      <CategorySelect onChange={setCategoryPath} />

      <div>
        <label className="block font-medium">Custom URL (optional)</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full rounded border p-2"
        />
      </div>

      <div>
        <label className="block font-medium">Before Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setBeforeImage(e.target.files?.[0] ?? null)}
        />
      </div>

      <div>
        <label className="block font-medium">After Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAfterImage(e.target.files?.[0] ?? null)}
        />
      </div>

      <div>
        <label className="block font-medium">Content (Markdown)</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className="w-full rounded border p-2 font-mono"
        />
        <div className="mt-2 p-2 bg-gray-50 rounded">
          <h4 className="font-medium">Preview</h4>
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: markdownIt().render(content) }}
          />
        </div>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Publish
      </button>
    </form>
  );
}
