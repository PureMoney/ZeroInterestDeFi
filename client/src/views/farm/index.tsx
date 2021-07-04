import { Col, Row } from "antd";
import React from "react";
import * as Cards from "../../components/Cards";

export const FarmContent = () => {
  return (
    <Row justify="start" style={{ textAlign: "left" }}>
      <Col span={10} offset={2}>
        <Cards.FarmCard />
      </Col>
      <Col span={10}>
        <Cards.StatisticsCard />
      </Col>
    </Row>
  );
};
