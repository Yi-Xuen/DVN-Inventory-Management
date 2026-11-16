"use client";
import { useState } from "react";
import { Button } from "../atoms/Button";
import { NumberInput, Select } from "../atoms/TextField";
import { Label } from "../atoms/Label";
import { FormField } from "../molecules/FormField";
import { BatchList, type Batch } from "./BatchList";
import { metres } from "@/lib/format";

export type LogCutValues = { cutter: string; batchCode: string; metres: number };

export type LogCutFormProps = {
  /** Worksheet item being cut, e.g. 1001-2. */
  itemNo: string;
  room: string;
  /** Metres sales confirmed for this line. */
  confirmed: number;
  /** The fabric's rolls. */
  batches: Batch[];
  /** Names for "Who is cutting?" (the factory shares one login). */
  cutters: string[];
  onSubmit: (values: LogCutValues) => void;
};

/**
 * Factory records the actual metres used for a worksheet line and the roll they came from.
 * A cut larger than the roll has left is blocked, because the actual balance can never go negative.
 */
export function LogCutForm({ itemNo, room, confirmed, batches, cutters, onSubmit }: LogCutFormProps) {
  const [cutter, setCutter] = useState("");
  const [batchCode, setBatchCode] = useState<string>();
  const [metresText, setMetresText] = useState("");
  const [tried, setTried] = useState(false);

  const amount = Number(metresText);
  const amountOk = metresText !== "" && amount > 0;
  const batch = batches.find((b) => b.code === batchCode);
  const overCut = !!batch && amountOk && amount > batch.remaining;
  const metresError = overCut
    ? `Roll ${batch.code} only has ${metres(batch.remaining)} left. Correct the count first if the roll has more.`
    : tried && !amountOk
      ? "Enter the metres used."
      : undefined;

  return (
    <form
      noValidate
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        setTried(true);
        if (cutter && batch && amountOk && !overCut) onSubmit({ cutter, batchCode: batch.code, metres: amount });
      }}
    >
      <p className="body-3 rounded-ds-2 bg-raised p-3 text-fg">
        <span className="body-3-semibold">{itemNo}</span> · {room} · confirmed {metres(confirmed)}
      </p>
      <FormField label="Who is cutting?" required error={tried && !cutter ? "Pick your name." : undefined}>
        {(field) => (
          <Select {...field} value={cutter} onChange={(e) => setCutter(e.target.value)}>
            <option value="" disabled>Pick a name</option>
            {cutters.map((name) => <option key={name}>{name}</option>)}
          </Select>
        )}
      </FormField>
      <div className="grid gap-1">
        <Label>Roll (match the code on the sticker)</Label>
        <BatchList batches={batches} selected={batchCode} onSelect={setBatchCode} />
        {tried && !batch && <p role="alert" className="body-4 text-fg-danger">Pick the roll you cut from.</p>}
      </div>
      <FormField label="Actual metres used" required error={metresError}>
        {(field) => <NumberInput {...field} value={metresText} onChange={(e) => setMetresText(e.target.value)} placeholder="0" />}
      </FormField>
      <Button type="submit" disabled={overCut}>Complete sewing</Button>
    </form>
  );
}
