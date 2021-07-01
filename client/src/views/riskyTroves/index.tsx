import { Col, Row } from "antd";
import React from "react";
import * as Cards from "../../components/Cards";
import { RiskyTrovesTable } from "../../components/RiskyTrovesTable";

export const RiskyTrovesContent = () => {
  return (
    <Row justify="start" style={{ textAlign: "left" }}>
      <Row>
        <Col span={10} offset={2}>
          <Cards.BotCard liquidation={true} />
        </Col>
        <Col span={10}>
          <Cards.StatisticsCard />
        </Col>
      </Row>
      <Row>
        <Col offset={2} span={20} style={{ padding: "16px", textAlign:"center" }}>
          <RiskyTrovesTable />
        </Col>
      </Row>
    </Row>
  );
};
