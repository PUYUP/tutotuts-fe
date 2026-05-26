import Link from "next/link";
import PostForm from "../../components/PostForm";
import Button from "@mui/material/Button";

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold mb-6">Create New Post</h1>
        <div className="mt-2 flex gap-6">
          <Link href={'/'}>
            <Button variant="text" size="small">
              Back to Home
            </Button>
          </Link>

          <Link href={'/admin/archive'}>
            <Button variant="text" size="small">
              Archives
            </Button>
          </Link>
        </div>
      </div>
      <PostForm />
    </main>
  );
}
