import { NextResponse, type NextRequest } from "next/server";

/**
 * Optional access key for a public deploy. When CARFLIP_ACCESS_KEY is set, every page and API call needs it:
 * open the app once with ?key=… (stored in a cookie), or send it as "Authorization: Bearer …" from scripts.
 */
export function middleware(req: NextRequest) {
  const key = process.env.CARFLIP_ACCESS_KEY;
  if (!key) return NextResponse.next();
  const given = req.nextUrl.searchParams.get("key");
  if (given === key) {
    const url = req.nextUrl.clone();
    url.searchParams.delete("key");
    const res = NextResponse.redirect(url);
    res.cookies.set("cf_key", key, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 90 });
    return res;
  }
  if (req.cookies.get("cf_key")?.value === key || req.headers.get("authorization") === `Bearer ${key}`) return NextResponse.next();
  return new NextResponse("CarFlip is private. Open it with ?key=<access key>.", { status: 401 });
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|api/health).*)"] };
