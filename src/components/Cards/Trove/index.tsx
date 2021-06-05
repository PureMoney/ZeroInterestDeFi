import React from "react";
import { Button, Card, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
const { Title } = Typography;

export const TroveCard = () => {
  return (
    <Card title="Trove" className="cards">
      <div className="card-info-msg">
        <InfoCircleOutlined className="card-message-icon" />
        <Title level={5}>You haven't borrowed any ROKS yet.</Title>
      </div>
      <Typography className="card-message-body">
        You can borrow ROKS by opening a Trove.
      </Typography>
      <div className="card-button">
        <Button type="primary">Open Trove</Button>
      </div>
    </Card>
  );
};
