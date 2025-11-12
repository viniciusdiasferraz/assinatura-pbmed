import { api } from "@/lib/api";
import CheckoutClient from "./components/CheckoutClient";

export default async function CheckoutPage() {
  const { data: plans } = await api.get("/plans");

  return <CheckoutClient plans={plans} />;
}
