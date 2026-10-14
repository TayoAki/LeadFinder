// A headline number: the value in primary ink, the label muted. No colour carries meaning here.
export default function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card" style={{ padding: "1rem" }}>
      <div className="muted" style={{ fontSize: ".85rem" }}>{label}</div>
      <div style={{ fontSize: "1.6rem", fontWeight: 600, lineHeight: 1.3 }}>{value}</div>
      {sub && <div className="muted" style={{ fontSize: ".8rem" }}>{sub}</div>}
    </div>
  );
}
