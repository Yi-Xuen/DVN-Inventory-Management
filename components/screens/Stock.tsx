"use client";
import { useState } from "react";
import { StockSort, StockView, fmt, useStore } from "@/lib/store";
import { back } from "@/lib/nav";
import { FilterButton } from "../molecules/FilterButton";
import { Button } from "../atoms/Button";
import { Pill } from "../atoms/Pill";
import { Select } from "../atoms/TextField";
import { PageTitleBar } from "../molecules/PageTitleBar";
import { SegmentedControl } from "../molecules/SegmentedControl";
import { StatTile } from "../molecules/StatTile";
import { Sheet } from "../organisms/Sheet";
import { FabricRow, ScanSheet, SearchRow, matchFabric } from "./shared";

const SORT_LABEL: Record<StockSort, string> = { shortage: "Shortage", availability: "Available", updated: "Updated" };

/* ---------- Stock tab: search, four tiles, then every fabric ---------- */
export function StockHome() {
  const { fabrics, stats, stockView, setStockView } = useStore();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState(false);
  const [scan, setScan] = useState(false);

  const groups = stockGroups(fabrics.map((f) => f.id), stats);

  const list = fabrics
    .filter((f) => matchFabric(f, q))
    .filter((f) => (!stockView.supplier || f.supplier === stockView.supplier) && (!stockView.collection || f.collection === stockView.collection))
    .sort((a, b) =>
      stockView.sort === "updated" ? b.updated - a.updated
        : stockView.sort === "availability" ? stats(b.id).avail - stats(a.id).avail
          : stats(a.id).avail - stats(b.id).avail,
    );
  const searching = q.trim() !== "";
  const active = (stockView.supplier ? 1 : 0) + (stockView.collection ? 1 : 0) + (stockView.sort !== "shortage" ? 1 : 0);

  return (
    <>
      <PageTitleBar title="Stock" />
      <SearchRow value={q} onChange={setQ} onScan={() => setScan(true)} />

      {!searching && (
        <div className="grid grid-cols-2 gap-3">
          <StatTile label="In stock" value={groups.inStock.length} href="#/stock/in-stock" />
          <StatTile label="Shortage" value={groups.shortage.length} tone="danger" href="#/stock/shortage" />
          <StatTile label="Out of stock" value={groups.out.length} tone="danger" href="#/stock/out" />
          <StatTile label="Incoming" value={groups.incoming.length} href="#/stock/incoming" />
        </div>
      )}

      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="heading-4 text-fg">{searching ? "Search results" : "All fabrics"}</h2>
          <FilterButton count={active} onClick={() => setFilter(true)} />
        </div>
        <div className="list">
          {list.map((f) => <FabricRow key={f.id} f={f} />)}
          {list.length === 0 && <p className="sub">No fabric matches. Try fewer words, or clear the filters.</p>}
        </div>
      </div>

      <FilterSheet open={filter} view={stockView} onApply={setStockView} onClose={() => setFilter(false)} />
      <ScanSheet open={scan} onClose={() => setScan(false)} />
    </>
  );
}

function FilterSheet({ open, view, onApply, onClose }: { open: boolean; view: StockView; onApply: (v: StockView) => void; onClose: () => void }) {
  const { fabrics } = useStore();
  const [draft, setDraft] = useState(view);
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) { setWasOpen(open); if (open) setDraft(view); }
  const suppliers = [...new Set(fabrics.map((f) => f.supplier))];
  const collections = [...new Set(fabrics.filter((f) => !draft.supplier || f.supplier === draft.supplier).map((f) => f.collection))];
  const count = fabrics.filter((f) => (!draft.supplier || f.supplier === draft.supplier) && (!draft.collection || f.collection === draft.collection)).length;
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Filter and sort"
      footer={
        <div className="grid gap-2">
          <Button onClick={() => { onApply(draft); onClose(); }}>Show {count} {count === 1 ? "fabric" : "fabrics"}</Button>
          <Button variant="secondary" onClick={() => setDraft({ supplier: "", collection: "", sort: "shortage" })}>Clear</Button>
        </div>
      }
    >
      <div className="grid gap-4">
        <div className="fld">
          <label className="cap" htmlFor="flt-sup">Supplier</label>
          <Select id="flt-sup" value={draft.supplier} onChange={(e) => setDraft({ ...draft, supplier: e.target.value, collection: "" })}>
            <option value="">All suppliers</option>
            {suppliers.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
        <div className="fld">
          <label className="cap" htmlFor="flt-col">Collection</label>
          <Select id="flt-col" value={draft.collection} onChange={(e) => setDraft({ ...draft, collection: e.target.value })}>
            <option value="">All collections</option>
            {collections.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </div>
        <div className="fld">
          <span className="cap">Sort by</span>
          <SegmentedControl
            aria-label="Sort by"
            options={(Object.keys(SORT_LABEL) as StockSort[]).map((v) => ({ value: v, label: SORT_LABEL[v] }))}
            value={draft.sort}
            onChange={(sort) => setDraft({ ...draft, sort })}
          />
          <span className="hint">
            {draft.sort === "shortage" ? "Biggest shortage first." : draft.sort === "availability" ? "Most free metres first." : "Most recently changed first."}
          </span>
        </div>
      </div>
    </Sheet>
  );
}

/* ---------- The list behind each tile ---------- */
export type StockListKind = "in-stock" | "shortage" | "out" | "incoming";

type Stats = ReturnType<typeof useStore>["stats"];

/** The four groups the Stock tiles count. A fabric can be in more than one (for example in stock and short). */
function stockGroups(ids: string[], stats: Stats) {
  return {
    inStock: ids.filter((id) => stats(id).usable > 0),
    shortage: ids.filter((id) => stats(id).gap > 0),
    out: ids.filter((id) => stats(id).usable <= 0),
    incoming: ids.filter((id) => stats(id).incoming > 0),
  };
}

export function StockList({ kind }: { kind: StockListKind }) {
  const { fabrics, stats } = useStore();
  const onBack = () => back("");
  const g = stockGroups(fabrics.map((f) => f.id), stats);
  const of = (ids: string[]) => fabrics.filter((f) => ids.includes(f.id));

  const page: Record<StockListKind, { title: string; note: string; rows: { f: (typeof fabrics)[number]; sub: string; pill: React.ReactNode }[]; empty: string }> = {
    "in-stock": {
      title: "In stock",
      note: "Fabrics with at least one roll that can be cut. Short ends are not counted.",
      rows: of(g.inStock).sort((a, b) => stats(b.id).usable - stats(a.id).usable).map((f) => ({
        f, sub: `${stats(f.id).rolls} ${stats(f.id).rolls === 1 ? "roll" : "rolls"} · ${fmt(stats(f.id).onHand)} on hand`, pill: <Pill tone="neutral">{fmt(stats(f.id).usable)} usable</Pill>,
      })),
      empty: "Nothing is in stock.",
    },
    shortage: {
      title: "Shortage",
      note: "All jobs, including proposals, need more than is on hand. Biggest gap first.",
      rows: of(g.shortage).sort((a, b) => stats(b.id).gap - stats(a.id).gap).map((f) => {
        const s = stats(f.id);
        return { f, sub: `Needs ${fmt(s.worksheet + s.confirmed + s.proposal)} · on hand ${fmt(s.onHand)}${s.incoming > 0 ? ` · ${fmt(s.incoming)} coming` : ""}`, pill: <Pill tone="danger">Short {fmt(s.gap)}</Pill> };
      }),
      empty: "Stock covers every job and proposal.",
    },
    out: {
      title: "Out of stock",
      note: "Fabrics with no roll left, or only short ends that are too short to use.",
      rows: of(g.out).map((f) => {
        const s = stats(f.id);
        return { f, sub: s.rolls === 0 ? "No rolls left" : `Only short ends left: ${fmt(s.shortEnds)}`, pill: <Pill tone="danger">{s.rolls === 0 ? "Empty" : "Short end"}</Pill> };
      }),
      empty: "Every fabric has a roll that can be cut.",
    },
    incoming: {
      title: "Incoming",
      note: "Fabrics with a shipment on the way.",
      rows: of(g.incoming).sort((a, b) => (stats(a.id).eta ?? "").localeCompare(stats(b.id).eta ?? "")).map((f) => {
        const s = stats(f.id);
        return { f, sub: `${fmt(s.incoming)} due ${s.eta}`, pill: <Pill tone="primary">{fmt(s.incoming)}</Pill> };
      }),
      empty: "No shipments are on the way.",
    },
  };
  const p = page[kind];

  return (
    <>
      <PageTitleBar title={p.title} onBack={onBack} />
      <p className="sub">{p.note}</p>
      <div className="list">
        {p.rows.map((r) => <FabricRow key={r.f.id} f={r.f} sub={r.sub} pill={r.pill} />)}
        {p.rows.length === 0 && <p className="sub">{p.empty}</p>}
      </div>
    </>
  );
}
