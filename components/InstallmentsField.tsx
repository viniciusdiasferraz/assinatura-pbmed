import { ChevronRight } from "lucide-react";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { CardForm } from "@/app/checkout/helpers/schema";
import type { Plan } from "@/app/checkout/types/plan";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type InstallmentsFieldProps = {
  disabled?: boolean;
  form: UseFormReturn<CardForm>;
  selectedInstallments?: number;
  installments: number[];
  onSelect: (n: number) => void;
  name?: keyof CardForm;
  selectedPlan?: Plan | null;
};

export default function InstallmentsField({
  disabled,
  form,
  selectedInstallments,
  installments,
  onSelect,
  name = "installments",
  selectedPlan,
}: InstallmentsFieldProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState(selectedInstallments);

  const totalBasePrice = selectedPlan?.fullPrice || 0;
  const fixedDiscountAmount = selectedPlan?.discountAmmount || 0;
  const fixedDiscountPercentage = selectedPlan?.discountPercentage || 0;

  const formatPrice = (value: number) => `R$ ${value.toFixed(2).replace(".", ",")}`;

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className="gap-0">
          <FormLabel suppressHydrationWarning className="text-sm font-normal">
            Parcelas
          </FormLabel>

          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                disabled={disabled}
                id="installments-trigger"
                aria-labelledby="installments-label"
                aria-controls="installments-sheet"
                className="flex items-center justify-between w-full border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus:border-blue-600 p-0 py-2 text-left"
              >
                <span className="text-base text-gray-800">
                  {selectedInstallments && selectedInstallments > 0 && selectedPlan
                    ? `${selectedInstallments}x de ${formatPrice(
                        selectedInstallments === 1
                          ? (totalBasePrice - fixedDiscountAmount) / 1
                          : totalBasePrice / selectedInstallments,
                      )}`
                    : "Selecione o número de parcelas"}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </SheetTrigger>

            <SheetContent
              id="installments-sheet"
              side="right"
              className="w-full max-w-sm sm:max-w-md p-0 rounded-s-2xl flex flex-col h-full"
            >
              <SheetHeader className="p-6 pb-1">
                <SheetTitle className="text-xl font-bold">Número de Parcelas</SheetTitle>
                <div className="absolute right-4 top-4"></div>
                <p className="text-sm mt-2 font-normal">
                  Lembre-se, você precisa ter o <span className="font-bold">valor total do plano</span> disponível no
                  limite do cartão para realizar a compra.
                </p>
              </SheetHeader>

              <div className="p-6 overflow-y-auto space-y-3">
                {installments.map((i: number) => {
                  const isOneTimePayment = i === 1;

                  const discountedTotal = totalBasePrice - fixedDiscountAmount;
                  const finalTotal = isOneTimePayment ? discountedTotal : totalBasePrice;
                  const pricePerInstallment = finalTotal / i;

                  return (
                    <label
                      key={i}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors  ${
                        tempSelected === i ? "border-[#0051D1] bg-blue-50/50" : "hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="installmentOption"
                        checked={tempSelected === i}
                        onChange={() => setTempSelected(i)}
                        className="w-5 h-5 mt-1 mr-3 text-[#0051D1] border-gray-300 focus:ring-[#0051D1]"
                      />
                      <div>
                        <p className="text-base font-bold">
                          {i}x de {formatPrice(pricePerInstallment)}
                          {isOneTimePayment && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-[#1A4C00] bg-[#BFE1AB] rounded-xs">
                              {fixedDiscountPercentage}% de desconto
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground font-normal">
                          Total de {formatPrice(finalTotal)} - Sem juros
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="p-6 border-t space-y-3">
                <Button
                  onClick={() => {
                    onSelect(tempSelected || 0);
                    setIsSheetOpen(false);
                  }}
                  disabled={!tempSelected || tempSelected === 0}
                  className="w-full h-10 rounded-full font-semibold cursor-pointer bg-[#0051D1] text-white hover:bg-blue-800 disabled:bg-muted-foreground disabled:opacity-100 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#0051D1]/50"
                >
                  Confirmar
                </Button>

                <Button
                  onClick={() => {
                    setTempSelected(selectedInstallments);
                    setIsSheetOpen(false);
                  }}
                  variant="ghost"
                  className="w-full text-gray-500 hover:bg-gray-50 cursor-pointer"
                >
                  Cancelar
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
