import { render, screen } from "@testing-library/react";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../card";

describe("Card UI", () => {
  it("renders all card slots with content", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Título</CardTitle>
          <CardDescription>Descrição</CardDescription>
          <CardAction>Ação</CardAction>
        </CardHeader>
        <CardContent>Conteúdo</CardContent>
        <CardFooter>Rodapé</CardFooter>
      </Card>,
    );

    expect(screen.getByText("Título")).toBeInTheDocument();
    expect(screen.getByText("Descrição")).toBeInTheDocument();
    expect(screen.getByText("Ação")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo")).toBeInTheDocument();
    expect(screen.getByText("Rodapé")).toBeInTheDocument();
  });
});
