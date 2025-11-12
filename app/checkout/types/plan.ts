export type Plan = {
  id: string | number;
  storeId: string;
  title: string;
  description: string;
  fullPrice: number;
  discountAmmount?: number | null;
  discountPercentage?: number | null;
  periodLabel?: string;
  period?: string;
  acceptsCoupon?: boolean;
  installments?: number;
};
