import { safeJsonParse } from ".";

test("Test if JSON is valid", () => {
    const value = {foo: "bar"};
    expect(safeJsonParse(JSON.stringify(value))).toHaveProperty("foo");
});


test("Test if JSON is invalid", () => {
    expect(safeJsonParse("invalid json")).toBe(false);
});