import React, { useState } from "react";
import { Button, Card, Input, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
const { Title } = Typography;

export const StabilityPoolCard = () => {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <Card
      title="Stability Pool"
      className="cards"
      extra={"28,482,679 VTT remaining"}
    >
      {confirmed ? (
        <div>
          <div className="form-div">
            <Input addonBefore={"Deposit"} suffix="ROKS" value="337.33" disabled />
          </div>
          <div className="stat-box">
            <div className="stat-row">
              <div className="stat-left">Pool Share</div>
              <div className="stat-right">42.00%</div>
            </div>
            <div className="stat-row">
              <div className="stat-left">Liquidation Gain</div>
              <div className="stat-right">0.00 SOL</div>
            </div>
            <div className="stat-row">
              <div className="stat-left">Reward</div>
              <div className="stat-right">0.00 VTT</div>
            </div>
          </div>
          <div className="card-button">
            <Button
              onClick={() => {
                setOpen(true);
                setConfirmed(false);
              }}
            >
              Adjust
            </Button>
            <Button type="primary">Claim SOL and VTT</Button>
          </div>
          <div className="card-button">
            <Button disabled={true}>Claim VTT and move SOL to Trove</Button>
          </div>
        </div>
      ) : open ? (
        <div>
          <div className="form-div">
            <Input addonBefore={"Deposit"} suffix="ROKS" />
          </div>
          <div className="stat-box">
            <div className="stat-row">
              <div className="stat-left">Pool Share</div>
              <div className="stat-right">42.0%</div>
            </div>
          </div>
          <div className="card-button">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={() => setConfirmed(true)}>
              Confirm
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="card-info-msg">
            <InfoCircleOutlined className="card-message-icon" />
            <Title level={5}>You have no ROKS in the Stability Pool.</Title>
          </div>
          <Typography className="card-message-body">
            You can earn SOL and VTT rewards by depositing ROKS.
          </Typography>
          <div className="card-button">
            <Button type="primary" onClick={() => setOpen(true)}>
              Deposit
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
