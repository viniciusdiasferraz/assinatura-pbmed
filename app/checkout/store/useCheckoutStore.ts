import { create } from "zustand";
import type { Plan } from "../types/plan";

type Coupon = {
  code: string;
  discount: number;
};

interface CheckoutState {
  selectedPlanId: string | number | null;
  appliedCoupon: Coupon | null;
  showCouponInput: boolean;
  submitting: boolean;
  couponError: string | null;

  setSelectedPlanId: (id: string | number) => void;
  setAppliedCoupon: (coupon: Coupon | null) => void;
  setShowCouponInput: (value: boolean) => void;
  setSubmitting: (value: boolean) => void;
  setCouponError: (value: string | null) => void;

  handleRemoveCoupon: () => void;
  handleApplyCoupon: (code: string, plans: Plan[]) => Promise<boolean>;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  selectedPlanId: null,
  appliedCoupon: null,
  showCouponInput: false,
  submitting: false,
  couponError: null,

  setSelectedPlanId: (id) => set({ selectedPlanId: id }),
  setAppliedCoupon: (coupon) => set({ appliedCoupon: coupon }),
  setShowCouponInput: (value) => set({ showCouponInput: value }),
  setSubmitting: (value) => set({ submitting: value }),
  setCouponError: (value) => set({ couponError: value }),

  handleRemoveCoupon: () => set({ appliedCoupon: null }),

  handleApplyCoupon: async (code) => {
    set({ couponError: null });
    try {
      const res = await fetch("/api/coupons");
      const data = await res.json();
      const coupon = data.find((c: Coupon) => String(c.code).toLowerCase() === String(code).toLowerCase());
      if (!coupon) {
        set({ appliedCoupon: null });
        return false;
      }
      set({
        appliedCoupon: { code: coupon.code, discount: coupon.discount || 0 },
      });
      return true;
    } catch (err) {
      console.error("Error applying coupon:", err);
      set({ appliedCoupon: null });
      return false;
    }
  },
}));
