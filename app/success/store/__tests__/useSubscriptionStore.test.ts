import { act } from "@testing-library/react";
import { useSubscriptionStore } from "../useSubscriptionStore";

jest.mock("@/lib/api", () => ({
  api: {
    get: jest.fn(),
  },
}));

const { api } = jest.requireMock("@/lib/api");

describe("useSubscriptionStore - fetchSubscription", () => {
  beforeEach(() => {
    act(() => {
      useSubscriptionStore.setState((state) => ({
        ...state,
        subscription: null,
        loading: false,
        error: null,
        formattedCpf: "—",
        modalidade: "—",
        cardLastFour: "—",
        installmentText: "R$ —",
        valueDisplay: "R$ —",
      }));
    });
    jest.resetAllMocks();
  });

  it("loads last subscription by userId when /subscriptions/:id fails", async () => {
    (api.get as jest.Mock).mockRejectedValueOnce(new Error("not found")).mockResolvedValueOnce({
      data: [
        {
          userId: 1,
          price: 200,
          installments: 2,
          number: "5359 4024 3006 6179",
          cardCpf: "49302810836",
          period: "annually",
        },
      ],
    });

    await act(async () => {
      await useSubscriptionStore.getState().fetchSubscription("1");
    });

    const st = useSubscriptionStore.getState();
    expect(st.error).toBeNull();
    expect(st.subscription).toBeTruthy();
    expect(st.formattedCpf).toBe("493.028.108-36");
    expect(st.cardLastFour).toBe("6179");
    expect(st.installmentText).toBe("2x de R$ 100,00");
    expect(st.valueDisplay).toBe("R$ 200.00".replace(".", ","));
    expect(st.modalidade).toBe("Assinatura anual*");
    expect(api.get).toHaveBeenCalledWith("/subscriptions/1");
    expect(api.get).toHaveBeenCalledWith("/subscription", { params: { userId: "1" } });
  });

  it("loads subscription directly from /subscriptions/:id when available", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: {
        userId: 2,
        price: 300,
        installments: 3,
        number: "4111 1111 1111 1111",
        cardCpf: "93541134780",
        period: "monthly",
      },
    });

    await act(async () => {
      await useSubscriptionStore.getState().fetchSubscription("2");
    });

    const st = useSubscriptionStore.getState();
    expect(st.subscription).toBeTruthy();
    expect(st.cardLastFour).toBe("1111");
    expect(st.installmentText).toBe("3x de R$ 100,00");
    expect(st.valueDisplay).toBe("R$ 300,00");
    expect(st.modalidade).toBe("Assinatura mensal*");
    expect(api.get).toHaveBeenCalledWith("/subscriptions/2");
  });

  it("sets error when both requests fail", async () => {
    (api.get as jest.Mock).mockRejectedValueOnce(new Error("not found"));
    (api.get as jest.Mock).mockRejectedValueOnce(new Error("not found"));

    await act(async () => {
      await useSubscriptionStore.getState().fetchSubscription("3");
    });

    const st = useSubscriptionStore.getState();
    expect(st.error).toBe("Não foi possível carregar a assinatura");
    expect(st.loading).toBe(false);
  });

  it("handles missing number/cardCpf and zero installments with safe fallbacks", async () => {
    (api.get as jest.Mock).mockRejectedValueOnce(new Error("not found"));
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          userId: 4,
          price: 150,
          installments: 0,
          period: "annually",
        },
      ],
    });

    await act(async () => {
      await useSubscriptionStore.getState().fetchSubscription("4");
    });

    const st = useSubscriptionStore.getState();
    expect(st.cardLastFour).toBe("—");
    expect(st.formattedCpf).toBe("—");
    expect(st.installmentText).toBe("1x de R$ 150,00");
  });
});
