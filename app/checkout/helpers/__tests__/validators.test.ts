import { isValidCardNumber, isValidCPF } from "../validators";

describe("validators (checkout)", () => {
  it("isValidCPF should validate correct CPFs and reject invalid ones", () => {
    expect(isValidCPF("935.411.347-80")).toBe(true);
    expect(isValidCPF("49302810836")).toBe(true);

    expect(isValidCPF("111.111.111-11")).toBe(false);
    expect(isValidCPF("123.456.789-00")).toBe(false);
    expect(isValidCPF("123")).toBe(false);
  });

  it("isValidCardNumber should validate Luhn and ranges", () => {
    expect(isValidCardNumber("4539 5787 6362 1486")).toBe(true);
    expect(isValidCardNumber("abcd efgh ijkl mnop")).toBe(false);
    expect(isValidCardNumber("1234 5678")).toBe(false);
    expect(isValidCardNumber("4111 1111 1111 1112")).toBe(false);
  });
});
