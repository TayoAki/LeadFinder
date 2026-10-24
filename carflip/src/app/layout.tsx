import "./globals.css";
import "./carflip.css";

export const metadata = { title: "CarFlip", description: "Find, value, inspect, buy and resell private-seller cars." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
