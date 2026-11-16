"use client";
import { useState } from "react";
import { Button } from "../atoms/Button";
import { TextField, NumberInput } from "../atoms/TextField";
import { FormField } from "../molecules/FormField";

export type ReceiveBatchValues = { metres: number; receivedOn: string; dyeLot: string };

export type ReceiveBatchFormProps = {
  fabricCode: string;
  /** The batch code the system will assign to this roll, e.g. 2611-C. Nobody types it. */
  nextBatchCode: string;
  /** Default received date, as yyyy-mm-dd. */
  defaultDate?: string;
  onSubmit: (values: ReceiveBatchValues) => void;
};

/**
 * Factory adds a new roll (one roll is one batch). The batch code is assigned by the system and shown
 * large, so the worker can copy it onto the sticker. Fields are one column on mobile and two from tablet up.
 */
export function ReceiveBatchForm({ fabricCode, nextBatchCode, defaultDate = "", onSubmit }: ReceiveBatchFormProps) {
  const [metresText, setMetresText] = useState("");
  const [receivedOn, setReceivedOn] = useState(defaultDate);
  const [dyeLot, setDyeLot] = useState("");
  const [tried, setTried] = useState(false);

  const amount = Number(metresText);
  const amountOk = metresText !== "" && amount > 0;

  return (
    <form
      noValidate
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        setTried(true);
        if (amountOk && receivedOn) onSubmit({ metres: amount, receivedOn, dyeLot: dyeLot.trim() });
      }}
    >
      <div className="grid gap-1 rounded-ds-2 bg-raised p-3">
        <span className="body-4-semibold text-fg-subtle">Write this batch code on the sticker for {fabricCode}</span>
        <span className="heading-2 text-fg">{nextBatchCode}</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Metres received" required error={tried && !amountOk ? "Enter the metres on the roll." : undefined}>
          {(field) => <NumberInput {...field} value={metresText} onChange={(e) => setMetresText(e.target.value)} placeholder="0" />}
        </FormField>
        <FormField label="Date received" required error={tried && !receivedOn ? "Pick the date." : undefined}>
          {(field) => <TextField {...field} type="date" value={receivedOn} onChange={(e) => setReceivedOn(e.target.value)} />}
        </FormField>
        <FormField label="Supplier dye lot" helper="Optional. Kept in the system, not written on the sticker." className="md:col-span-2">
          {(field) => <TextField {...field} value={dyeLot} onChange={(e) => setDyeLot(e.target.value)} />}
        </FormField>
      </div>
      <Button type="submit">Add roll</Button>
    </form>
  );
}
