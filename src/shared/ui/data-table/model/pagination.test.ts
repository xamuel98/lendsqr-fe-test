import { getPageRange } from "./pagination";

describe("getPageRange", () => {
  it("returns compact, duplicate-free ranges at the start, middle, and end", () => {
    expect(getPageRange(1, 16)).toEqual([1, 2, 3, "ellipsis-end", 15, 16]);
    expect(getPageRange(8, 16)).toEqual([
      1,
      2,
      "ellipsis-start",
      7,
      8,
      9,
      "ellipsis-end",
      15,
      16
    ]);
    expect(getPageRange(16, 16)).toEqual([1, 2, "ellipsis-start", 14, 15, 16]);
    expect(getPageRange(1, 1)).toEqual([1]);
  });
});
