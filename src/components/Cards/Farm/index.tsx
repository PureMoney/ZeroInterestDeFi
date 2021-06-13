import React from "react";
import { Alert, Card } from "antd";

export const FarmCard = () => {
  return (
    <Card title="Stability Pool" className="cards" extra={"0 VTT remaining"}>
      <Alert
        message={`Raydium Liquidity Farm`}
        description={"There are no more VTT rewards left to farm"}
        type="info"
        showIcon
      />
    </Card>
  );
};
