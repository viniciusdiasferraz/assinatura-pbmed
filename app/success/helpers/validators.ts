export const formatCPF = (cpf: string) => {
  if (!cpf) return "—";
  const cleaned = cpf.replace(/\D/g, "");
  if (cleaned.length !== 11) return cpf;
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

export const getPeriodLabel = (period: string) => {
  switch (period) {
    case "annually":
      return "Assinatura anual*";
    case "monthly":
      return "Assinatura mensal*";
    default:
      return "Modalidade desconhecida*";
  }
};
