import { Result } from "@/app/_utils/result";
import { getSize, getSizeCSSValue, getSizeAtView, getLimitedSize, LimitedSizeData } from "./calculation";
import { ControlPointConfig } from "./config";
import { SizeConfig } from "./config";

export interface ResolvedControlPoint extends Omit<ControlPointConfig, "limit"> {
  limit: number | null;
}

export interface ResolvedSize extends LimitedSizeData {
  css: string;
  controlPoints: {
    narrow: ResolvedControlPoint;
    wide: ResolvedControlPoint;
  };
}

const resolveControlPointConfig = (controlPointConfig: ControlPointConfig, slope: number, rem: number) => {
  let limit: ResolvedControlPoint["limit"] = null;

  if (controlPointConfig.limit.type === "control-point") limit = controlPointConfig.size;

  if (controlPointConfig.limit.type === "custom-view") {
    if (controlPointConfig.limit.view === null) limit = controlPointConfig.size;
    else limit = getSizeAtView(controlPointConfig.limit.view, slope, rem);
  }

  if (controlPointConfig.limit.type === "custom-size") {
    if (controlPointConfig.limit.size === null) limit = controlPointConfig.size;
    else limit = controlPointConfig.limit.size;
  }

  return Result.ok<ResolvedControlPoint>({ ...controlPointConfig, limit });
};

export const resolveSizeConfig = (config: SizeConfig) => {
  const size = getSize([config.narrow.size, config.wide.size], [config.narrow.view, config.wide.view]);
  if (!size.ok) return Result.error(size.error);

  const narrowControlPointData = resolveControlPointConfig(config.narrow, size.data.slope, size.data.rem);
  const wideControlPointData = resolveControlPointConfig(config.wide, size.data.slope, size.data.rem);

  const convertLimit = (limit: number | null) => {
    if (limit === null) return null;
    return { method: "size" as const, value: limit };
  };

  const limitedSize = getLimitedSize({
    size: size.data,
    limit: [convertLimit(narrowControlPointData.data.limit), convertLimit(wideControlPointData.data.limit)],
  });

  if (!limitedSize.ok) return Result.error(limitedSize.error);

  const css = getSizeCSSValue(limitedSize.data);
  if (!css.ok) return Result.error(css.error);

  return Result.ok<ResolvedSize>({
    ...limitedSize.data,
    css: css.data,
    controlPoints: {
      narrow: narrowControlPointData.data,
      wide: wideControlPointData.data,
    },
  });
};
