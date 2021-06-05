import React from "react";
import { Card, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
const { Title } = Typography;

export const FarmCard = () => {
  return (
    <Card title="Stability Pool" className="cards" extra={"0 VTT remaining"}>
      <div className="card-info-msg">
        <InfoCircleOutlined className="card-message-icon" />
        <Title level={5}>Raydium Liquidity Farm</Title>
      </div>
      <Typography className="card-message-body">
        There are no more LQTY rewards left to farm
      </Typography>
    </Card>
  );
};
