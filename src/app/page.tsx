import Link from "next/link";
import { packs } from "@/lib/stripe.ts";
import { CREDIT_PRICES } from "@/lib/credits.ts";

const steps = [
  ["Tell us your business", "Your website and one sentence on what you sell."],
  ["Get your ICP", "We read your site and write who should buy from you — with free match counts."],
  ["We find the people", "Matching companies and a decision maker at each."],
  ["The waterfall verifies them", "Cheapest email provider first, pay only on a hit, every inbox verified."],
];

export const dynamic = "force-dynamic";

export default function Landing() {
  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "3rem 16px" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4rem" }}>
        <strong>LeadFinder</strong>
        <div style={{ display: "flex", gap: ".5rem" }}>
          <Link className="btn" href="/login">Log in</Link>
          <Link className="btn primary" href="/signup">Start free</Link>
        </div>
      </nav>
      <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", maxWidth: 720 }}>Verified decision makers from one sentence and your website.</h1>
      <p className="muted" style={{ fontSize: "1.15rem", maxWidth: 620 }}>
        LeadFinder works out who should buy from you, finds those companies and the right person at each, and gets every
        one a verified work email — for about a cent of data per lead, with a receipt for every call.
      </p>
      <p><Link className="btn primary" href="/signup">Start free — 50 credits</Link></p>
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "3rem" }}>
        {steps.map(([title, body], i) => (
          <div className="card" key={title}>
            <div className="muted">{i + 1}</div>
            <h3>{title}</h3>
            <p className="muted" style={{ margin: 0 }}>{body}</p>
          </div>
        ))}
      </section>
      <section style={{ marginTop: "4rem" }}>
        <h2>Pay for results, not seats</h2>
        <p className="muted" style={{ maxWidth: 620 }}>
          Every account starts with 50 free credits. A person found costs {CREDIT_PRICES.person}, a verified email{" "}
          {CREDIT_PRICES.verifiedEmail} (catch-all or risky {CREDIT_PRICES.unconfirmedEmail}), a mobile {CREDIT_PRICES.mobile}. Misses and invalid
          emails are free, and every run shows its maximum price before it starts.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
          {packs().map((p) => (
            <div className="card" key={p.id}>
              <div className="muted">{p.label ?? p.id}</div>
              <h3 style={{ margin: ".2rem 0" }}>{p.credits.toLocaleString("en-US")} credits</h3>
              <div>${(p.cents / 100).toFixed(0)}</div>
              <div className="muted" style={{ fontSize: ".85rem" }}>about {Math.floor(p.credits / (CREDIT_PRICES.person + CREDIT_PRICES.verifiedEmail)).toLocaleString("en-US")} verified leads</div>
            </div>
          ))}
        </div>
      </section>
      <footer className="muted" style={{ marginTop: "4rem", fontSize: ".85rem" }}>
        LeadFinder is for B2B outreach. Respect opt-outs and the rules where your prospects are.
      </footer>
    </main>
  );
}
