import Link from "next/link";

export default function Empty({ title, body, cta }: { title: string; body: string; cta?: [string, string] }) {
  return (
    <div className="card empty">
      <h2>{title}</h2>
      <p className="muted">{body}</p>
      {cta && <Link className="btn primary" href={cta[0]}>{cta[1]}</Link>}
    </div>
  );
}
