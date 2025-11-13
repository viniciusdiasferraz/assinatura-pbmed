import { cardSchema } from "../schema";

describe("cardSchema", () => {
  it("accepts a valid payload", () => {
    const valid = {
      planId: "33",
      paymentMethod: "credit_card" as const,
      cardNumber: "4539 5787 6362 1486",
      holder: "JOAO DA SILVA",
      expirationDate: "11/27",
      CVV: "123",
      cardCpf: "493.028.108-36",
      installments: 1,
      couponCode: null,
      selectedPlanInstallments: 12,
    };
    const parsed = cardSchema.parse(valid);
    expect(parsed.cardCpf).toBe("49302810836");
  });

  it("rejects invalid fields with proper messages", () => {
    const invalid = {
      planId: 33,
      paymentMethod: "credit_card",
      cardNumber: "abcd",
      holder: "A",
      expirationDate: "1322",
      CVV: "12",
      cardCpf: "123",
      installments: 0,
      couponCode: "X",
    };

    const result = cardSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issues = result.error.issues.map((i) => i.message);
      expect(issues.join("|")).toEqual(expect.stringContaining("Número do cartão deve conter apenas números"));
      expect(issues.join("|")).toEqual(expect.stringContaining("Número do cartão deve ter entre 13 e 19 dígitos"));
      expect(issues.join("|")).toEqual(expect.stringContaining("Número do cartão inválido"));
      expect(issues.join("|")).toEqual(expect.stringContaining("Campo obrigatório"));
      expect(issues.join("|")).toEqual(expect.stringContaining("Formato inválido. Use MM/AA"));
      expect(issues.join("|")).toEqual(expect.stringContaining("CVV inválido"));
      expect(issues.join("|")).toEqual(expect.stringContaining("CPF deve ter 11 números"));
    }
  });
});
