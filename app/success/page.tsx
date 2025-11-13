"use client";

import { Check } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { SubscriptionData } from "./components/SubscriptionData";
import { SubscriptionStatus } from "./components/SubscriptionStatus";
import { useSubscriptionStore } from "./store/useSubscriptionStore";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") ?? "1";

  const { formattedCpf, modalidade, cardLastFour, installmentText, valueDisplay, fetchSubscription, loading } =
    useSubscriptionStore();

  useEffect(() => {
    fetchSubscription(userId);
  }, [userId, fetchSubscription]);

  if (loading) return <p>Carregando...</p>;

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="w-full px-4 md:px-12">
        {/* Banner */}
        <div className="flex items-center justify-between p-4 bg-[#0051D1] text-white rounded-t-lg mt-10 h-22">
          <div className="flex items-center">
            <Check className="size-10 mr-2 text-[#0051D1] rounded-full bg-white p-1" />
            <span className="text-lg font-semibold">Seu teste grátis começou!</span>
          </div>
          <span className="font-medium">Você assinou Conteúdos Premium</span>
        </div>

        <div className="bg-[#FAFAFA] p-8 border border-t-0 rounded-b-lg shadow-sm mb-6">
          <h3 className="text-lg font-bold mb-6">Status da assinatura</h3>
          <SubscriptionStatus />
        </div>

        <SubscriptionData
          formattedCpf={formattedCpf}
          installmentDisplay={installmentText}
          modalidade={modalidade}
          cardLastFour={cardLastFour}
          valueDisplay={valueDisplay}
        />
      </div>
    </main>
  );
}
