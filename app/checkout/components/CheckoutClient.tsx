"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SignatureCard } from "@/components/signatureCard";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import { type CardForm, cardSchema } from "../helpers/schema";
import { useCheckoutStore } from "../store/useCheckoutStore";
import type { Plan } from "../types/plan";
import { CardDataForm } from "./CardDataForm";
import { CheckoutSummary } from "./CheckoutSummary";

export default function CheckoutClient({ plans }: { plans: Plan[] }) {
  const router = useRouter();

  const {
    selectedPlanId,
    appliedCoupon,
    showCouponInput,
    submitting,
    setSelectedPlanId,
    handleRemoveCoupon,
    handleApplyCoupon,
    setSubmitting,
    setCouponError,
  } = useCheckoutStore();

  const form = useForm<CardForm>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      paymentMethod: "credit_card",
      installments: 1,
      planId: plans?.[0]?.id ?? "",
      cardCpf: "",
      cardNumber: "",
      CVV: "",
      expirationDate: "",
      holder: "",
      couponCode: null,
    },
    mode: "onSubmit",
  });

  const selectedPlan = plans.find((p) => String(p.id) === String(selectedPlanId)) ?? null;
  const selectedInstallments = Number(form.watch("installments") ?? 1) || 1;

  const basePrice = selectedPlan?.fullPrice ?? 0;
  const planDiscount = selectedPlan?.discountPercentage
    ? (basePrice * selectedPlan.discountPercentage) / 100
    : (selectedPlan?.discountAmmount ?? 0);
  const subtotal = basePrice - planDiscount;
  const couponDiscount = appliedCoupon && selectedPlan?.acceptsCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
  const total = Math.max(0, subtotal - couponDiscount);

  async function onSubmit(formValues: CardForm) {
    const couponValue = form.getValues("couponCode");

    if (showCouponInput && couponValue) {
      if (!appliedCoupon || appliedCoupon.code.toLowerCase() !== couponValue.toLowerCase()) {
        const ok = await handleApplyCoupon(String(couponValue), plans);
        if (!ok) {
          form.setError("couponCode", {
            type: "manual",
            message: "Cupom inválido",
          });
          return;
        }
      }
    }

    if (!selectedPlan) return;

    setSubmitting(true);
    setCouponError(null);

    const payload = {
      storeId: selectedPlan.storeId,
      period: selectedPlan.period,
      cardCpf: formValues.cardCpf,
      CVV: formValues.CVV,
      expirationDate: formValues.expirationDate,
      holder: formValues.holder,
      number: formValues.cardNumber,
      installments: selectedInstallments,
      couponCode: appliedCoupon?.code ?? null,
      userId: 1,
      method: formValues.paymentMethod,
      price: total,
    };

    try {
      await api.post("/subscription", payload);
      router.push(`/success?userId=${payload.userId}`);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setCouponError(error?.response?.data?.message || "Erro ao submeter");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-center w-full overflow-x-hidden">
      <div className="mt-6 w-11/12 md:w-10/12 lg:w-5/6 max-w-screen-xl pb-10 lg:pb-12">
        <h3 className="mb-8 lg:mb-10 xl:mb-12 text-3xl font-semibold">Aproveite o melhor do Whitebook!</h3>

        <div className="w-full flex flex-col gap-8 lg:flex-row lg:gap-12 xl:gap-20">
          <div className="flex gap-4 flex-col w-full lg:w-1/3">
            <h4 className="text-xl font-semibold mb-4">Selecione sua assinatura</h4>
            <div className="flex gap-4 flex-col">
              {plans.map((item) => {
                const isAnualLabel =
                  String(item.title).toLowerCase().includes("anual") ||
                  String(item.period).toLowerCase?.() === "annually";

                return (
                  <SignatureCard
                    key={item.id}
                    infos={item}
                    selectedId={selectedPlanId ? String(selectedPlanId) : undefined}
                    onSelect={() => {
                      setSelectedPlanId(item.id);
                      if (!isAnualLabel) {
                        form.setValue("installments", 1);
                      } else {
                        form.setValue("installments", 1);
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, () => {
                toast.custom((t) => (
                  <div className="flex items-center justify-between gap-4 p-4 bg-[#FFF2F0] text-[#A92A14] rounded-xl">
                    <div className="flex items-center gap-2 mr-4">
                      <Image src="/shape.svg" alt="Warning Icon" width={16} height={16} />
                      <p className="text-sm font-medium whitespace-normal sm:whitespace-nowrap">
                        Preencha todos os campos obrigatórios para continuar
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toast.dismiss(t)}
                      className="text-muted-foreground cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ));
              })}
              className="w-full flex flex-col gap-10 lg:flex-row lg:gap-20"
            >
              <CardDataForm
                form={form}
                selectedPlan={selectedPlan}
                selectedInstallments={selectedInstallments}
                onSelectInstallments={(value) => form.setValue("installments", value)}
              />

              <Separator orientation="vertical" className="hidden lg:block h-full" />
              <Separator className="lg:hidden" />

              <CheckoutSummary
                form={form}
                subtotal={subtotal}
                total={total}
                selectedPlan={selectedPlan}
                selectedInstallments={selectedInstallments}
                submitting={submitting}
                handleApplyCoupon={(code) => handleApplyCoupon(code, plans)}
                handleRemoveCoupon={handleRemoveCoupon}
              />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
