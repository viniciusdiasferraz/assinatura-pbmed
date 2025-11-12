"use client";

import { Toggle } from "@radix-ui/react-toggle";
import type { Plan } from "@/app/checkout/types/plan";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type PlanProps = {
  infos: Plan;
  selectedId?: string | null;
  onSelect?: (plan: Plan | null) => void;
};

export function SignatureCard({ infos, selectedId, onSelect }: PlanProps) {
  const isSelected = selectedId === infos.id;
  const finalPrice = infos.fullPrice - (infos.discountAmmount ?? 0);

  const handleSelect = () => {
    onSelect?.(isSelected ? null : infos);
  };

  return (
    <Card
      className={`relative w-full cursor-pointer transition-all border-2 gap-0 py-3 ${
        isSelected ? "border-[#0051D1] bg-blue-50" : "border-gray-200"
      }`}
      onClick={handleSelect}
    >
      {infos.title.toLowerCase().includes("anual") && (
        <Toggle
          className="absolute -top-3 -left-0.5 bg-[#0051D1] text-white p-2 
             rounded-tl-md rounded-tr-md rounded-br-md rounded-bl-none"
        >
          <h4 className="text-sm font-semibold">Melhor oferta</h4>
        </Toggle>
      )}
      <div className="w-full flex justify-end px-4">
        <div
          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
            isSelected ? "border-[#0051D1] bg-[#0051D1]" : "border-gray-400"
          }`}
        >
          {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
        </div>
      </div>

      <CardHeader className="gap-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">{infos.title}</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col">
        <h4 className="text-sm font-normal">
          R$ <span className="text-xl font-bold">{finalPrice.toFixed(2)}</span>{" "}
          <span className="text-muted-foreground text-sm font-normal">/{infos.periodLabel}</span>
        </h4>

        <CardDescription className="font-normal">{infos.description}</CardDescription>
      </CardContent>
    </Card>
  );
}
