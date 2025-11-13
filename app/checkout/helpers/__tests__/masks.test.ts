import { maskCardNumber, maskCPF, maskCVV, maskExpirationDate } from "../masks";

describe("masks", () => {
  it("maskCardNumber should group digits into blocks of 4 and trim", () => {
    expect(maskCardNumber("5359402430066179")).toBe("5359 4024 3006 6179");
    expect(maskCardNumber("5359 4024 3006 6179")).toBe("5359 4024 3006 6179");
    expect(maskCardNumber("12345678901234567890")).toBe("1234 5678 9012 3456 789");
  });

  it("maskCPF should format to 000.000.000-00", () => {
    expect(maskCPF("49302810836")).toBe("493.028.108-36");
    expect(maskCPF("493.028.108-36")).toBe("493.028.108-36");
    expect(maskCPF("49302810836aaaa")).toBe("493.028.108-36");
  });

  it("maskExpirationDate should format to MM/YY and limit length", () => {
    expect(maskExpirationDate("1127")).toBe("11/27");
    expect(maskExpirationDate("11/27")).toBe("11/27");
    expect(maskExpirationDate("111111")).toBe("11/11");
  });

  it("maskCVV should keep only digits and limit to 4", () => {
    expect(maskCVV("123")).toBe("123");
    expect(maskCVV("1234")).toBe("1234");
    expect(maskCVV("12345a")).toBe("1234");
  });
});
