import { render, fireEvent } from "@testing-library/react";
import { SignatureCard } from "../signatureCard";

const plan = {
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

describe("SignatureCard", () => {
  it("calls onSelect with plan when clicked and toggles selection", () => {
    const onSelect = jest.fn();
    const { getByText, rerender } = render(
      <SignatureCard
        infos={plan as any}
        selectedId={null}
        onSelect={onSelect}
      />
    );

    const card = getByText("Anual");
    fireEvent.click(card);
    expect(onSelect).toHaveBeenCalledWith(plan);

    onSelect.mockClear();
    rerender(
      <SignatureCard
        infos={plan as any}
        selectedId={"33"}
        onSelect={onSelect}
      />
    );
    const card2 = getByText("Anual");
    fireEvent.click(card2);
    expect(onSelect).toHaveBeenCalledWith(null);
  });
});
