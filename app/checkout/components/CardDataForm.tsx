"use client";

import { CircleQuestionMark } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { AcceptedBrands } from "@/components/AceptedBrands";
import InstallmentsField from "@/components/InstallmentsField";
import { Card } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { maskCardNumber, maskCPF, maskCVV, maskExpirationDate } from "../helpers/masks";
import type { CardForm } from "../helpers/schema";
import type { Plan } from "../types/plan";

type CardDataFormProps = {
  form: UseFormReturn<CardForm>;
  selectedPlan?: Plan | null;
  selectedInstallments?: number;
  onSelectInstallments?: (value: number) => void;
};

export function CardDataForm({ form, selectedPlan, selectedInstallments, onSelectInstallments }: CardDataFormProps) {
  return (
    <div className="w-full">
      <h4 className="text-xl font-semibold mb-4">Dados do cartão</h4>

      <Card className="p-5 lg:p-6 xl:p-8 space-y-4 lg:space-y-5 gap-0 bg-[#FAFAFA]">
        <AcceptedBrands />

        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem className="gap-0">
              <FormLabel className="text-sm font-normal">Número do cartão</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => field.onChange(maskCardNumber(e.target.value))}
                  placeholder="0000 0000 0000 0000"
                  className="placeholder:text-base placeholder:text-[#B0B0B1] border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus:border-blue-600 p-0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="holder"
          render={({ field }) => (
            <FormItem className="gap-0">
              <FormLabel className="text-sm font-normal">Nome impresso no cartão</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Preencha igual ao cartão"
                  className="placeholder:text-base placeholder:text-[#B0B0B1] border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus:border-blue-600 p-0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expirationDate"
            render={({ field }) => (
              <FormItem className="gap-0">
                <FormLabel className="text-sm font-normal">Validade</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(maskExpirationDate(e.target.value))}
                    placeholder="MM/AA"
                    className="placeholder:text-base placeholder:text-[#B0B0B1] border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus:border-blue-600 p-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="CVV"
            render={({ field }) => {
              const hasError = !!form.formState.errors.CVV;
              return (
                <FormItem className="gap-0">
                  <FormLabel className="text-sm font-normal flex items-center gap-1">Código de segurança</FormLabel>

                  <FormControl>
                    <InputGroup
                      className={`border-0 border-b rounded-none p-0 bg-transparent ${
                        hasError ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <Input
                        {...field}
                        onChange={(e) => field.onChange(maskCVV(e.target.value))}
                        placeholder="000"
                        className={`placeholder:text-base placeholder:text-[#B0B0B1] border-0 rounded-none p-0 bg-transparent focus-visible:ring-0 ${
                          hasError ? "text-red-600" : ""
                        }`}
                      />
                      <InputGroupAddon align="inline-end">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" className="flex items-center justify-center text-gray-400">
                                <CircleQuestionMark className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs text-sm">
                              <p className="text-sm font-normal">
                                O CVV é o código de segurança do cartão, geralmente encontrado no verso do cartão. Para
                                cartões American Express, ele fica na frente.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        <FormField
          control={form.control}
          name="cardCpf"
          render={({ field }) => (
            <FormItem className="gap-0">
              <FormLabel className="text-sm font-normal">CPF do portador do cartão</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => field.onChange(maskCPF(e.target.value))}
                  placeholder="Preencha o CPF do portador"
                  className="placeholder:text-base placeholder:text-[#B0B0B1] border-0 border-b border-gray-300 rounded-none focus-visible:ring-0 focus:border-blue-600 p-0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <InstallmentsField
          name="installments"
          disabled={!selectedPlan}
          form={form}
          selectedInstallments={selectedInstallments}
          installments={selectedPlan ? Array.from({ length: selectedPlan?.installments ?? 0 }, (_, i) => i + 1) : []}
          onSelect={(n) => onSelectInstallments?.(n)}
          selectedPlan={selectedPlan}
        />
      </Card>
    </div>
  );
}
