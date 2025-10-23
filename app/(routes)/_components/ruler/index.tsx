"use client";

import { cn } from "@/app/_utils/cn";
import { ComponentProps, FC, useEffect } from "react";
import { useMeasure } from "@uidotdev/usehooks";
import { findSmallestTickRes } from "./tick-resolution";
import { useSizeCollection } from "../../_state/size-store";
import { getClosestDevice } from "../../_utils/device-list";

const minPxPerTick = 50;

export interface Props extends ComponentProps<"div"> {}

export const Ruler: FC<Props> = ({ className, ...restProps }) => {
  const simulatedView = useSizeCollection((state) => state.simulatedView);
  const setSimulatedView = useSizeCollection((state) => state.mutateSimulatedView);

  const [containerRef, { width }] = useMeasure();

  const data = (() => {
    if (width === null || simulatedView === null) return null;

    const pxPerSimPx = width / simulatedView;
    const minSimPxPerTick = minPxPerTick / pxPerSimPx;
    const simPxPerTick = findSmallestTickRes(minSimPxPerTick);
    const pxPerTick = simPxPerTick * pxPerSimPx;
    const lineCount = Math.floor(width / pxPerTick);

    const lines = Array.from(new Array(lineCount), (_, i) => ({
      x: (i + 1) * pxPerTick,
    }));

    return {
      pxPerSimPx,
      minSimPxPerTick,
      simPxPerTick,
      pxPerTick,
      lineCount,
      lines,
    };
  })();

  const handleWheel = (e: WheelEvent) => {
    if (!e.shiftKey) return;
    setSimulatedView(simulatedView === null ? null : simulatedView + e.deltaY);
  };

  useEffect(() => {
    addEventListener("wheel", handleWheel);
    return () => removeEventListener("wheel", handleWheel);
  }, [simulatedView]);

  useEffect(() => {
    if (simulatedView !== null) return;
    setSimulatedView(width);
  }, [simulatedView, width]);

  return (
    <div className={cn("w-full h-6 bg-card border-b flex", className)} {...restProps}>
      <div ref={containerRef} className="flex-1 relative h-full overflow-hidden">
        {data &&
          data.lines.map((line, index) => (
            <div
              key={index}
              className="absolute bottom-0 left-0 grid grid-rows-[min-content_min_content] gap-1 justify-items-center"
              style={{
                width: minPxPerTick,
                translate: line.x - minPxPerTick / 2,
              }}
            >
              <span className="text-xs text-muted-foreground">{data.simPxPerTick * (index + 1)}</span>
              <div className="h-1 w-px bg-muted-foreground" />
            </div>
          ))}
        <div className="absolute top-0 bottom-0 right-0 w-20 bg-linear-to-r from-card/0 to-card" />
      </div>
      <div className="w-px bg-blue-500 relative">
        <div className="absolute top-0 bottom-0 left-0 w-6 bg-blue-500/10 -translate-x-1/2" />
      </div>
      <div className="text-xs pl-6 pr-4 grid place-content-center">{simulatedView?.toFixed(0)}px</div>
      <div className="text-xs px-4 border-l w-40 grid items-center">
        <span className="whitespace-nowrap overflow-hidden text-ellipsis">
          {simulatedView !== null && getClosestDevice(simulatedView).key}
        </span>
      </div>
    </div>
  );
};
