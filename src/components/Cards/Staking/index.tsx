import React from "react";
import { Button, Card, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
const { Title } = Typography;

export const StakingCard = () => {
  return (
    <Card title="Staking" className="cards">
      <div className="card-info-msg">
        <InfoCircleOutlined className="card-message-icon" />
        <Title level={5}>You haven't staked VTT yet.</Title>
      </div>
      <Typography className="card-message-body">
        Stake VTT to earn a share of borrowing and redemption fees.
      </Typography>
      <div className="card-button">
        <Button type="primary">Start staking</Button>
      </div>
    </Card>
  );
};
