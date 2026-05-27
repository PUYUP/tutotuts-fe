import ArchiveList from "@/app/components/ArchiveList";
import Link from "next/link";
import Button from "@mui/material/Button";

export default async function ArchivePage() {
    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <div className="flex justify-between">
                <h1 className="text-xl font-bold mb-6">Archives</h1>
                <div className="mt-2 flex gap-6">
                    <Link href={'/'}>
                        <Button variant="text" size="small">
                            Back to Home
                        </Button>
                    </Link>

                    <Link href={'/admin/create'}>
                        <Button variant="text" size="small">
                            Add New Post
                        </Button>
                    </Link>
                </div>
            </div>
            <ArchiveList />
        </main>
    );
}
