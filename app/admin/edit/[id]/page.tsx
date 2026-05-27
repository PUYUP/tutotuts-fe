import Link from "next/link";
import dynamic from "next/dynamic";
import Button from "@mui/material/Button";

const PostForm = dynamic(() => import("../../../components/PostForm"), {
  ssr: true,
  loading: () => (
    <div className="animate-pulse space-y-4 mt-4">
      <div className="h-10 bg-gray-200 rounded w-full" />
      <div className="h-10 bg-gray-200 rounded w-full" />
      <div className="h-10 bg-gray-200 rounded w-full" />
      <div className="h-32 bg-gray-200 rounded w-full" />
    </div>
  ),
});

interface Props {
  params: Promise<{ id?: string }>;
}

async function getPost(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts?id=${id}`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function CreatePage({ params }: Props) {
  const { id } = await params;
  const post = id ? await getPost(id) : null;
  const isEditing = !!post;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold mb-6">
          {isEditing ? "Edit Post" : "Create New Post"}
        </h1>
        <div className="mt-2 flex gap-6">
          <Link href="/">
            <Button variant="text" size="small">Back to Home</Button>
          </Link>
          <Link href="/admin/archive">
            <Button variant="text" size="small">Archives</Button>
          </Link>
        </div>
      </div>

      <PostForm initialData={post} />
    </main>
  );
}