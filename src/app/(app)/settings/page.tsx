import { requireUser } from "@/lib/session.ts";

export default async function Settings() {
  const user = await requireUser();
  return (
    <>
      <h1>Settings</h1>
      <div className="card">
        <p><span className="muted">Name</span><br />{user.name}</p>
        <p><span className="muted">Email</span><br />{user.email}</p>
        <p style={{ marginBottom: 0 }}><span className="muted">Role</span><br />{user.role}</p>
      </div>
    </>
  );
}
