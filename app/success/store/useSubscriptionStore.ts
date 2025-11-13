import { create } from "zustand";
import { api } from "@/lib/api";
import { formatCPF, getPeriodLabel } from "../helpers/validators";

export interface Subscription {
  userId: string | number;
  price: number;
  installments: number;
  number?: string;
  cardCpf?: string;
  period: string;
}

interface SubscriptionState {
  subscription: Subscription | null;
  loading: boolean;
  error: string | null;

  fetchSubscription: (userId?: string) => Promise<void>;

  formattedCpf: string;
  modalidade: string;
  cardLastFour: string;
  installmentText: string;
  valueDisplay: string;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscription: null,
  loading: false,
  error: null,

  formattedCpf: "—",
  modalidade: "—",
  cardLastFour: "—",
  installmentText: "R$ —",
  valueDisplay: "R$ —",

  fetchSubscription: async (userId = "1") => {
    set({ loading: true, error: null });

    let subscription: Subscription | null = null;

    try {
      const res = await api.get(`/subscriptions/${userId}`);
      subscription = res.data;
    } catch {
      try {
        // Filtra diretamente no JSON Server e pega o último registro do usuário
        const resList = await api.get("/subscription", { params: { userId } });
        const list: Subscription[] = Array.isArray(resList.data) ? resList.data : [];
        subscription = list.length > 0 ? list[list.length - 1] : null;
      } catch {
        set({ error: "Não foi possível carregar a assinatura" });
      }
    }

    if (subscription) {
      const hasSubscription = !!subscription;
      const safeInstallments = Number(subscription.installments) && Number(subscription.installments) > 0 ? Number(subscription.installments) : 1;
      const finalPrice = hasSubscription
        ? (Number(subscription.price) / safeInstallments).toFixed(2).replace(".", ",")
        : "0,00";
      const totalValue = hasSubscription ? Number(subscription.price).toFixed(2).replace(".", ",") : "0,00";
      const cardLastFour = subscription.number ? String(subscription.number).slice(-4) : "—";
      const formattedCpf = subscription.cardCpf ? formatCPF(subscription.cardCpf) : "—";
      const installmentText = hasSubscription ? `${safeInstallments}x de R$ ${finalPrice}` : "R$ —";
      const modalidade = hasSubscription ? getPeriodLabel(subscription.period) : "—";
      const valueDisplay = hasSubscription ? `R$ ${totalValue}` : "R$ —";

      set({
        subscription,
        formattedCpf,
        modalidade,
        cardLastFour,
        installmentText,
        valueDisplay,
      });
    }

    set({ loading: false });
  },
}));
