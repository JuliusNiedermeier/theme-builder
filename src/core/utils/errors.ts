export const createModuleError = <ErrorCode extends string>(
  moduleName: string
) => {
  return class ModuleValidationError extends Error {
    constructor(public code: ErrorCode) {
      super(code);
      this.name = `${moduleName}ValidationError`;
    }
  };
};
