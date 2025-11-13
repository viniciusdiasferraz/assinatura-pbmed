import { render, screen, fireEvent } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { CardDataForm } from "../CardDataForm";

jest.mock("next/image", () => (props: any) => <img alt={props.alt} {...props} />);
jest.mock("@/components/ui/tooltip", () => ({
  Tooltip: ({ children }: any) => <div>{children}</div>,
  TooltipContent: ({ children }: any) => <div>{children}</div>,
  TooltipProvider: ({ children }: any) => <div>{children}</div>,
  TooltipTrigger: ({ children }: any) => <span>{children}</span>,
}));

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

function Harness() {
  const form = useForm<any>({
    defaultValues: {
      cardNumber: "",
      holder: "",
      expirationDate: "",
      CVV: "",
      cardCpf: "",
      installments: 1,
    },
  });
  return (
    <Form {...form}>
      <CardDataForm
        form={form as any}
        selectedPlan={plan as any}
        selectedInstallments={1}
        onSelectInstallments={() => {}}
      />
    </Form>
  );
}

describe("CardDataForm", () => {

  it("applies masks on inputs (card, expiration, CVV, CPF)", () => {
    render(<Harness />);

    const cardInput = screen.getByPlaceholderText("0000 0000 0000 0000") as HTMLInputElement;
    fireEvent.change(cardInput, { target: { value: "5359402430066179" } });
    expect(cardInput.value).toBe("5359 4024 3006 6179");

    const expInput = screen.getByPlaceholderText("MM/AA") as HTMLInputElement;
    fireEvent.change(expInput, { target: { value: "1127" } });
    expect(expInput.value).toBe("11/27");

    const cvvInput = screen.getByPlaceholderText("000") as HTMLInputElement;
    fireEvent.change(cvvInput, { target: { value: "12345" } });
    expect(cvvInput.value).toBe("1234");

    const cpfInput = screen.getByPlaceholderText("Preencha o CPF do portador") as HTMLInputElement;
    fireEvent.change(cpfInput, { target: { value: "49302810836" } });
    expect(cpfInput.value).toBe("493.028.108-36");
  });
});


