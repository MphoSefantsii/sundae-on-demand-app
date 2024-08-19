import axios, { AxiosResponse, CancelToken, CancelTokenSource } from "axios";
import { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import ScoopOption from "./ScoopOption";
import ToppingOption from "./ToppingOption";
import AlertBanner from "../common/AlertBanner";
import { pricePerItem } from "../../constants";
import { formatCurrency } from "../../utilities";
import { useOrderDetails } from "../../contexts/OrderDetails";
import React from "react";

interface Item {
  name: string;
  imagePath: string;
}

type OptionType = "scoops" | "toppings";

export default function Options({ optionType }: { optionType: OptionType }) {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState(false);
  const { totals } = useOrderDetails();

  // optionType is 'scoops' or 'toppings'
  useEffect(() => {
    const controller = new AbortController();
    axios
      .get<Item[]>(`http://localhost:3030/${optionType}`, { signal: controller.signal })
      .then((response: AxiosResponse<Item[]>) => setItems(response.data))
      .catch((error) => {
        if (error.name !== "CanceledError") setError(true);
      });

    return () => controller.abort();
  }, [optionType]);

  if (error) {
    return <AlertBanner />;
  }

  const ItemComponent = optionType === "scoops" ? ScoopOption : ToppingOption;
  const title = optionType[0].toUpperCase() + optionType.slice(1).toLowerCase();

  const optionItems = items.map((item) => (
    <ItemComponent
      key={item.name}
      name={item.name}
      imagePath={item.imagePath}
    />
  ));

  return (
    <>
      <h2>{title}</h2>
      <p>{formatCurrency(pricePerItem[optionType])} each</p>
      <p>
        {title} total: {formatCurrency(totals[optionType])}
      </p>
      <Row>{optionItems}</Row>
    </>
  );
}