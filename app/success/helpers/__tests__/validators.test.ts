import { formatCPF, getPeriodLabel } from "../validators";

describe("validators (success)", () => {
  it("formatCPF formats valid CPFs and keeps invalid as-is", () => {
    expect(formatCPF("49302810836")).toBe("493.028.108-36");
    expect(formatCPF("")).toBe("—");
    expect(formatCPF("123")).toBe("123");
  });

  it("getPeriodLabel maps period codes to labels", () => {
    expect(getPeriodLabel("annually")).toBe("Assinatura anual*");
    expect(getPeriodLabel("monthly")).toBe("Assinatura mensal*");
    expect(getPeriodLabel("unknown")).toBe("Modalidade desconhecida*");
  });
});


