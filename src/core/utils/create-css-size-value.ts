export type NumberRange = [number, number];
export type OptionalNumberRange = [number | null, number | null];

export interface SizeLimitConfig {
  method: "fixed-size" | "view-based";
  value: number;
}

export interface FluidCSSSizeValueConfig {
  sizeRange: NumberRange;
  viewRange: NumberRange;
  limit?: [SizeLimitConfig | null, SizeLimitConfig | null];
}

export interface FluidSizeData {
  slope: number;
  rem: number;
  vw: number;
}

export const getFluidSize = (
  [smSize, lgSize]: NumberRange,
  [smView, lgView]: NumberRange
): FluidSizeData => {
  const inputValues = [smSize, lgSize, smView, lgView];

  if (inputValues.some((value) => !Number.isFinite(value))) {
    throw new Error("All parameters must be finite numbers");
  }

  if (inputValues.some((value) => value <= 0)) {
    throw new Error(
      "All size and viewport width values must be positive numbers"
    );
  }

  if (smView >= lgView) {
    throw new Error(
      "Small viewport width must be less than large viewport width"
    );
  }

  if (smSize > lgSize) {
    throw new Error("Small size must be less than or equal to large size");
  }

  // Calculate the slope (change in size per pixel of viewport width)
  const slope: number = (lgSize - smSize) / (lgView - smView);

  // Calculate the rem offset (y-intercept of the linear equation)
  const rem: number = parseFloat((smSize - slope * smView).toFixed(4));

  // Convert slope to vw units (multiply by 100 since 1vw = viewport width / 100)
  const vw: number = parseFloat((slope * 100).toFixed(4));

  return { slope, rem, vw };
};

export const getSizeAtView = (view: number, slope: number, rem: number) => {
  return view * slope + rem;
};

export const getSizeLimit = (
  { method, value }: SizeLimitConfig,
  slope: number,
  rem: number
) => {
  return method === "fixed-size" ? value : getSizeAtView(value, slope, rem);
};

export const getFluidCSSSizeValue = ({
  sizeRange,
  viewRange,
  limit = [null, null],
}: FluidCSSSizeValueConfig) => {
  const { rem, vw, slope } = getFluidSize(sizeRange, viewRange);
  const scalingPart = `${rem}rem + ${vw}vw`;

  const [minSizeConfig, maxSizeConfig] = limit;

  if (!maxSizeConfig && !minSizeConfig) return `calc(${scalingPart})` as const;

  if (!maxSizeConfig) {
    const minSizeLimit = getSizeLimit(minSizeConfig!, slope, rem);
    return `min(${minSizeLimit}rem, ${scalingPart})` as const;
  }

  if (!minSizeConfig) {
    const maxSizeLimit = getSizeLimit(maxSizeConfig, slope, rem);
    return `max(${maxSizeLimit}rem, ${scalingPart})` as const;
  }

  const [minSizeLimit, maxSizeLimit] = [
    getSizeLimit(minSizeConfig, slope, rem),
    getSizeLimit(maxSizeConfig, slope, rem),
  ];

  return `clamp(${minSizeLimit}rem, ${scalingPart}, ${maxSizeLimit}rem)` as const;
};

export const getStaticCSSSizeValue = (size: number) =>
  `${parseFloat(size.toFixed(4))}rem` as const;

export type CSSSizeValueFluidConfig = Pick<
  FluidCSSSizeValueConfig,
  "viewRange" | "limit"
>;
