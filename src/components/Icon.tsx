// Simple line icons, 20px, drawn in currentColor so they follow the text colour in light and dark mode.
const PATHS: Record<string, string> = {
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z",
  find: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm9.5 16.5-4.5-4.5",
  leads: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
  account: "M3 7h18v10H3zM3 10h18M7 14h3",
  admin: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 9a8 8 0 0 1 16 0",
  plus: "M12 5v14M5 12h14",
  logout: "M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H3",
};

export default function Icon({ name, size = 20 }: { name: keyof typeof PATHS | string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name] ?? PATHS.home} />
    </svg>
  );
}
