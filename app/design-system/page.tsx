import { ThemeScope } from "./ThemeScope";
import { TestScreen } from "./TestScreen";

export default function Page() {
  return (
    <ThemeScope>
      <TestScreen />
    </ThemeScope>
  );
}
