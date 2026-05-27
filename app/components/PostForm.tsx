"use client";
import { useState } from "react";
import CategorySelect from "./CategorySelect";
import markdownIt from "markdown-it";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import styled from "@emotion/styled";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Snackbar } from "@mui/material";

const SOURCE_OPTIONS = [
  { id: "facebook", label: "Facebook" },
  { id: "youtube", label: "YouTube" },
];

interface Props {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    source_id: string;
    source_url: string;
    content: string;
    category_id?: string;
    thumbnail_url?: string;
    image_before_url?: string;
    image_after_url?: string;
  } | null;
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

type ImageField = {
  file: File | null;
  preview: string | null;
};

function useImageField(): [ImageField, (e: React.ChangeEvent<HTMLInputElement>) => void, () => void] {
  const [state, setState] = useState<ImageField>({ file: null, preview: null });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setState({
      file,
      preview: file ? URL.createObjectURL(file) : null,
    });
  };

  const handleRemove = () => setState({ file: null, preview: null });

  return [state, handleChange, handleRemove];
}

function ImageUpload({
  label,
  field,
  onChange,
  onRemove,
  disabled,
}: {
  label: string;
  field: ImageField;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        disabled={disabled}
      >
        Upload image
        <VisuallyHiddenInput type="file" accept="image/*" onChange={onChange} />
      </Button>
      {field.preview && (
        <div className="mt-2 relative w-1/3 aspect-video rounded overflow-hidden border">
          <img
            src={field.preview}
            alt={`${label} preview`}
            className="w-full h-full object-cover"
          />
          {!disabled && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded hover:bg-black/80"
            >
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function PostForm({ initialData }: Props) {
  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [sourceId, setSourceId] = useState(initialData?.source_id ?? "");
  const [sourceUrl, setSourceUrl] = useState(initialData?.source_url ?? "");
  const [categoryPath, setCategoryPath] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [thumbnail, onThumbnailChange, onThumbnailRemove] = useImageField();
  const [imageBefore, onBeforeChange, onBeforeRemove] = useImageField();
  const [imageAfter, onAfterChange, onAfterRemove] = useImageField();

  const generateSlug = (t: string) =>
    t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setSlug(generateSlug(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = isEditing ? `/api/posts?id=${initialData.id}` : "/api/posts";
    const method = isEditing ? "PUT" : "POST";

    try {
      const form = new FormData();
      form.append("title", title);
      form.append("slug", slug);
      form.append("sourceId", sourceId);
      form.append("sourceUrl", sourceUrl);
      form.append("categoryPath", JSON.stringify(categoryPath));
      form.append("categoryId", categoryId || "");
      form.append("content", content);
      if (thumbnail.file) form.append("thumbnail", thumbnail.file);
      if (imageBefore.file) form.append("imageBefore", imageBefore.file);
      if (imageAfter.file) form.append("imageAfter", imageAfter.file);

      const res = await fetch(url, { method, body: form });
      const json = await res.json();
      console.log("Response:", res.status, json);

      if (res.ok) {
        setOpen(true);
        setTitle("");
        setSlug("");
        setSourceId("");
        setSourceUrl("");
        setCategoryPath([]);
        setCategoryId(null);
        setContent("");
        onThumbnailRemove();
        onBeforeRemove();
        onAfterRemove();
      } else {
        alert(`Error: ${json.error ?? res.statusText}`);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Unexpected error, check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }

  return (
    <>
      {/* Full-screen overlay saat loading */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
          <CircularProgress size={52} thickness={4} sx={{ color: "#fff" }} />
          <p className="mt-4 text-white text-sm font-medium tracking-wide">
            Uploading & saving…
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="w-full rounded border p-2 disabled:opacity-50"
            required
            disabled={loading}
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

        <div className="grid grid-cols-2 gap-3">
          <CategorySelect onChange={(path, id) => {
            setCategoryPath(path);
            setCategoryId(id);
          }} />

          <div>
            <label className="block font-medium mb-1">Source ID</label>
            <select
              className="w-full rounded border p-2 disabled:opacity-50"
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              required
              disabled={loading}
            >
              <option value="" disabled>
                Select a source
              </option>
              {SOURCE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-medium">Source URL</label>
          <input
            type="text"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            className="w-full rounded border p-2 disabled:opacity-50"
            disabled={loading}
          />
        </div>

        {/* <ImageUpload
          label="Thumbnail"
          field={thumbnail}
          onChange={onThumbnailChange}
          onRemove={onThumbnailRemove}
          disabled={loading}
        /> */}

        <div className="grid grid-cols-2 gap-3">
          <ImageUpload
            label="Image Before"
            field={imageBefore}
            onChange={onBeforeChange}
            onRemove={onBeforeRemove}
            disabled={loading}
          />

          <ImageUpload
            label="Image After"
            field={imageAfter}
            onChange={onAfterChange}
            onRemove={onAfterRemove}
            disabled={loading}
          />
        </div>

        <div>
          <label className="block font-medium">Content (Markdown)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full rounded border p-2 font-mono disabled:opacity-50"
            disabled={loading}
          />
          <div className="mt-2 p-2 bg-gray-50 rounded">
            <h4 className="font-medium">Preview</h4>
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: markdownIt().render(content) }}
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} thickness={4} sx={{ color: "inherit" }} /> : null}
          sx={{ px: 3, py: 1 }}
        >
          {loading ? "Publishing…" : "Publish"}
        </Button>
      </form>

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Post saved!"
        action={
          <Button variant="text" size="small" onClick={handleClose} sx={{ color: "#fff" }}>
            Close
          </Button>
        }
      />
    </>
  );
}