import React from "react";
import { Card, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
const { Paragraph, Title } = Typography;

const liquidationMessage = (
  <Paragraph className="card-message-body">
    Liquidation is expected to be carried out by bots.
    <br />
    Early on you may be able to manually liquidate Troves, but as the system
    matures this will become less likely.
  </Paragraph>
);

const redemptionMessage = (
  <Paragraph className="card-message-body">
    Redemptions are expected to be carried out by bots when arbitrage
    opportunities emerge.
    <br />
    Most of the time you will get a better rate for converting ROKS to SOL on
    Radium or other exchanges.
    <br />
    <b>Note:</b> Redemption is not for repaying your loan. To repay your loan,
    adjust your Trove on the Dashboard.
  </Paragraph>
);

export const BotCard = (props: { liquidation: boolean }) => {
  return (
    <Card title="Bot Actions" className="cards">
      <div className="card-info-msg">
        <InfoCircleOutlined className="card-message-icon" />
        <Title level={5}>Bot functionality</Title>
      </div>
      {props.liquidation ? liquidationMessage : redemptionMessage}
    </Card>
  );
};
