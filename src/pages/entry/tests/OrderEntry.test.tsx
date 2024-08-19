import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { server } from "../../../mocks/server";
import OrderEntry from "../OrderEntry";
import React from "react";

test("handles error for scoops and toppings routes", async () => {
  server.resetHandlers(
    http.get("http://localhost:3030/scoops", () => {
      return new HttpResponse(null, { status: 500 });
    }),
    http.get("http://localhost:3030/toppings", () => {
      return new HttpResponse(null, { status: 500 });
    })
  );

  render(<OrderEntry />);

  const alerts = await screen.findAllByRole<HTMLElement>("alert");
  expect(alerts).toHaveLength(2);
});

test("disable order button if there are no scoops ordered", async () => {
  const user = await userEvent.setup();
  render(<OrderEntry setOrderPhase={vi.fn()} />);

  // order button should be disabled at first, even before options load
  const orderButton = screen.getByRole<HTMLButtonElement>("button", { name: /order sundae/i });
  expect(orderButton).toBeDisabled();

  // expect button to be enabled after adding scoop
  const vanillaInput = await screen.findByRole<HTMLInputElement>("spinbutton", {
    name: "Vanilla",
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "1");
  expect(orderButton).toBeEnabled();

  // expect button to be disabled again after removing scoop
  await user.clear(vanillaInput);
  await user.type(vanillaInput, "0");
  expect(orderButton).toBeDisabled();
});

function expect(alerts: HTMLElement[]) {
  throw new Error("Function not implemented.");
}
