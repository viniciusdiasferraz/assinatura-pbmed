export function maskCardNumber(value: string) {
  const numbersOnly = value.replace(/\D/g, "");
  const limited = numbersOnly.slice(0, 19);
  return limited.replace(/(.{4})/g, "$1 ").trim();
}

export function maskCPF(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function maskExpirationDate(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1/$2")
    .slice(0, 5);
}

export function maskCVV(value: string) {
  return value.replace(/\D/g, "").slice(0, 4);
}
