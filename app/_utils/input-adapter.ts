import { ChangeRequest, ModifyChangeRequest } from "../_components/ui/input";
import { parseNumber } from "./parse-number";

type NumericAdjustmentMap = Record<NonNullable<ModifyChangeRequest["adjustment"]>, number>;

const defaultNumericAdjustments: NumericAdjustmentMap = {
  small: 0.1,
  medium: 1,
  large: 10,
};

const getNumericAdjustment = (
  adjustment: ModifyChangeRequest["adjustment"],
  adjustmentMap: NumericAdjustmentMap = defaultNumericAdjustments,
) => adjustmentMap[adjustment || "medium"];

export const resolveChangeRequestToNumber = (changeRequest: ChangeRequest, get: () => number): number => {
  const currentValue = get();

  switch (changeRequest.type) {
    case "set": {
      const newValue = parseNumber(changeRequest.value || "");
      return newValue === null ? currentValue : newValue;
    }

    case "modify": {
      const adjustment = getNumericAdjustment(changeRequest.adjustment);
      const polarity = changeRequest.direction === "increment" ? 1 : -1;
      return currentValue + adjustment * polarity;
    }
  }
};

export const resolveChangeRequestToString = (changeRequest: ChangeRequest, get: () => string): string => {
  const currentValue = get();

  switch (changeRequest.type) {
    case "set": {
      return changeRequest.value || "";
    }

    default: {
      return currentValue;
    }
  }
};
