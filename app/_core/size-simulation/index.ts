import { getSizeCSSValueFromScalingPart, LimitedSizeData } from "../size/calculation";

export type SimulatedView = number | null;

export const min = 50;
export const max = 3000;

export const mutateSimulatedView = (view: SimulatedView): SimulatedView => {
  if (view === null) return view;
  return Math.min(Math.max(view, min), max);
};

export const getSimulatedSizeCSSValue = (config: Omit<LimitedSizeData, "slope"> & { simulatedView: number }) => {
  const scalingPart = `${config.rem}rem + ${(config.vw / 100) * config.simulatedView}px`;
  return getSizeCSSValueFromScalingPart({ scalingPart, min: config.min, max: config.max });
};
