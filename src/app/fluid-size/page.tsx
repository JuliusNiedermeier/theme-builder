"use client";

import { create } from "zustand";
import { Input } from "../_components/input";
import { cn } from "../_utils/cn";
import { ReactNode } from "react";
import {
  ArrowRightToLineIcon,
  InfinityIcon,
  TextCursorIcon,
} from "lucide-react";
import { getFluidCSSSizeValue } from "@/core/utils/create-css-size-value";

interface HandleConfig {
  size: number;
  viewport: number;
}

interface BaseLimitConfig {
  type: "no-limit" | "handle";
}

interface CustomLimitConfig {
  type: "custom";
  size: number;
}

type LimitConfig = BaseLimitConfig | CustomLimitConfig;

interface SizeConfig {
  maximum: LimitConfig;
  large: HandleConfig;
  small: HandleConfig;
  minimum: LimitConfig;
}

export interface SizeStore {
  config: SizeConfig;

  updateMaximum: (config: LimitConfig) => void;
  updateLarge: (config: HandleConfig) => void;
  updateSmall: (config: HandleConfig) => void;
  updateMinimum: (config: LimitConfig) => void;
}

export const useSize = create<SizeStore>((set, get) => ({
  config: {
    maximum: { type: "custom", size: 30 },
    large: { size: 16, viewport: 80 },
    small: { size: 4, viewport: 60 },
    minimum: { type: "custom", size: 2 },
  },

  updateMaximum: (config) => {
    set((state) => ({ config: { ...state.config, maximum: config } }));
  },

  updateLarge: (config) => {
    set((state) => ({ config: { ...state.config, large: config } }));
  },

  updateSmall: (config) => {
    set((state) => ({ config: { ...state.config, small: config } }));
  },

  updateMinimum: (config) => {
    set((state) => ({ config: { ...state.config, minimum: config } }));
  },
}));

interface BaseRow {
  title: string;
  color: `bg-neutral-${string}`;
}

interface HandleRow extends BaseRow {
  type: "handle";
  config: HandleConfig;
  limitConfig: LimitConfig;
  updateConfig: (config: HandleConfig) => void;
}

interface LimitRow extends BaseRow {
  type: "limit";
  config: LimitConfig;
  handleConfig: HandleConfig;
  updateConfig: (config: LimitConfig) => void;
}

type Row = HandleRow | LimitRow;

interface LimitTypeOption {
  key: LimitConfig["type"];
  icon: ReactNode;
}

const limitTypes = [
  { key: "no-limit", icon: <InfinityIcon size={16} /> },
  { key: "handle", icon: <ArrowRightToLineIcon size={16} /> },
  { key: "custom", icon: <TextCursorIcon size={16} /> },
] satisfies LimitTypeOption[];

export default function FluidSizePage() {
  const size = useSize();

  const rows = [
    {
      title: "Maximum",
      type: "limit",
      config: size.config.maximum,
      handleConfig: size.config.large,
      color: "bg-neutral-200",
      updateConfig: size.updateMaximum,
    },
    {
      title: "Large",
      type: "handle",
      config: size.config.large,
      limitConfig: size.config.maximum,
      color: "bg-neutral-300",
      updateConfig: size.updateLarge,
    },
    {
      title: "Small",
      type: "handle",
      config: size.config.small,
      limitConfig: size.config.minimum,
      color: "bg-neutral-800",
      updateConfig: size.updateSmall,
    },
    {
      title: "Minimum",
      type: "limit",
      config: size.config.minimum,
      handleConfig: size.config.small,
      color: "bg-neutral-900",
      updateConfig: size.updateMinimum,
    },
  ] satisfies Row[];

  const fluidCSSSizeValue = getFluidCSSSizeValue({
    sizeRange: [size.config.small.size, size.config.large.size],
    viewRange: [size.config.small.viewport, size.config.large.viewport],
    limit: [
      size.config.minimum.type === "no-limit"
        ? null
        : size.config.minimum.type === "handle"
        ? { method: "fixed-size", value: size.config.small.size }
        : size.config.minimum.type === "custom"
        ? { method: "fixed-size", value: size.config.minimum.size }
        : null,
      size.config.maximum.type === "no-limit"
        ? null
        : size.config.maximum.type === "handle"
        ? { method: "fixed-size", value: size.config.large.size }
        : size.config.maximum.type === "custom"
        ? { method: "fixed-size", value: size.config.maximum.size }
        : null,
    ],
  });

  return (
    <div className="h-screen flex flex-col divide-y">
      <div className="flex-1 grid grid-rows-4 divide-y relative">
        <div
          className="absolute top-0 bottom-0 left-0 border-r"
          style={{ width: fluidCSSSizeValue }}
        />
        {rows.map((row, index) => {
          const rowSize =
            row.type === "handle"
              ? row.config.size
              : row.config.type === "no-limit"
              ? 0
              : row.config.type === "handle"
              ? row.handleConfig.size
              : row.config.type === "custom"
              ? row.config.size
              : 0;

          return (
            <div
              key={index}
              className="w-full grid grid-cols-[1fr_15rem] divide-x"
            >
              <div>
                <div
                  className={`h-full w-1/2 ${row.color}`}
                  style={{
                    width: `${rowSize}rem`,
                  }}
                />
              </div>
              <div className="flex flex-col justify-end gap-2 p-4">
                <span className="font-medium">{row.title}</span>
                {row.type === "handle" ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      step={0.1}
                      value={row.config.size}
                      onChange={(el) =>
                        row.updateConfig({
                          ...row.config,
                          size: Number(el.currentTarget.value),
                        })
                      }
                    />
                    <Input
                      type="number"
                      step={0.1}
                      value={row.config.viewport}
                      onChange={(el) =>
                        row.updateConfig({
                          ...row.config,
                          viewport: Number(el.currentTarget.value),
                        })
                      }
                    />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      {limitTypes.map((type, index) => (
                        <button
                          key={index}
                          className={cn(
                            "rounded p-2 flex justify-center items-center",
                            {
                              "bg-neutral-200 hover:bg-neutral-100":
                                type.key !== row.config.type,
                              "bg-neutral-900 text-white":
                                type.key === row.config.type,
                            }
                          )}
                          onClick={() =>
                            row.updateConfig(
                              type.key !== "custom"
                                ? { ...row.config, type: type.key }
                                : {
                                    ...row.config,
                                    type: "custom",
                                    size: row.handleConfig.size,
                                  }
                            )
                          }
                        >
                          {type.icon}
                        </button>
                      ))}
                    </div>
                    {row.config.type === "custom" && (
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          step={0.1}
                          value={row.config.size}
                          onChange={(el) =>
                            row.updateConfig({
                              type: "custom",
                              size: Number(el.currentTarget.value),
                            })
                          }
                        />
                        <Input
                          type="number"
                          step={0.1 * 2}
                          value={row.config.size * 2}
                          onChange={(el) =>
                            row.updateConfig({
                              type: "custom",
                              size: Number(el.currentTarget.value) / 2,
                            })
                          }
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-2">{fluidCSSSizeValue}</div>
    </div>
  );
}
