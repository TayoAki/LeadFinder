// Pipeline stages, shared by server and browser code (no server-only imports here).
export const STAGES = [
  { id: "shortlist", label: "Shortlist" },
  { id: "identified", label: "Identified" },
  { id: "contacted", label: "Contacted" },
  { id: "conversation", label: "Conversation" },
  { id: "nda", label: "NDA / financials" },
  { id: "loi", label: "LOI" },
  { id: "diligence", label: "Due diligence" },
  { id: "closed", label: "Closed" },
  { id: "passed", label: "Passed" },
] as const;
export type Stage = (typeof STAGES)[number]["id"];
export const isStage = (s: string): s is Stage => STAGES.some((x) => x.id === s);

/** Stages shown on the pipeline board: the shortlist has its own page. */
export const BOARD_STAGES = STAGES.filter((s) => s.id !== "shortlist");
