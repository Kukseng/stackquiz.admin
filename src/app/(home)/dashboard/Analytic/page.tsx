import Analytics from "@/components/Analytics/Analytics";

export default function Page() {
  return (
    <main className="min-h-screen ">
      <div className="max-w-screen mx-auto w-full">
        <Analytics searchParams={Promise.resolve({})} />
      </div>
    </main>
  );
}
