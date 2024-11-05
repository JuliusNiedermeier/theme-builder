import { InferInput, object } from "valibot";
import { runSizeModule, sizeModuleConfigSchema } from "./modules/size";
import {
  runViewportModule,
  viewportModuleConfigSchema,
} from "./modules/viewport";

export type ThemeConfig = InferInput<typeof themeConfigSchema>;

export type ModuleRunner<Result = object> = (config: ThemeConfig) => Result;

export type Module<Result = object> = (config: ThemeConfig) => Result;

export const themeConfigSchema = object({
  viewport: viewportModuleConfigSchema,
  size: sizeModuleConfigSchema,
});

export const safelyRunThemeModules = (config: ThemeConfig) => {
  return {
    viewport: runViewportModule(config),
    size: runSizeModule(config),
  } satisfies Record<keyof ThemeConfig, ReturnType<Module>>;
};
