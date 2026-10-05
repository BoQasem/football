import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center bg-gray-50 px-6 py-24">
      <div className="max-w-md text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
          404
        </p>

        <h1 className="mt-3 text-3xl font-bold text-gray-900">
          Page not found
        </h1>

        <p className="mt-3 text-gray-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
