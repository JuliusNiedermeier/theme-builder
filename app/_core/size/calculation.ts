import { Result } from "@/app/_utils/result";

export type NumberRange = [number, number];
export type OptionalNumberRange = [number | null, number | null];

export interface LimitConfig {
  method: "size" | "view";
  value: number;
}

export interface LimitedSizeConfig {
  size: SizeData;
  limit?: [LimitConfig | null, LimitConfig | null];
}

export interface SizeCSSValueConfig {
  sizeRange: NumberRange;
  viewRange: NumberRange;
  limit?: [LimitConfig | null, LimitConfig | null];
}

export interface SizeData {
  slope: number;
  rem: number;
  vw: number;
}

export interface LimitedSizeData extends SizeData {
  min: number | null;
  max: number | null;
}

export const getSize = (
  [lowerSize, upperSize]: NumberRange,
  [lowerView, upperView]: NumberRange,
): Result<SizeData, string> => {
  const inputValues = [lowerSize, upperSize, lowerView, upperView];

  if (inputValues.some((value) => !Number.isFinite(value))) return Result.error("infinite-values" as const);
  if (inputValues.some((value) => value < 0)) return Result.error("negative-values" as const);
  if (upperSize - lowerSize < 0) return Result.error("invalid-size-range" as const);
  if (upperView - lowerView < 0) return Result.error("invalid-view-range" as const);

  // Calculate the slope (change in size per pixel of viewport width)
  const slope: number = (upperSize - lowerSize) / (upperView - lowerView);

  // Calculate the rem offset (y-intercept of the linear equation)
  const rem: number = lowerSize - slope * lowerView;

  // Convert slope to vw units (multiply by 100 since 1vw = viewport width / 100)
  const vw: number = slope * 100;

  return Result.ok({ slope, rem, vw });
};

export const getSizeAtView = (view: number, slope: number, rem: number) => {
  return view * slope + rem;
};

export const getSizeLimit = ({ method, value }: LimitConfig, slope: number, rem: number) => {
  return method === "size" ? value : getSizeAtView(value, slope, rem);
};

export const getLimitedSize = ({ size, limit = [null, null] }: LimitedSizeConfig) => {
  const [minSizeConfig, maxSizeConfig] = limit;

  return Result.ok<LimitedSizeData>({
    ...size,
    min: minSizeConfig ? getSizeLimit(minSizeConfig, size.slope, size.rem) : null,
    max: maxSizeConfig ? getSizeLimit(maxSizeConfig, size.slope, size.rem) : null,
  });
};

export const getSizeCSSValueFromScalingPart = ({
  min,
  max,
  scalingPart,
}: Omit<LimitedSizeData, "rem" | "vw" | "slope"> & { scalingPart: string }) => {
  if (min === null && max === null) return Result.ok(`calc(${scalingPart})` as const);
  if (max === null) return Result.ok(`max(${min}rem, ${scalingPart})` as const);
  if (min === null) return Result.ok(`min(${max}rem, ${scalingPart})` as const);
  return Result.ok(`clamp(${min}rem, ${scalingPart}, ${max}rem)` as const);
};

export const getSizeCSSValue = ({ rem, vw, min, max }: Omit<LimitedSizeData, "slope">) => {
  const scalingPart = `${rem}rem + ${vw}vw`;
  return getSizeCSSValueFromScalingPart({ scalingPart, min, max });
};
