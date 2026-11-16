import { TickCircle } from "iconsax-react";
import { Icon } from "../atoms/Icon";

export const JOB_STAGES = ["Quotation", "Confirmed", "Worksheet created", "Sewing in progress", "Sewing completed"];

export type StageStepperProps = {
  /** Stage names in order. Defaults to the five tracked job stages. */
  stages?: string[];
  /** Index of the current stage (0 = first). */
  current: number;
  className?: string;
};

/**
 * Shows where a job is in the flow. Mobile-first:
 * - mobile: the current stage name, "Step 2 of 5" and a segmented progress bar
 * - tablet and up (md): every stage with its name, in a row
 */
export function StageStepper({ stages = JOB_STAGES, current, className = "" }: StageStepperProps) {
  return (
    <div className={className}>
      {/* mobile */}
      <div className="grid gap-2 md:hidden" role="group" aria-label={`Step ${current + 1} of ${stages.length}: ${stages[current]}`}>
        <div className="flex items-baseline justify-between gap-2">
          <span className="body-2-semibold text-fg">{stages[current]}</span>
          <span className="body-4 text-fg-subtle">Step {current + 1} of {stages.length}</span>
        </div>
        <div aria-hidden="true" className="flex gap-1">
          {stages.map((stage, i) => (
            <i key={stage} className={`block h-1 flex-1 rounded-ds-1 ${i <= current ? "bg-primary" : "bg-raised"}`} />
          ))}
        </div>
      </div>
      {/* tablet and desktop */}
      <ol className="m-0 hidden list-none gap-2 p-0 md:flex">
        {stages.map((stage, i) => {
          const done = i < current;
          const on = i === current;
          return (
            <li key={stage} aria-current={on ? "step" : undefined} className="grid flex-1 gap-2">
              <i aria-hidden="true" className={`block h-1 rounded-ds-1 ${done || on ? "bg-primary" : "bg-raised"}`} />
              <span className={`flex items-center gap-1 ${on ? "body-3-semibold text-fg" : "body-3 text-fg-subtle"}`}>
                {done && <Icon icon={TickCircle} size={4} bold className="text-icon-success" label="Done" />}
                {stage}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
