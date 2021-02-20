export default function alwaysArray<T>(items: T | T[]): T[] {
  if (Array.isArray(items)) {
    return items;
  }
  return [items];
}
