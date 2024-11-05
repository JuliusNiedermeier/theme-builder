"use client";

import { getFluidCSSSizeValue } from "@/core/utils/create-css-size-value";
import { useTheme } from "./state";

export default function Home() {
  const theme = useTheme();

  const sizes = theme.getSizes();

  return (
    <>
      <div className="p-8">
        <div className="max-w-[30rem]">
          <h1 className="text-3xl font-bold">Sizes</h1>
          <p>Configure all sizes.</p>
        </div>
        <div className="flex gap-4 mt-8">
          {/* Breakpoints */}
          {theme.config.breakpoints.map((width, index) => {
            const inputID = `breakpoint-input-${index}`;
            return (
              <div key={index} className="flex flex-col gap-2">
                <label htmlFor={inputID} className="font-medium">
                  {index === 0 ? "sm-view" : "lg-view"}
                </label>
                <input
                  id={inputID}
                  className="font-medium w-24 h-7 px-3 rounded bg-neutral-200 min-w-0 outline-none"
                  type="number"
                  value={width}
                  onChange={(e) =>
                    theme.updateBreakpoint(
                      index === 0 ? "sm" : "lg",
                      Number(e.currentTarget.value)
                    )
                  }
                />
              </div>
            );
          })}

          {/* Min Max View */}
          {(["min", "max"] as const).map((type) => {
            const inputID = `view-input-${type}`;

            const configValue =
              type === "min"
                ? theme.config.minMaxView[0]
                : theme.config.minMaxView[1];

            const breakpointFallbackValue =
              type === "min"
                ? theme.config.breakpoints[0]
                : theme.config.breakpoints[theme.config.breakpoints.length - 1];
            const updateFn =
              type === "min" ? theme.updateMinView : theme.updateMaxView;

            return (
              <div key={type} className="flex flex-col gap-2">
                <label htmlFor={inputID} className="font-medium">
                  {type === "min" ? "min-view" : "max-view"}
                </label>
                <input
                  id={inputID}
                  className="font-medium w-24 h-7 px-3 rounded bg-neutral-200 min-w-0 outline-none"
                  type="number"
                  value={configValue || breakpointFallbackValue || 0}
                  onChange={(e) => updateFn(Number(e.currentTarget.value))}
                />
              </div>
            );
          })}

          {/* Base */}
          {theme.config.base.map((baseSize, index) => {
            const inputID = `base-input-${index}`;
            return (
              <div key={index} className="flex flex-col gap-2">
                <label htmlFor={inputID} className="font-medium">
                  {index === 0 ? "sm-base" : "lg-base"}
                </label>
                <input
                  id={inputID}
                  step="0.01"
                  className="font-medium w-24 h-7 px-3 rounded bg-neutral-200 min-w-0 outline-none"
                  type="number"
                  value={baseSize}
                  onChange={(e) =>
                    theme.setBaseSize(
                      index === 0
                        ? [Number(e.currentTarget.value), theme.config.base[1]]
                        : [theme.config.base[0], Number(e.currentTarget.value)]
                    )
                  }
                />
              </div>
            );
          })}

          {/* Ratio */}
          {theme.config.ratio.map((ratio, index) => {
            const inputID = `ratio-input-${index}`;
            return (
              <div key={index} className="flex flex-col gap-2">
                <label htmlFor={inputID} className="font-medium">
                  {index === 0 ? "sm-ratio" : "lg-ratio"}
                </label>
                <input
                  id={inputID}
                  step="0.01"
                  className="font-medium w-24 h-7 px-3 rounded bg-neutral-200 min-w-0 outline-none"
                  type="number"
                  value={ratio}
                  onChange={(e) =>
                    theme.setScaleRatio(
                      index === 0
                        ? [Number(e.currentTarget.value), theme.config.ratio[1]]
                        : [theme.config.ratio[0], Number(e.currentTarget.value)]
                    )
                  }
                />
              </div>
            );
          })}

          {/* Size Count */}
          <div className="flex flex-col gap-2">
            <label htmlFor="size-count-input" className="font-medium">
              size-count
            </label>
            <input
              id="size-count-input"
              step="1"
              className="font-medium w-24 h-7 px-3 rounded bg-neutral-200 min-w-0 outline-none"
              type="number"
              value={theme.config.size}
              onChange={(e) =>
                theme.setSizeCount(Number(e.currentTarget.value))
              }
            />
          </div>
        </div>
      </div>

      <div className="divide-y border-y">
        {sizes.map((size, index) => {
          const sizeCSSValue = getFluidCSSSizeValue({
            sizeRange: [size.sm, size.lg],
            viewRange: [
              theme.config.breakpoints[0],
              theme.config.breakpoints[theme.config.breakpoints.length - 1],
            ],
          });

          return (
            <div
              key={index}
              className="px-8 flex justify-between items-stretch"
            >
              <input
                className="font-medium flex-[10rem] flex-grow-0 p-4 pl-0 min-w-0 border-e"
                value={size.name}
                readOnly
              />
              <input
                className="font-medium flex-[4rem] flex-grow-0 m-4 h-7 px-3 rounded bg-neutral-200 min-w-0 outline-none"
                value={parseFloat(size.sm.toFixed(2))}
                readOnly
              />
              <div className="flex-1 overflow-hiddenx py-4">
                <div className="relative h-7 rounded-r overflow-hidden bg-white">
                  <div
                    className="absolute h-full bg-neutral-300 rounded"
                    style={{ width: `${size.lg}rem` }}
                  />
                  <div
                    className="absolute h-full bg-neutral-900 rounded"
                    style={{ width: `${size.sm}rem` }}
                  />
                  <div
                    className="absolute size-3 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full mix-blend-difference"
                    style={{ left: sizeCSSValue }}
                  />
                </div>
              </div>
              <input
                className="font-medium flex-[4rem] flex-grow-0 h-7 m-4 px-3 me-0 rounded bg-neutral-200 min-w-0 outline-none"
                value={parseFloat(size.lg.toFixed(2))}
                readOnly
              />
            </div>
          );
        })}
      </div>
      <div className="mt-24 p-8">
        <pre>
          {JSON.stringify(
            sizes.map((size) => [size.name, size.sizeValue]),
            null,
            2
          )}
        </pre>
      </div>
    </>
  );
}
