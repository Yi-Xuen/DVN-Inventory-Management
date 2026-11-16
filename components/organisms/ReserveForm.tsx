"use client";
import { useState } from "react";
import { Button } from "../atoms/Button";
import { TextField, NumberInput, Select } from "../atoms/TextField";
import { Alert } from "../molecules/Alert";
import { FormField } from "../molecules/FormField";
import { Stat } from "../molecules/Stat";

export type ReserveValues = { metres: number; customer: string; salesperson: string };

export type ReserveFormProps = {
  fabricCode: string;
  actualBalance: number;
  reserveBalance: number;
  salespeople: string[];
  /** Pre-selected salesperson (the signed-in user). */
  defaultSalesperson?: string;
  onSubmit: (values: ReserveValues) => void;
};

/**
 * Reserve metres of a fabric for a customer at quotation stage. Reserving past zero is allowed:
 * it shows a warning that the fabric must be bought. Fields are one column on mobile and two from tablet up.
 */
export function ReserveForm({ fabricCode, actualBalance, reserveBalance, salespeople, defaultSalesperson = "", onSubmit }: ReserveFormProps) {
  const [metresText, setMetresText] = useState("");
  const [customer, setCustomer] = useState("");
  const [salesperson, setSalesperson] = useState(defaultSalesperson);
  const [tried, setTried] = useState(false);

  const amount = Number(metresText);
  const amountOk = metresText !== "" && amount > 0;
  const after = reserveBalance - (amountOk ? amount : 0);

  return (
    <form
      noValidate
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        setTried(true);
        if (amountOk && customer.trim() && salesperson) onSubmit({ metres: amount, customer: customer.trim(), salesperson });
      }}
    >
      <div className="grid grid-cols-2 gap-3 rounded-ds-2 bg-raised p-3">
        <Stat label={`${fabricCode} actual balance`} value={actualBalance} />
        <Stat label="Reserve balance" value={reserveBalance} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Metres to reserve" required error={tried && !amountOk ? "Enter the metres to reserve." : undefined} className="md:col-span-2">
          {(field) => <NumberInput {...field} value={metresText} onChange={(e) => setMetresText(e.target.value)} placeholder="0" />}
        </FormField>
        <FormField label="Customer" required error={tried && !customer.trim() ? "Enter the customer's name." : undefined}>
          {(field) => <TextField {...field} value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="e.g. Mrs Tan" />}
        </FormField>
        <FormField label="Salesperson" required error={tried && !salesperson ? "Pick a salesperson." : undefined}>
          {(field) => (
            <Select {...field} value={salesperson} onChange={(e) => setSalesperson(e.target.value)}>
              <option value="" disabled>Pick a name</option>
              {salespeople.map((name) => <option key={name}>{name}</option>)}
            </Select>
          )}
        </FormField>
      </div>
      {amountOk && after < 0 && (
        <Alert tone="warning" title={`This takes the reserve balance to ${after.toFixed(2).replace(/\.?0+$/, "").replace("-", "−")} m`}>
          You can still reserve. It means the fabric must be bought.
        </Alert>
      )}
      <Button type="submit">Reserve</Button>
    </form>
  );
}
