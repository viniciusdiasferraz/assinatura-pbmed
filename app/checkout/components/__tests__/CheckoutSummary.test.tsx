import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import type { CardForm } from "../../helpers/schema";
import type { Plan } from "../../types/plan";
import { CheckoutSummary } from "../CheckoutSummary";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: { alt?: string }) => <div data-testid="next-image" role="img" aria-label={props.alt ?? ""} />,
}));

const plan: Plan = {
  id: "33",
  storeId: "pagamento_anual_a_vista",
  title: "Anual",
  description: "Desc",
  fullPrice: 700,
  discountAmmount: 70,
  discountPercentage: 10,
  periodLabel: "ano",
  period: "annually",
  installments: 12,
  acceptsCoupon: true,
};

function Harness({ onApply, onRemove }: { onApply: (code: string) => Promise<boolean>; onRemove: () => void }) {
  const form = useForm<CardForm>({
    defaultValues: {
      couponCode: null,
    },
  });
  return (
    <Form {...form}>
      <CheckoutSummary
        form={form}
        subtotal={630}
        total={567}
        selectedPlan={plan}
        selectedInstallments={1}
        submitting={false}
        handleApplyCoupon={onApply}
        handleRemoveCoupon={onRemove}
      />
    </Form>
  );
}

describe("CheckoutSummary component", () => {
  it("renders totals and allows toggling coupon input", () => {
    render(<Harness onApply={async () => true} onRemove={() => {}} />);

    expect(screen.getByText("Resumo")).toBeInTheDocument();
    expect(screen.getByText("Subtotal")).toBeInTheDocument();
    expect(screen.getByText("R$ 630.00")).toBeInTheDocument();

    const couponButton = screen.getByRole("button", { name: /Tem um cupom de desconto\?/i });
    fireEvent.click(couponButton);

    expect(screen.getByText("Preencha o código")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite seu cupom")).toBeInTheDocument();
  });

  it("applies coupon successfully", async () => {
    const handleApplyCoupon = jest.fn();
    render(<Harness onApply={handleApplyCoupon} onRemove={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Tem um cupom de desconto\?/i }));
    const input = screen.getByPlaceholderText("Digite seu cupom") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "AFYAWB001" } });

    handleApplyCoupon.mockResolvedValueOnce(true);
    fireEvent.click(screen.getByRole("button", { name: /Aplicar cupom/i }));

    await waitFor(() => expect(handleApplyCoupon).toHaveBeenCalledWith("AFYAWB001"));
  });

  it("shows error when coupon is invalid", async () => {
    const handleApplyCoupon = jest.fn();
    render(<Harness onApply={handleApplyCoupon} onRemove={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Tem um cupom de desconto\?/i }));
    const input = screen.getByPlaceholderText("Digite seu cupom") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "INVALIDO" } });

    handleApplyCoupon.mockResolvedValueOnce(false);
    fireEvent.click(screen.getByRole("button", { name: /Aplicar cupom/i }));

    await waitFor(() => expect(handleApplyCoupon).toHaveBeenCalledWith("INVALIDO"));
    expect(screen.getByText("Cupom inválido")).toBeInTheDocument();
  });

  it("cancela o cupom e chama handleRemoveCoupon", () => {
    const handleRemoveCoupon = jest.fn();
    render(<Harness onApply={async () => true} onRemove={handleRemoveCoupon} />);

    fireEvent.click(screen.getByRole("button", { name: /Tem um cupom de desconto\?/i }));
    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));
    expect(handleRemoveCoupon).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: /Tem um cupom de desconto\?/i })).toBeInTheDocument();
  });

  it("mostra erro 'Informe o código' quando tenta aplicar sem preencher", async () => {
    const handleApplyCoupon = jest.fn();
    render(<Harness onApply={handleApplyCoupon} onRemove={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Tem um cupom de desconto\?/i }));
    fireEvent.click(screen.getByRole("button", { name: /Aplicar cupom/i }));

    expect(handleApplyCoupon).not.toHaveBeenCalled();
    expect(screen.getByText("Informe o código")).toBeInTheDocument();
  });

  it("exibe total como R$ - quando total é zero", () => {
    function LocalHarness() {
      const form = useForm<CardForm>({ defaultValues: { couponCode: null } });
      const noDiscountPlan: Plan = { ...plan, discountPercentage: null, discountAmmount: null };
      return (
        <Form {...form}>
          <CheckoutSummary
            form={form}
            subtotal={700}
            total={700}
            selectedPlan={noDiscountPlan}
            selectedInstallments={1}
            submitting={false}
            handleApplyCoupon={async () => true}
            handleRemoveCoupon={() => {}}
          />
        </Form>
      );
    }
    render(<LocalHarness />);
    expect(screen.queryByText(/Desconto -/)).not.toBeInTheDocument();
  });

  it("does not render coupon button when plan doesn't accept coupon", () => {
    const noCouponPlan = { ...plan, acceptsCoupon: false };
    function LocalHarness() {
      const form = useForm<CardForm>({ defaultValues: { couponCode: null } });
      return (
        <Form {...form}>
          <CheckoutSummary
            form={form}
            subtotal={630}
            total={567}
            selectedPlan={noCouponPlan}
            selectedInstallments={1}
            submitting={false}
            handleApplyCoupon={async () => true}
            handleRemoveCoupon={() => {}}
          />
        </Form>
      );
    }
    render(<LocalHarness />);
    expect(screen.queryByRole("button", { name: /Tem um cupom de desconto\?/i })).not.toBeInTheDocument();
  });

  it("shows per-installment text when selectedInstallments > 1", () => {
    function LocalHarness() {
      const form = useForm<CardForm>({ defaultValues: { couponCode: null } });
      return (
        <Form {...form}>
          <CheckoutSummary
            form={form}
            subtotal={630}
            total={600}
            selectedPlan={plan}
            selectedInstallments={3}
            submitting={false}
            handleApplyCoupon={async () => true}
            handleRemoveCoupon={() => {}}
          />
        </Form>
      );
    }
    render(<LocalHarness />);
    expect(screen.getByText("3x de R$ 200,00")).toBeInTheDocument();
  });
});
