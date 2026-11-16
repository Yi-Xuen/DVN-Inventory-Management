"use client";
import { Activity, Category, ClipboardText, SearchNormal1, Setting2 } from "iconsax-react";
import type { Icon as IconsaxIcon } from "iconsax-react";
import { Status } from "@/lib/data";
import { StoreProvider, useStore } from "@/lib/store";
import { go, useHash } from "@/lib/nav";
import ThemeToggle from "./molecules/ThemeToggle";
import { EmptyState } from "./molecules/EmptyState";
import { PageTitleBar } from "./molecules/PageTitleBar";
import { TabBar } from "./organisms/TabBar";
import { FabricJobs, FabricOverview, OnHand } from "./screens/Fabric";
import { JobDetail, JobsHome } from "./screens/Jobs";
import { SearchHome } from "./screens/Search";
import { StockHome, StockList, StockListKind } from "./screens/Stock";

const TABS = [
  { key: "stock", label: "Stock", icon: Category, href: "#/" },
  { key: "jobs", label: "Jobs", icon: ClipboardText, href: "#/jobs" },
  { key: "search", label: "Search", icon: SearchNormal1, href: "#/search" },
  { key: "activities", label: "Activities", icon: Activity, href: "#/activities" },
  { key: "settings", label: "Settings", icon: Setting2, href: "#/settings" },
];
const STATUSES: Status[] = ["worksheet", "confirmed", "proposal", "used"];
const STOCK_LISTS: StockListKind[] = ["in-stock", "shortage", "out", "incoming"];

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}

/**
 * Routes (after "#/"):
 *   ""  stock/<to-buy|backorder|factory|arrived>  jobs  search  activities  settings   ← tab screens, with the tab bar
 *   fabric/<id>  fabric/<id>/on-hand  fabric/<id>/<stage>  job/<id>                     ← pushed screens, with Back
 */
function Shell() {
  const { ready, reset } = useStore();
  const hash = useHash();
  const [a = "", b, c] = hash.split("/");
  const tab = a === "" || a === "stock" ? "stock" : TABS.some((t) => t.key === a) ? a : null;

  let screen;
  if (a === "fabric" && b) {
    screen = c === "on-hand" ? <OnHand id={b} />
      : STATUSES.includes(c as Status) ? <FabricJobs id={b} status={c as Status} />
        : <FabricOverview id={b} />;
  } else if (a === "job" && b) screen = <JobDetail id={b} />;
  else if (a === "jobs") screen = <JobsHome />;
  else if (a === "search") screen = <SearchHome />;
  else if (a === "activities") screen = <ComingNext title="Activities" icon={Activity} text="A feed of everything added or changed, and who did it. Planned for the next round of the prototype (flow S8)." />;
  else if (a === "settings") screen = <ComingNext title="Settings" icon={Setting2} text="Account, theme and the office tools for admins. Planned for the next round of the prototype." />;
  else if (a === "stock" && STOCK_LISTS.includes(b as StockListKind)) screen = <StockList kind={b as StockListKind} />;
  else screen = <StockHome />;

  return (
    <div className="shell">
      <div className="proto-bar">
        <span>Prototype · sample data</span>
        <ThemeToggle />
        <button onClick={() => { if (confirm("Reset the demo to its starting data?")) { reset(); go(""); } }}>Reset demo</button>
      </div>
      <main key={hash} className={`phone${tab ? " has-tabs" : ""}`}>{ready ? screen : null}</main>
      {tab && <TabBar items={TABS} activeKey={tab} />}
    </div>
  );
}

function ComingNext({ title, icon, text }: { title: string; icon: IconsaxIcon; text: string }) {
  return (
    <>
      <PageTitleBar title={title} />
      <EmptyState icon={icon} title="Not in this prototype yet" description={text} />
    </>
  );
}
