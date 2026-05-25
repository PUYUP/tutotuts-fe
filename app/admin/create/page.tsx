import PostForm from "../../components/PostForm";

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <PostForm />
    </main>
  );
}
