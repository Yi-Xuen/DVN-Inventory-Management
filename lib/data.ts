export type Status = "worksheet" | "confirmed" | "proposal" | "used";

export const LIKELIHOODS = ["Unlikely", "Likely", "Very likely"] as const;
export type Likelihood = (typeof LIKELIHOODS)[number];

export type Roll = { code: string; left: number; received: number; month: string; short?: boolean };

export type Job = {
  id: string;
  status: Status;
  customer: string;
  location: string;
  metres: number;
  by: string;
  handover: string | null; // "Dec 2026"
  wsNo?: number;
  rooms?: { ref: string; name: string; m: number }[];
  likelihood?: Likelihood; // proposals only: how likely the customer is to confirm
  sewing?: "Sewing in progress" | "Queued for sewing";
  completed?: string;
  rolls?: string[];
  meta?: [string, string][];
  otherFabric?: { name: string; ref: string; room: string }[];
  log: string[];
};

export const FABRIC = { brand: "Casamance", name: "Soft Blackout - 1065 white" };
export const CURRENT_USER = "Jason";
export const TODAY = "14 Nov 2026";

export const ROLLS: Roll[] = [
  { code: "2611-B", left: 22, received: 25, month: "Nov 2026" },
  { code: "2611-A", left: 18, received: 25, month: "Nov 2026" },
  { code: "2610-A", left: 14, received: 25, month: "Oct 2026" },
  { code: "2609-B", left: 12, received: 25, month: "Sep 2026" },
  { code: "2609-A", left: 8, received: 25, month: "Sep 2026" },
  { code: "2608-A", left: 1, received: 30, month: "Aug 2026", short: true },
];
export const RECEIVED_TOTAL = 155;
export const USED_TOTAL = 80;

export const SEED_JOBS: Job[] = [
  {
    id: "ws1042", status: "worksheet", customer: "Mrs Tan", location: "Tanjung Bungah", metres: 15, by: "Mei Ling",
    handover: "Dec 2026", wsNo: 1042, sewing: "Sewing in progress",
    rooms: [{ ref: "1042-1", name: "Living room", m: 9 }, { ref: "1042-2", name: "Master bedroom", m: 6 }],
    otherFabric: [{ name: "Soft Blackout - gray", ref: "1042-3", room: "Room TBC" }],
    meta: [["Confirmed", "28 Oct 2026"], ["Worksheet created", "2 Nov 2026"]],
    log: ["6 Nov 2026 · Factory started sewing", "2 Nov 2026 · Mei Ling created the worksheet", "28 Oct 2026 · Mei Ling confirmed, 14 m to 15 m"],
  },
  {
    id: "ws1045", status: "worksheet", customer: "Mr Lim", location: "Bayan Lepas", metres: 10, by: "Jason",
    handover: "Jan 2027", wsNo: 1045, sewing: "Queued for sewing",
    rooms: [{ ref: "1045-1", name: "Study", m: 10 }],
    meta: [["Worksheet created", "9 Nov 2026"]],
    log: ["9 Nov 2026 · Jason created the worksheet"],
  },
  { id: "c1", status: "confirmed", customer: "Ms Ooi", location: "Gurney", metres: 12, by: "Jason", handover: "Jan 2027", meta: [["Confirmed", "10 Nov 2026"]], log: ["10 Nov 2026 · Jason confirmed"] },
  { id: "c2", status: "confirmed", customer: "Dr Rajan", location: "Batu Ferringhi", metres: 8, by: "Mei Ling", handover: "Feb 2027", meta: [["Confirmed", "11 Nov 2026"]], log: ["11 Nov 2026 · Mei Ling confirmed"] },
  { id: "c3", status: "confirmed", customer: "Mdm Khoo", location: "Air Itam", metres: 5, by: "Mei Ling", handover: "Feb 2027", meta: [["Confirmed", "12 Nov 2026"]], log: ["12 Nov 2026 · Mei Ling confirmed"] },
  { id: "p1", status: "proposal", likelihood: "Very likely", customer: "Mr Chew", location: "Jelutong", metres: 15, by: "Jason", handover: "Feb 2027", meta: [["Quoted", "3 Nov 2026"]], log: ["3 Nov 2026 · Jason quoted"] },
  { id: "p2", status: "proposal", likelihood: "Likely", customer: "Mrs Lee", location: "Pulau Tikus", metres: 10, by: "Mei Ling", handover: null, meta: [["Quoted", "5 Nov 2026"]], log: ["5 Nov 2026 · Mei Ling quoted"] },
  { id: "p3", status: "proposal", likelihood: "Likely", customer: "Mr Azman", location: "Balik Pulau", metres: 9, by: "Jason", handover: "Mar 2027", meta: [["Quoted", "7 Nov 2026"]], log: ["7 Nov 2026 · Jason quoted"] },
  { id: "p4", status: "proposal", likelihood: "Unlikely", customer: "Ms Yeoh", location: "Georgetown", metres: 6, by: "Mei Ling", handover: null, meta: [["Quoted", "8 Nov 2026"]], log: ["8 Nov 2026 · Mei Ling quoted"] },
  { id: "u1", status: "used", customer: "Mr Goh", location: "Tanjung Tokong", metres: 30, by: "Jason", handover: null, wsNo: 1031, completed: "30 Oct 2026", rolls: ["2608-A", "2609-A"], log: ["30 Oct 2026 · Factory completed the worksheet"] },
  { id: "u2", status: "used", customer: "Mrs Saw", location: "Sungai Ara", metres: 22, by: "Mei Ling", handover: null, wsNo: 1027, completed: "21 Oct 2026", rolls: ["2609-A", "2609-B"], log: ["21 Oct 2026 · Factory completed the worksheet"] },
  { id: "u3", status: "used", customer: "Ms Lau", location: "Bukit Jambul", metres: 16, by: "Jason", handover: null, wsNo: 1019, completed: "9 Oct 2026", rolls: ["2608-A"], log: ["9 Oct 2026 · Factory completed the worksheet"] },
  { id: "u4", status: "used", customer: "Mr Wong", location: "Relau", metres: 12, by: "Mei Ling", handover: null, wsNo: 1012, completed: "24 Sep 2026", rolls: ["2608-A"], log: ["24 Sep 2026 · Factory completed the worksheet"] },
];

export const STATUS_LABEL: Record<Status, string> = {
  worksheet: "Worksheet", confirmed: "Confirmed", proposal: "Proposal", used: "Used",
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
