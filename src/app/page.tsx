import Link from "next/link";

const steps = [
  ["Tell us your business", "Your website and one sentence on what you sell."],
  ["Get your ICP", "We read your site and write who should buy from you — with free match counts."],
  ["We find the people", "Matching companies and a decision maker at each."],
  ["The waterfall verifies them", "Cheapest email provider first, pay only on a hit, every inbox verified."],
];

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
    </main>
  );
}
