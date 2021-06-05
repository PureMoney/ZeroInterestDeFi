import React from "react";
import { Button, Card, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
const { Title } = Typography;

export const StabilityPoolCard = () => {
  return (
    <Card title="Stability Pool" className="cards" extra={"28,482,679 VTT remaining"}>
      <div className="card-info-msg">
        <InfoCircleOutlined className="card-message-icon" />
        <Title level={5}>You have no ROKS in the Stability Pool.</Title>
      </div>
      <Typography className="card-message-body">
        You can earn SOL and VTT rewards by depositing ROKS.
      </Typography>
      <div className="card-button">
        <Button type="primary">Deposit</Button>
      </div>
    </Card>
  );
};
