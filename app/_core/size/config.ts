import { DeepPartial } from "@/app/_utils/types";
import deepmerge from "deepmerge";
import { resolveSizeConfig } from "./resolve-config";

export type LimitType = (typeof limitTypes)[number];

export interface LimitConfig {
  type: LimitType;
  view: number | null;
  size: number | null;
}

export interface ControlPointConfig {
  view: number;
  size: number;
  limit: LimitConfig;
}

export interface SizeConfig {
  narrow: ControlPointConfig;
  wide: ControlPointConfig;
}

export type ControlPointKey = keyof SizeConfig;

export const defaultConfig: SizeConfig = {
  narrow: {
    size: 2,
    view: 30,
    limit: { type: "control-point", size: null, view: null },
  },
  wide: {
    size: 6,
    view: 90,
    limit: { type: "control-point", size: null, view: null },
  },
};

if (!resolveSizeConfig(defaultConfig).ok) {
  throw new Error(`Failed to resolve default size config`);
}

export const limitTypes = ["no-limit", "control-point", "custom-view", "custom-size"] as const;

export const mutate = (config: SizeConfig, changes: DeepPartial<SizeConfig>) => {
  const newConfig = deepmerge<SizeConfig, DeepPartial<SizeConfig>>(config, changes);
  return resolveSizeConfig(newConfig).ok ? newConfig : config;
};
