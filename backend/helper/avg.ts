export const average = <T>(
  items: T[],
  selector: (item: T) => number
): number => {
  if (items.length === 0) return 0;
  return items.reduce((sum, item) => sum + selector(item), 0) / items.length;
};
