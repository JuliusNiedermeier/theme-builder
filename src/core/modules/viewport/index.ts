import { ModuleRunner } from "@/core";
import { array, InferInput, number, object, string } from "valibot";

export type ViewportModuleConfig = InferInput<
  typeof viewportModuleConfigSchema
>;

export const viewportModuleConfigSchema = object({
  breakpoints: array(object({ name: string(), width: number() })),
});

export const runViewportModule = ((config) => {
  config; // To silence eslint unused variable error
  return { breakpoints: [] };
}) satisfies ModuleRunner;
