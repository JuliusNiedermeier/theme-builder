import {
  getFluidCSSSizeValue,
  NumberRange,
} from "@/core/utils/create-css-size-value";
import { create } from "zustand";

export interface ThemeSize {
  name: string;
  sizeValue: string;
  sm: number;
  lg: number;
}

export interface ThemeConfig {
  breakpoints: [number, number];
  minMaxView: [number | null, number | null];
  base: NumberRange;
  ratio: NumberRange;
  size: number;
}

export interface ThemeStore {
  config: ThemeConfig;

  updateBreakpoint: (type: "sm" | "lg", width: number) => void;

  updateMinView: (minView: number) => void;
  updateMaxView: (maxView: number) => void;

  setScaleRatio: (scaleRatio: [number, number]) => void;
  setBaseSize: (baseSize: [number, number]) => void;
  setSizeCount: (sizeCount: number) => void;

  getSizes: () => ThemeSize[];
}

export const useTheme = create<ThemeStore>((set, get) => ({
  config: {
    breakpoints: [20, 90],
    minMaxView: [10, 200],
    base: [0.25, 0.25],
    ratio: [1.5, 1.7],
    size: 10,
  },

  updateBreakpoint: (type, width) =>
    set((state) => ({
      config: {
        ...state.config,
        breakpoints:
          type === "sm"
            ? [width, state.config.breakpoints[1]]
            : [state.config.breakpoints[0], width],
      },
    })),

  updateMinView: (minView) =>
    set((state) => ({
      config: {
        ...state.config,
        minMaxView: [minView, state.config.minMaxView[1]],
      },
    })),

  updateMaxView: (maxView) =>
    set((state) => ({
      config: {
        ...state.config,
        minMaxView: [state.config.minMaxView[0], maxView],
      },
    })),

  setScaleRatio: (scaleRatio) =>
    set((state) => ({
      config: {
        ...state.config,
        ratio: scaleRatio,
      },
    })),

  setBaseSize: (baseSize) =>
    set((state) => ({
      config: {
        ...state.config,
        base: baseSize,
      },
    })),

  setSizeCount: (sizeCount) =>
    set((state) => ({
      config: {
        ...state.config,
        size: sizeCount,
      },
    })),

  getSizes: () =>
    Array.from<never[], ThemeSize>(new Array(get().config.size), (_, index) => {
      const [sm, lg] = [
        get().config.base[0] * Math.pow(get().config.ratio[0], index),
        get().config.base[1] * Math.pow(get().config.ratio[1], index),
      ];

      const [minView, maxView] = [
        get().config.minMaxView[0],
        get().config.minMaxView[1],
      ];

      const sizeValue = getFluidCSSSizeValue({
        sizeRange: [sm, lg],
        viewRange: get().config.breakpoints,
        limit: [
          minView ? { method: "view-based", value: minView } : null,
          maxView ? { method: "view-based", value: maxView } : null,
        ],
      });

      return {
        name: `--size-${index + 1}`,
        sizeValue,
        sm,
        lg,
      };
    }),
}));
