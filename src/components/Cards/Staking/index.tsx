import React, { useState } from "react";
import { Alert, Button, Card, Input, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { notify } from "../../../utils/notifications";
const { Title } = Typography;

export const StakingCard = () => {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [stake, setStake] = useState("0");

  return (
    <Card title="Staking" className="cards bottom-card">
      {confirmed ? (
        <div>
          <div className="form-div">
            <Input addonBefore={"Stake"} suffix="VTT" value={stake} disabled />
          </div>
          <div className="stat-box">
            <div className="stat-row">
              <div className="stat-left">Pool Share</div>
              <div className="stat-right">42.00%</div>
            </div>
            <div className="stat-row">
              <div className="stat-left">Redemption Gain</div>
              <div className="stat-right">0.00 SOL</div>
            </div>
            <div className="stat-row">
              <div className="stat-left">Issuance Gain</div>
              <div className="stat-right">0.00 ROKS</div>
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
            <Input addonBefore={"Stake"} suffix="VTT" value={stake} onChange={(text) => setStake(text.target.value)} />
          </div>
          <div className="stat-box">
            <div className="stat-row">
              <div className="stat-left">Pool Share</div>
              <div className="stat-right">N/A</div>
            </div>
          </div>
          <Alert
            className="card-alert"
            message={`Enter the amount of VTT you'd like to stake.`}
            type="info"
            showIcon
          />
          <div className="card-button">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              onClick={() => {
                setConfirmed(true);
                notify({
                  message: "Staking success",
                  description: "Staking has been successful.",
                });
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="card-info-msg">
            <InfoCircleOutlined className="card-message-icon" />
            <Title level={5}>You haven't staked VTT yet.</Title>
          </div>
          <Typography className="card-message-body">
            Stake VTT to earn a share of borrowing and redemption fees.
          </Typography>
          <div className="card-button">
            <Button type="primary" onClick={() => setOpen(true)}>
              Start staking
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
