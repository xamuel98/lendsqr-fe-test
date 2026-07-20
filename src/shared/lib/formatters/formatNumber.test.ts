import { formatNumber } from "./formatNumber";

describe("formatNumber", () => {
  it("formats whole numbers for readability", () => {
    expect(formatNumber(2453)).toBe("2,453");
    expect(formatNumber(102453)).toBe("102,453");
  });
});
