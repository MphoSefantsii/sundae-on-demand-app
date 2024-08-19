import { useState, FC } from "react";
import Container from "react-bootstrap/Container";

import OrderConfirmation from "./pages/confirmation/OrderConfirmation";
import OrderEntry from "./pages/entry/OrderEntry";
import OrderSummary from "./pages/summary/OrderSummary";

import { OrderDetailsProvider } from "./contexts/OrderDetails";

type SetOrderPhase = (phase: "inProgress" | "review" | "completed") => void;

const App: FC = () => {
  // orderPhase needs to be 'inProgress', 'review' or 'completed'
  const [orderPhase, setOrderPhase] = useState<"inProgress" | "review" | "completed">("inProgress");

  let Component = OrderEntry; // default to order page
  switch (orderPhase) {
    case "inProgress":
      Component = OrderEntry;
      break;
    case "review":
      Component = OrderSummary;
      break;
    case "completed":
      Component = OrderConfirmation;
      break;
    default:
  }

  return (
    <OrderDetailsProvider>
      <Container>{<Component setOrderPhase={setOrderPhase as SetOrderPhase} />}</Container>
    </OrderDetailsProvider>
  );
};

export default App;