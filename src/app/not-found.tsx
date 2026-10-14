import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ maxWidth: 480, margin: "6rem auto", padding: "0 16px", textAlign: "center" }}>
      <h1>Page not found</h1>
      <p className="muted">That page doesn&apos;t exist or has moved.</p>
      <Link className="btn primary" href="/">Back to LeadFinder</Link>
    </main>
  );
}
