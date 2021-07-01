import { Col, Row } from "antd";
import React from "react";
import * as Cards from "../../components/Cards";

export const RedemptionContent = () => {
  return (
    <Row justify="start" style={{ textAlign: "left" }}>
      <Col span={10} offset={2}>
        <Cards.BotCard liquidation={false} />
        <Cards.RedeemCard />
      </Col>
      <Col span={10}>
        <Cards.StatisticsCard />
      </Col>
    </Row>
  );
};
