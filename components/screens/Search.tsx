"use client";
import { useState } from "react";
import { SearchNormal1 } from "iconsax-react";
import { Fabric } from "@/lib/data";
import { useStore } from "@/lib/store";
import { EmptyState } from "../molecules/EmptyState";
import { PageTitleBar } from "../molecules/PageTitleBar";
import { FabricRow, ScanSheet, SearchRow, matchFabric } from "./shared";

/* ---------- Search tab: the quick way to one fabric ---------- */
export function SearchHome() {
  const { fabrics, fabric, recents } = useStore();
  const [q, setQ] = useState("");
  const [scan, setScan] = useState(false);
  const searching = q.trim() !== "";
  const results = searching ? fabrics.filter((f) => matchFabric(f, q)) : [];
  const recent = recents.map((id) => fabric(id)).filter((f): f is Fabric => !!f);

  return (
    <>
      <PageTitleBar title="Search" />
      <SearchRow value={q} onChange={setQ} onScan={() => setScan(true)} placeholder="Supplier, collection, colour, roll" />

      {searching ? (
        <div className="grid gap-2">
          <p className="cap">{results.length} {results.length === 1 ? "fabric" : "fabrics"}</p>
          <div className="list">{results.map((f) => <FabricRow key={f.id} f={f} />)}</div>
          {results.length === 0 && <p className="sub">No fabric matches. Try a supplier, a colour or a roll code such as 2611-A.</p>}
        </div>
      ) : recent.length > 0 ? (
        <div className="grid gap-2">
          <p className="cap">Recently viewed</p>
          <div className="list">{recent.map((f) => <FabricRow key={f.id} f={f} />)}</div>
        </div>
      ) : (
        <EmptyState icon={SearchNormal1} title="Find a fabric" description="Type any part of the supplier, collection, design, colour or a roll code. Or tap the QR button to scan a sample book." />
      )}

      <ScanSheet open={scan} onClose={() => setScan(false)} />
    </>
  );
}
