export type ErrorThemeValue = {
  hasError: true;
  errors: string[];
  warnings: string[];
};

export type SuccessThemeValue<T> = {
  hasError: false;
  errors: never[];
  warnings: string[];
  value: T;
};

export type ThemeValue<T> = ErrorThemeValue | SuccessThemeValue<T>;

export interface ThemeValueConfig<T> {
  value: T;
  errors: string[];
  warnings: string[];
}

export const createThemeValue = <T>(
  config: ThemeValueConfig<T>
): ThemeValue<T> => {
  const hasError = config.errors.length > 0;

  if (hasError) {
    return {
      hasError,
      errors: config.errors,
      warnings: config.warnings,
    };
  }

  return {
    hasError,
    errors: [],
    warnings: config.warnings,
    value: config.value,
  };
};
