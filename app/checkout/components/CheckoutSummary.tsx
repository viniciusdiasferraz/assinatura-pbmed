"use client";

import { Check, Tag, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { CardForm } from "../helpers/schema";

type CheckoutSummaryProps = {
  form: UseFormReturn<CardForm>;
  subtotal: number;
  total: number;
  selectedPlan?: import("../types/plan").Plan | null;
  selectedInstallments: number;
  submitting: boolean;
  handleApplyCoupon: (code: string) => Promise<boolean>;
  handleRemoveCoupon: () => void;
};
export function CheckoutSummary({
  form,
  subtotal,
  total,
  selectedPlan,
  selectedInstallments,
  submitting,
  handleApplyCoupon,
  handleRemoveCoupon,
}: CheckoutSummaryProps) {
  const [showCouponInput, setShowCouponInput] = useState(false);

  return (
    <div className="flex items-stretch justify-between gap-6 w-full">
      <div className="w-full lg:max-w-sm">
        <h4 className="text-xl font-semibold mb-4">Resumo</h4>

        <div className="p-5 lg:p-6 xl:p-8 rounded-xl border border-gray-200 bg-[#FAFAFA]">
          <div className="flex items-center p-3 rounded-lg border border-gray-200 mb-6 bg-white">
            <div className="flex items-center justify-center mr-3">
              <Image src="/avatar.svg" alt="Avatar" width={40} height={40} />
            </div>
            <div>
              <p className="text-sm font-bold">Conteúdos Premium</p>
              <p className="text-sm font-normal text-muted-foreground">Renovação anual</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <p className="text-sm font-normal text-muted-foreground">Pagamento</p>
              <p className="font-normal text-sm">Cartão de crédito</p>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm font-normal text-muted-foreground">Subtotal</p>
              <p className="font-normal text-sm">{subtotal > 0 ? `R$ ${subtotal.toFixed(2)}` : "R$ -"}</p>
            </div>

            {selectedPlan?.discountPercentage && (
              <div className="flex justify-between items-center">
                <p className="text-sm font-normal text-muted-foreground">
                  Desconto - {selectedPlan.discountPercentage}%
                </p>
                <span className="px-4 py-1 text-sm font-semibold text-[#1A4C00] bg-[#BFE1AB] rounded-sm">
                  - R${selectedPlan.discountAmmount?.toFixed(2)}
                </span>
              </div>
            )}

            {selectedPlan?.acceptsCoupon &&
              (!showCouponInput ? (
                <Button
                  type="button"
                  disabled={submitting}
                  onClick={() => {
                    setShowCouponInput(true);
                    form.setValue("couponCode", null);
                    form.clearErrors("couponCode");
                  }}
                  className="w-full h-10 mt-6 flex items-center justify-center gap-2 font-medium text-sm rounded-full border border-[#191847] text-[#191847] bg-transparent hover:bg-[#191847]/10 transition duration-150 shadow-none disabled:opacity-60 cursor-pointer"
                >
                  <Tag size={16} className="text-[#191847]" />
                  Tem um cupom de desconto?
                </Button>
              ) : (
                <div className="mt-6 w-full border border-gray-200 p-5 rounded-xl space-y-4 bg-white shadow-sm">
                  <FormField
                    control={form.control}
                    name="couponCode"
                    render={({ field }) => {
                      const hasError = !!form.formState.errors.couponCode;
                      return (
                        <FormItem className="gap-2">
                          <FormLabel className="text-sm font-medium">Preencha o código</FormLabel>
                          <p className="text-sm font-normal text-muted-foreground">
                            Limitado a um cupom por contratação
                          </p>

                          <FormControl>
                            <div className="flex flex-col gap-4">
                              <Input
                                {...field}
                                value={field.value ?? ""}
                                placeholder="Digite seu cupom"
                                className={`flex-1 placeholder:text-base placeholder:text-[#B0B0B1] border-0 border-b ${
                                  hasError ? "border-red-500 text-red-600" : "border-gray-300 focus:border-[#0051D1]"
                                } rounded-none focus-visible:ring-0 p-0 pb-1`}
                              />

                              <div className="flex items-center justify-between gap-3 p-3 rounded-lg">
                                <Button
                                  type="button"
                                  onClick={() => {
                                    setShowCouponInput(false);
                                    form.setValue("couponCode", null);
                                    form.clearErrors("couponCode");
                                    handleRemoveCoupon();
                                  }}
                                  className="flex-1 h-10 px-3 font-medium text-sm rounded-full border-none text-[#191847] bg-transparent hover:bg-[#191847]/10 transition duration-150 cursor-pointer"
                                >
                                  Cancelar
                                </Button>

                                <Button
                                  type="button"
                                  onClick={async () => {
                                    const code = String(form.getValues("couponCode") ?? "").trim();
                                    if (!code) {
                                      form.setError("couponCode", {
                                        type: "manual",
                                        message: "Informe o código",
                                      });
                                      return;
                                    }

                                    const ok = await handleApplyCoupon(code);
                                    if (!ok) {
                                      form.setError("couponCode", {
                                        type: "manual",
                                        message: "Cupom inválido",
                                      });
                                      toast.custom((t) => (
                                        <div className="flex items-center gap-4 p-4 bg-[#FFF2F0] text-[#A92A14] rounded-xl whitespace-nowrap">
                                          <Image src="/shape.svg" alt="Warning Icon" width={16} height={16} />
                                          <p className="text-sm font-medium">Cupom inválido</p>
                                          <button
                                            type="button"
                                            onClick={() => toast.dismiss(t)}
                                            className="text-muted-foreground cursor-pointer mr-3"
                                          >
                                            <X size={16} />
                                          </button>
                                        </div>
                                      ));
                                      return;
                                    }

                                    form.clearErrors("couponCode");
                                    toast.custom((t) => (
                                      <div className="flex items-center gap-4 p-4 bg-[#E6F6FF] text-[#0B5FFF] rounded-xl whitespace-nowrap">
                                        <p className="text-sm font-medium">Cupom aplicado: {code}</p>
                                        <button
                                          type="button"
                                          onClick={() => toast.dismiss(t)}
                                          className="text-muted-foreground cursor-pointer mr-3"
                                        >
                                          <X size={16} />
                                        </button>
                                      </div>
                                    ));
                                  }}
                                  className="flex-1 h-10 px-3 rounded-full bg-[#191847] text-white font-medium text-sm hover:bg-[#191847]/90 cursor-pointer transition"
                                >
                                  <Check className="size-6" />
                                  Aplicar cupom
                                </Button>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              ))}

            <Separator />

            <div className="flex justify-between items-center pt-2">
              <p className="text-sm font-bold">Total</p>
              <p className="text-sm font-bold">{total > 0 ? `R$ ${total.toFixed(2).replace(".", ",")}` : "R$ -"}</p>
            </div>

            {selectedInstallments > 0 && selectedPlan && (
              <div className="flex flex-col items-end gap-2">
                <p className="text-base font-bold">
                  {selectedInstallments > 1
                    ? `${selectedInstallments}x de R$ ${(total / selectedInstallments).toFixed(2).replace(".", ",")}`
                    : `${selectedInstallments}x de R$ ${total.toFixed(2).replace(".", ",")}`}
                </p>

                <p className="text-sm text-muted-foreground font-normal">
                  Total de R$ {total.toFixed(2).replace(".", ",")} - sem juros
                </p>
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full h-10 mt-4 lg:mt-6 bg-[#191847] cursor-pointer text-white font-medium text-sm rounded-full hover:bg-indigo-800 transition duration-150 shadow-md"
        >
          {submitting ? "Concluindo..." : "Concluir assinatura"}
        </Button>
      </div>
    </div>
  );
}
