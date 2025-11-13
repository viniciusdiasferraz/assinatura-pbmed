import { render, screen } from "@testing-library/react";
import { SubscriptionData } from "../SubscriptionData";

describe("SubscriptionData", () => {
  it("renders provided subscription info correctly", () => {
    render(
      <SubscriptionData
        formattedCpf="493.028.108-36"
        installmentDisplay="2x de R$ 100,00"
        modalidade="Assinatura anual*"
        cardLastFour="6179"
        valueDisplay="R$ 200,00"
      />,
    );

    expect(screen.getByText("CPF")).toBeInTheDocument();
    expect(screen.getByText("493.028.108-36")).toBeInTheDocument();
    expect(screen.getByText("Parcelamento")).toBeInTheDocument();
    expect(screen.getByText("2x de R$ 100,00")).toBeInTheDocument();
    expect(screen.getByText("Modalidade")).toBeInTheDocument();
    expect(screen.getByText("Assinatura anual*")).toBeInTheDocument();
    expect(screen.getByText("Número cartão")).toBeInTheDocument();
    expect(screen.getByText(/6179$/)).toBeInTheDocument();
    expect(screen.getByText("Valor")).toBeInTheDocument();
    expect(screen.getByText("R$ 200,00")).toBeInTheDocument();
  });
});
