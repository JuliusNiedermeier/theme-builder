import { ModuleRunner } from "@/core";
import {
  array,
  object,
  InferInput,
  string,
  pipe,
  minLength,
  literal,
  number,
  variant,
  union,
} from "valibot";

export type SizeModuleConfig = InferInput<typeof sizeModuleConfigSchema>;

const baseSizeConfigSchema = object({
  name: pipe(string(), minLength(1, "error:size-name-too-short")),
});

const sizeValueConfigSchema = number("error:size-value-type-mismatch");

const staticSizeConfigSchema = object({
  ...baseSizeConfigSchema.entries,
  type: literal("static", "error:unknown-size-type"),
  size: sizeValueConfigSchema,
});

const fluidSizeConfigSchema = object({
  ...baseSizeConfigSchema.entries,
  type: literal("fluid", "error:unknown-size-type"),
  size: union([sizeValueConfigSchema, sizeValueConfigSchema]),
});

const sizeConfigSchema = variant("type", [
  staticSizeConfigSchema,
  fluidSizeConfigSchema,
]);

export const sizeModuleConfigSchema = object({
  sizes: array(object({ name: string(), value: sizeConfigSchema })),
});

export const runSizeModule = ((config) => {
  config; // To silence eslint unused variable error
  return { sizes: [] };
}) satisfies ModuleRunner;
