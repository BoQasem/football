"use client";

/**
 * Replaces the root layout when it fails, so it must render its own <html> and
 * <body>. Global styles are not loaded here, hence the inline styles.
 */
export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#f9fafb",
          color: "#111827",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <main
          style={{
            display: "flex",
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "28rem" }}>
            <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700 }}>
              Something went wrong
            </h1>

            <p style={{ marginTop: "0.75rem", color: "#4b5563" }}>
              The application failed to load. Please try again.
            </p>

            <button
              onClick={() => retry()}
              style={{
                marginTop: "2rem",
                padding: "0.75rem 1.5rem",
                border: "none",
                borderRadius: "9999px",
                background: "#111827",
                color: "#ffffff",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
