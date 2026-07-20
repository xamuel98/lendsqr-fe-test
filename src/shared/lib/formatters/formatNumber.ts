const defaultNumberFormatter = new Intl.NumberFormat("en-US");

export function formatNumber(value: number) {
  return defaultNumberFormatter.format(value);
}
