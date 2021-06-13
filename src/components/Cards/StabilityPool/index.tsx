import React, { useState } from "react";
import { Alert, Button, Card, Input } from "antd";
import { notify } from "../../../utils/notifications";

export const StabilityPoolCard = () => {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [deposit, setDeposit] = useState("0");

  return (
    <Card
      title="Stability Pool"
      className="cards"
      extra={"28,482,679 VTT remaining"}
    >
      {confirmed ? (
        <div>
          <div className="form-div">
            <Input
              addonBefore={"Deposit"}
              suffix="ROKS"
              value={deposit}
              disabled
            />
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
            <Input
              addonBefore={"Deposit"}
              suffix="ROKS"
              value={deposit}
              onChange={(text) => setDeposit(text.target.value)}
            />
          </div>
          <div className="stat-box">
            <div className="stat-row">
              <div className="stat-left">Pool Share</div>
              <div className="stat-right">42.0%</div>
            </div>
          </div>
          <Alert
            className="card-alert"
            message={`You are depositing ${deposit} ROKS in the stability pool.`}
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
                  message: "Deposit success",
                  description: "Stability pool deposit has been successful.",
                });
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <Alert
            message={`You have no ROKS in the Stability Pool.`}
            description={"You can earn SOL and VTT rewards by depositing ROKS."}
            type="info"
            showIcon
          />
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
