import { z } from "zod";
import { isValidCardNumber, isValidCPF } from "./validators";

export const cardSchema = z.object({
  planId: z.union([z.string(), z.number()]),
  paymentMethod: z.enum(["credit_card", "boleto"]),
  cardNumber: z
    .string()
    .nonempty("Campo obrigatório")
    .refine((val) => /^\d+$/.test(val.replace(/\s/g, "")), {
      message: "Número do cartão deve conter apenas números",
    })
    .refine((val) => val.replace(/\s/g, "").length >= 13 && val.replace(/\s/g, "").length <= 19, {
      message: "Número do cartão deve ter entre 13 e 19 dígitos",
    })
    .refine((val) => isValidCardNumber(val), {
      message: "Número do cartão inválido",
    }),
  holder: z.string().min(2, "Campo obrigatório"),
  expirationDate: z
    .string()
    .nonempty("Campo obrigatório")
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Formato inválido. Use MM/AA"),
  CVV: z
    .string()
    .nonempty("Campo obrigatório")
    .regex(/^\d{3,4}$/, "CVV inválido. Use 3 ou 4 dígitos"),
  cardCpf: z
    .string()
    .nonempty("Campo obrigatório")
    .transform((val) => val.replace(/\D/g, ""))
    .refine((value) => value.length === 11, "CPF deve ter 11 números")
    .refine((value) => isValidCPF(value), "CPF inválido"),
  installments: z.number().optional(),
  couponCode: z.string().nullable().optional(),
  selectedPlanInstallments: z.number().optional(),
});

export type CardForm = z.infer<typeof cardSchema>;
