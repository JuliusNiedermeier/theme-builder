export const parseNumber = (value: string) => {
  const numeric = Number(value);
  if (isNaN(numeric)) return null;
  return numeric;
};
