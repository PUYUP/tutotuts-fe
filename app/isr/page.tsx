// /Volumes/SSD1/Private/tutotuts/app/isr/page.tsx
import Head from "next/head";

// ISR revalidation interval (seconds). Adjust as needed.
export const revalidate = 60; // default 60 seconds

export default async function ISRPage() {
  // Simulated data fetch – replace with real data fetching logic.
  const data = {
    message: "Hello from ISR!",
    timestamp: new Date().toISOString(),
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <Head>
        <title>ISR Sample</title>
      </Head>
      <h1 className="text-3xl font-bold mb-4">Incremental Static Regeneration Demo</h1>
      <pre className="bg-white p-4 rounded shadow-md max-w-2xl w-full overflow-x-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
      <p className="mt-4 text-sm text-gray-600">Page will re‑validate every {revalidate} seconds.</p>
    </div>
  );
}
