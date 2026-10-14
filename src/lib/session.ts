import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db.ts";
import { SESSION_COOKIE, SESSION_DAYS, createSession, userForSession, type User } from "./auth.ts";

export async function currentUser(): Promise<User | null> {
  const jar = await cookies();
  return userForSession(db(), jar.get(SESSION_COOKIE)?.value);
}

export async function requireUser(): Promise<User> {
  const user = await currentUser();
  if (!user) redirect("/login");
  return user;
}

export async function startSession(userId: number) {
  const { token, expires } = createSession(db(), userId);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
    maxAge: SESSION_DAYS * 86400,
  });
}

export async function requireAdmin(): Promise<User> {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/dashboard");
  return user;
}
