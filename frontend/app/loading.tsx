export default function Loading() {
  return (
    <main className="flex-1 bg-gray-50 px-6 py-12">
      <div className="mx-auto w-full max-w-6xl animate-pulse">
        <div className="h-4 w-24 rounded bg-gray-200" />
        <div className="mt-4 h-9 w-64 rounded bg-gray-200" />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-200 bg-white p-6"
            >
              <div className="h-4 w-20 rounded bg-gray-200" />
              <div className="mt-4 h-6 w-3/4 rounded bg-gray-200" />
              <div className="mt-3 h-4 w-full rounded bg-gray-200" />
              <div className="mt-2 h-4 w-2/3 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
