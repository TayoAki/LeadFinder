"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthForm({ mode }: { mode: "signup" | "login" }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: f.get("name"),
        email: f.get("email"),
        password: f.get("password"),
        acceptedTerms: f.get("terms") === "on",
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(data.error ?? "Something went wrong");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main style={{ maxWidth: 400, margin: "4rem auto", padding: "0 16px" }}>
      <Link href="/" className="muted" style={{ textDecoration: "none" }}>LeadFinder</Link>
      <form className="card" onSubmit={onSubmit} style={{ marginTop: "1rem" }}>
        <h2>{mode === "signup" ? "Create your account" : "Log in"}</h2>
        {mode === "signup" && (
          <label className="field">Name<input name="name" required autoComplete="name" /></label>
        )}
        <label className="field">Email<input name="email" type="email" required autoComplete="email" /></label>
        <label className="field">
          Password
          <input name="password" type="password" required minLength={8} autoComplete={mode === "signup" ? "new-password" : "current-password"} />
        </label>
        {mode === "signup" && (
          <label style={{ display: "flex", gap: ".5rem", marginBottom: ".9rem", fontSize: ".9rem" }}>
            <input type="checkbox" name="terms" required />
            I&apos;ll use LeadFinder for B2B outreach and respect opt-outs.
          </label>
        )}
        {error && <p className="error">{error}</p>}
        <button className="btn primary" disabled={busy} style={{ width: "100%", justifyContent: "center" }}>
          {busy ? "…" : mode === "signup" ? "Create account" : "Log in"}
        </button>
        <p className="muted" style={{ fontSize: ".9rem", marginBottom: 0 }}>
          {mode === "signup" ? <>Have an account? <Link href="/login">Log in</Link></> : <>New here? <Link href="/signup">Start free</Link></>}
        </p>
      </form>
    </main>
  );
}
