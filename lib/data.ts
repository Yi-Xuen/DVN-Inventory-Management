/** Where a job is. "used" is shown to staff as Done. "cancelled" jobs are kept but never listed. */
export type Stage = "proposal" | "confirmed" | "worksheet" | "used" | "cancelled";
/** The four stages that have a list on a fabric page. */
export type Status = Exclude<Stage, "cancelled">;

export const LIKELIHOODS = ["Unlikely", "Likely", "Very likely"] as const;
export type Likelihood = (typeof LIKELIHOODS)[number];

/** One stocked fabric: one design in one colour. `updated` is a counter, higher = changed more recently. */
export type Fabric = { id: string; supplier: string; collection: string; design: string; colour: string; updated: number };
export const fabricName = (f: Fabric) => `${f.collection} - ${f.design} ${f.colour}`;

export type Roll = { fabricId: string; code: string; left: number; received: number; month: string; short?: boolean; arrivedDaysAgo?: number };

export type Room = { name: string; m: number };

/** One fabric inside a job. `seq` is its place in that fabric's queue (lower = earlier). */
export type Line = { id: string; fabricId: string; metres: number; seq: number; rooms?: Room[]; rolls?: string[] };

export type Job = {
  id: string;
  stage: Stage;
  customer: string;
  location: string;
  by: string;
  handover: string | null; // "Dec 2026"
  likelihood?: Likelihood; // proposals only
  wsNo?: number;
  /** draft = only sales can see it (job is still Confirmed); queued and sewing = shared with the factory */
  ws?: "draft" | "queued" | "sewing";
  completed?: string;
  lines: Line[];
  meta?: [string, string][];
  log: string[];
};

export const SALES_USERS = ["Leonard", "Mei Ling", "Kok Heng"] as const;
/** The signed-in salesperson in the prototype, and the one sales user who is an admin. */
export const CURRENT_USER: string = "Leonard";
export const ADMIN_USER: string = "Mei Ling";
export const TODAY = "16 Nov 2026";

export const FABRICS: Fabric[] = [
  { id: "sbw", supplier: "Casamance", collection: "Soft Blackout", design: "1065", colour: "white", updated: 6 },
  { id: "sbg", supplier: "Casamance", collection: "Soft Blackout", design: "1065", colour: "gray", updated: 5 },
  { id: "vsi", supplier: "H05D", collection: "Voile Sheer", design: "Essentia", colour: "ivory", updated: 3 },
  { id: "vsw", supplier: "H05D", collection: "Voile Sheer", design: "Essentia", colour: "white", updated: 7 },
  { id: "ll5", supplier: "GW02", collection: "Linen Look", design: "Oslo", colour: "05", updated: 2 },
  { id: "ll2", supplier: "GW02", collection: "Linen Look", design: "Oslo", colour: "02", updated: 1 },
  { id: "ll9", supplier: "GW02", collection: "Linen Look", design: "Oslo", colour: "09", updated: 4 },
];

export const ROLLS: Roll[] = [
  { fabricId: "sbw", code: "2611-B", left: 22, received: 25, month: "Nov 2026" },
  { fabricId: "sbw", code: "2611-A", left: 18, received: 25, month: "Nov 2026" },
  { fabricId: "sbw", code: "2610-A", left: 14, received: 25, month: "Oct 2026" },
  { fabricId: "sbw", code: "2609-B", left: 12, received: 25, month: "Sep 2026" },
  { fabricId: "sbw", code: "2609-A", left: 8, received: 25, month: "Sep 2026" },
  { fabricId: "sbw", code: "2608-A", left: 1, received: 30, month: "Aug 2026", short: true },
  { fabricId: "sbg", code: "2611-A", left: 25, received: 25, month: "Nov 2026", arrivedDaysAgo: 2 },
  { fabricId: "sbg", code: "2610-A", left: 21, received: 25, month: "Oct 2026" },
  { fabricId: "vsi", code: "2609-A", left: 8, received: 40, month: "Sep 2026" },
  { fabricId: "vsw", code: "2611-A", left: 30, received: 30, month: "Nov 2026", arrivedDaysAgo: 0 },
  { fabricId: "ll5", code: "2608-A", left: 0, received: 20, month: "Aug 2026" },
  { fabricId: "ll2", code: "2610-A", left: 18, received: 20, month: "Oct 2026" },
  { fabricId: "ll9", code: "2609-A", left: 1.5, received: 20, month: "Sep 2026", short: true },
];

/** Shipments on the way (about 2 months from China). Sample data: the real app will take these from purchase orders. */
export type Shipment = { fabricId: string; metres: number; eta: string };
export const INCOMING: Shipment[] = [
  { fabricId: "vsi", metres: 60, eta: "Jan 2027" },
  { fabricId: "ll5", metres: 40, eta: "Dec 2026" },
];

const line = (id: string, fabricId: string, metres: number, seq: number, extra: Partial<Line> = {}): Line => ({ id, fabricId, metres, seq, ...extra });

export const SEED_JOBS: Job[] = [
  {
    id: "ws1042", stage: "worksheet", customer: "Mrs Tan", location: "Tanjung Bungah", by: "Mei Ling", handover: "Dec 2026", wsNo: 1042, ws: "sewing",
    lines: [
      line("ws1042-a", "sbw", 15, 1, { rooms: [{ name: "Living room", m: 9 }, { name: "Master bedroom", m: 6 }] }),
      line("ws1042-b", "sbg", 6, 2, { rooms: [{ name: "Dining room", m: 6 }] }),
    ],
    meta: [["Confirmed", "28 Oct 2026"], ["Worksheet shared", "2 Nov 2026"]],
    log: ["6 Nov 2026 · Factory started sewing", "2 Nov 2026 · Mei Ling shared the worksheet with the factory", "28 Oct 2026 · Mei Ling confirmed, 14 m to 15 m"],
  },
  {
    id: "ws1045", stage: "worksheet", customer: "Mr Lim", location: "Bayan Lepas", by: "Leonard", handover: "Jan 2027", wsNo: 1045, ws: "queued",
    lines: [line("ws1045-a", "sbw", 10, 3, { rooms: [{ name: "Study", m: 10 }] })],
    meta: [["Worksheet shared", "9 Nov 2026"]],
    log: ["9 Nov 2026 · Leonard shared the worksheet with the factory"],
  },
  { id: "c1", stage: "confirmed", customer: "Ms Ooi", location: "Gurney", by: "Leonard", handover: "Jan 2027", lines: [line("c1-a", "sbw", 12, 4)], meta: [["Confirmed", "10 Nov 2026"]], log: ["10 Nov 2026 · Leonard confirmed"] },
  { id: "c2", stage: "confirmed", customer: "Dr Rajan", location: "Batu Ferringhi", by: "Mei Ling", handover: "Feb 2027", lines: [line("c2-a", "sbw", 8, 5)], meta: [["Confirmed", "11 Nov 2026"]], log: ["11 Nov 2026 · Mei Ling confirmed"] },
  { id: "c3", stage: "confirmed", customer: "Mdm Khoo", location: "Air Itam", by: "Kok Heng", handover: "Feb 2027", lines: [line("c3-a", "sbw", 5, 6)], meta: [["Confirmed", "12 Nov 2026"]], log: ["12 Nov 2026 · Kok Heng confirmed"] },
  { id: "c4", stage: "confirmed", customer: "Mdm Wee", location: "Tanjung Tokong", by: "Leonard", handover: "Mar 2027", lines: [line("c4-a", "vsi", 20, 7)], meta: [["Confirmed", "13 Nov 2026"]], log: ["13 Nov 2026 · Leonard confirmed"] },
  { id: "c5", stage: "confirmed", customer: "Mr Teoh", location: "Bukit Mertajam", by: "Kok Heng", handover: "Feb 2027", lines: [line("c5-a", "ll5", 5, 8)], meta: [["Confirmed", "13 Nov 2026"]], log: ["13 Nov 2026 · Kok Heng confirmed"] },
  { id: "p1", stage: "proposal", likelihood: "Very likely", customer: "Mr Chew", location: "Jelutong", by: "Leonard", handover: "Feb 2027", lines: [line("p1-a", "sbw", 15, 9)], meta: [["Quoted", "3 Nov 2026"]], log: ["3 Nov 2026 · Leonard quoted"] },
  { id: "p2", stage: "proposal", likelihood: "Likely", customer: "Mrs Lee", location: "Pulau Tikus", by: "Mei Ling", handover: null, lines: [line("p2-a", "sbw", 10, 10)], meta: [["Quoted", "5 Nov 2026"]], log: ["5 Nov 2026 · Mei Ling quoted"] },
  { id: "p5", stage: "proposal", likelihood: "Likely", customer: "Mr Chew", location: "Jelutong", by: "Leonard", handover: null, lines: [line("p5-a", "sbg", 8, 11)], meta: [["Quoted", "5 Nov 2026"]], log: ["5 Nov 2026 · Leonard quoted"] },
  { id: "p3", stage: "proposal", likelihood: "Likely", customer: "Mr Azman", location: "Balik Pulau", by: "Leonard", handover: "Mar 2027", lines: [line("p3-a", "sbw", 9, 12), line("p3-b", "sbg", 4, 15)], meta: [["Quoted", "7 Nov 2026"]], log: ["7 Nov 2026 · Leonard quoted"] },
  { id: "p4", stage: "proposal", likelihood: "Unlikely", customer: "Ms Yeoh", location: "Georgetown", by: "Kok Heng", handover: null, lines: [line("p4-a", "sbw", 6, 13)], meta: [["Quoted", "8 Nov 2026"]], log: ["8 Nov 2026 · Kok Heng quoted"] },
  { id: "p6", stage: "proposal", likelihood: "Likely", customer: "Mrs Ng", location: "Tanjung Bungah", by: "Mei Ling", handover: null, lines: [line("p6-a", "ll2", 6, 14)], meta: [["Quoted", "9 Nov 2026"]], log: ["9 Nov 2026 · Mei Ling quoted"] },
  { id: "u1", stage: "used", customer: "Mr Goh", location: "Tanjung Tokong", by: "Leonard", handover: null, wsNo: 1031, completed: "30 Oct 2026", lines: [line("u1-a", "sbw", 30, -4, { rolls: ["2608-A", "2609-A"] })], log: ["30 Oct 2026 · Factory completed the worksheet"] },
  { id: "u2", stage: "used", customer: "Mrs Saw", location: "Sungai Ara", by: "Mei Ling", handover: null, wsNo: 1027, completed: "21 Oct 2026", lines: [line("u2-a", "sbw", 22, -3, { rolls: ["2609-A", "2609-B"] })], log: ["21 Oct 2026 · Factory completed the worksheet"] },
  { id: "u3", stage: "used", customer: "Ms Lau", location: "Bukit Jambul", by: "Leonard", handover: null, wsNo: 1019, completed: "9 Oct 2026", lines: [line("u3-a", "sbw", 16, -2, { rolls: ["2608-A"] })], log: ["9 Oct 2026 · Factory completed the worksheet"] },
  { id: "u4", stage: "used", customer: "Mr Wong", location: "Relau", by: "Kok Heng", handover: null, wsNo: 1012, completed: "24 Sep 2026", lines: [line("u4-a", "sbw", 12, -1, { rolls: ["2608-A"] })], log: ["24 Sep 2026 · Factory completed the worksheet"] },
];

export const STATUS_LABEL: Record<Stage, string> = {
  worksheet: "Worksheet", confirmed: "Confirmed", proposal: "Proposal", used: "Used", cancelled: "Cancelled",
};

/** Next 24 months starting this month, as "Nov 2026". */
export function handoverOptions(): string[] {
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const out: string[] = [];
  let m = 10, y = 2026; // Nov 2026
  for (let i = 0; i < 24; i++) {
    out.push(`${names[m]} ${y}`);
    m++; if (m > 11) { m = 0; y++; }
  }
  return out;
}
