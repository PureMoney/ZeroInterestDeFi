import { Col, Row } from "antd";
import React from "react";
import * as Cards from "../../components/Cards";

export const DashboardContent = () => {
  return (
    <Row justify="start" style={{ textAlign: "left" }}>
      <Col span={10} offset={2}>
        <Cards.TroveCard />
        <Cards.StabilityPoolCard />
        <Cards.StakingCard />
      </Col>
      <Col span={10}>
        <Cards.PriceFeedCard />
        <Cards.StatisticsCard />
      </Col>
    </Row>
  );
};
