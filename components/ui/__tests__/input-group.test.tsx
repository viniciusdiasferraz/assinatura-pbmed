import { fireEvent, render, screen } from "@testing-library/react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "../input-group";

describe("InputGroup", () => {
  it("renders input with addon (inline-end) and focuses input on click", () => {
    const focusSpy = jest.spyOn(HTMLInputElement.prototype, "focus").mockImplementation(() => {});

    render(
      <InputGroup>
        <InputGroupInput placeholder="Digite" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>?</InputGroupText>
        </InputGroupAddon>
      </InputGroup>,
    );

    const addon = screen.getByText("?").parentElement as HTMLElement;
    fireEvent.click(addon);
    expect(addon.getAttribute("data-align")).toBe("inline-end");
    expect(focusSpy).toHaveBeenCalled();

    focusSpy.mockRestore();
  });

  it("focuses input using keyboard (Enter/Space) on addon", () => {
    const focusSpy = jest.spyOn(HTMLInputElement.prototype, "focus").mockImplementation(() => {});

    render(
      <InputGroup>
        <InputGroupInput placeholder="Campo" />
        <InputGroupAddon align="inline-start">
          <InputGroupText>i</InputGroupText>
        </InputGroupAddon>
      </InputGroup>,
    );

    const addon = screen.getByText("i").parentElement as HTMLElement;
    fireEvent.keyDown(addon, { key: "Enter" });
    fireEvent.keyDown(addon, { key: " " });
    expect(addon.getAttribute("data-align")).toBe("inline-start");
    expect(focusSpy).toHaveBeenCalledTimes(2);

    focusSpy.mockRestore();
  });

  it("renders button variant and textarea inside group", () => {
    render(
      <InputGroup>
        <InputGroupTextarea placeholder="Descrição" />
        <InputGroupButton size="xs" type="button">
          OK
        </InputGroupButton>
      </InputGroup>,
    );

    expect(screen.getByPlaceholderText("Descrição")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "OK" })).toHaveAttribute("data-size", "xs");
  });
});
