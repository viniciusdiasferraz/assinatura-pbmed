import { act } from "@testing-library/react";
import { useCheckoutStore } from "../useCheckoutStore";

jest.mock("@/lib/api", () => ({
  api: {
    get: jest.fn(),
  },
}));

const { api } = jest.requireMock("@/lib/api");

let errorSpy: jest.SpyInstance;
beforeAll(() => {
  errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  errorSpy.mockRestore();
});

describe("useCheckoutStore - coupons", () => {
  beforeEach(() => {
    act(() => {
      useCheckoutStore.setState({
        selectedPlanId: null,
        appliedCoupon: null,
        showCouponInput: false,
        submitting: false,
        couponError: null,
      });
    });
    jest.resetAllMocks();
  });

  it("applies valid coupon (case-insensitive)", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: [{ code: "AFYAWB001", discount: 10 }],
    });

    let result: boolean | null = null;
    await act(async () => {
      result = await useCheckoutStore.getState().handleApplyCoupon("afyawB001", [] as any);
    });

    expect(result).toBe(true);
    expect(useCheckoutStore.getState().appliedCoupon).toEqual({ code: "AFYAWB001", discount: 10 });
    expect(api.get).toHaveBeenCalledWith("/coupons", { params: { code: "afyawB001" } });
  });

  it("rejects invalid coupon and clears state", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: [] });

    let result: boolean | null = null;
    await act(async () => {
      result = await useCheckoutStore.getState().handleApplyCoupon("INVALIDO", [] as any);
    });

    expect(result).toBe(false);
    expect(useCheckoutStore.getState().appliedCoupon).toBeNull();
  });

  it("handles API error gracefully and clears coupon", async () => {
    (api.get as jest.Mock).mockRejectedValueOnce(new Error("network error"));

    let result: boolean | null = null;
    await act(async () => {
      result = await useCheckoutStore.getState().handleApplyCoupon("ANY", [] as any);
    });

    expect(result).toBe(false);
    expect(useCheckoutStore.getState().appliedCoupon).toBeNull();
  });

  it("treats non-array API response as empty and returns false", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: { code: "AFYAWB001", discount: 10 },
    });

    let result: boolean | null = null;
    await act(async () => {
      result = await useCheckoutStore.getState().handleApplyCoupon("AFYAWB001", [] as any);
    });

    expect(result).toBe(false);
    expect(useCheckoutStore.getState().appliedCoupon).toBeNull();
  });

  it("applies coupon with missing discount defaulting to 0", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: [{ code: "SEMDSC" }],
    });

    await act(async () => {
      await useCheckoutStore.getState().handleApplyCoupon("SEMDSC", [] as any);
    });

    expect(useCheckoutStore.getState().appliedCoupon).toEqual({ code: "SEMDSC", discount: 0 });
  });
  it("setter actions update the store and handleRemoveCoupon clears it", () => {
    act(() => {
      useCheckoutStore.getState().setSelectedPlanId("33");
      useCheckoutStore.getState().setAppliedCoupon({ code: "TESTE", discount: 15 });
      useCheckoutStore.getState().setShowCouponInput(true);
      useCheckoutStore.getState().setSubmitting(true);
      useCheckoutStore.getState().setCouponError("Erro X");
    });

    expect(useCheckoutStore.getState().selectedPlanId).toBe("33");
    expect(useCheckoutStore.getState().appliedCoupon).toEqual({ code: "TESTE", discount: 15 });
    expect(useCheckoutStore.getState().showCouponInput).toBe(true);
    expect(useCheckoutStore.getState().submitting).toBe(true);
    expect(useCheckoutStore.getState().couponError).toBe("Erro X");

    act(() => {
      useCheckoutStore.getState().handleRemoveCoupon();
    });
    expect(useCheckoutStore.getState().appliedCoupon).toBeNull();
  });
});


