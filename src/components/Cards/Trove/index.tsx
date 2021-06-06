import React, { useState } from "react";
import { Button, Card, Input, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
const { Title } = Typography;

export const TroveCard = () => {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <Card title="Trove" className="cards">
      {confirmed ? (
        <div>
          <div className="form-div">
            <Input addonBefore={"Collateral"} suffix="SOL" value="100.00" disabled />
            <Input addonBefore={"Borrow"} suffix="ROKS" value="2000.00" disabled />
          </div>
          <div className="stat-box">
            <div className="stat-row">
              <div className="stat-left">Liquidation Reserve</div>
              <div className="stat-right">200 ROKS</div>
            </div>
            <div className="stat-row">
              <div className="stat-left">Borrowing Fee</div>
              <div className="stat-right">0.00 ROKS (0.50%)</div>
            </div>
            <div className="stat-row">
              <div className="stat-left">Total Debt</div>
              <div className="stat-right">200.00 ROKS</div>
            </div>
            <div className="stat-row">
              <div className="stat-left">Collateral Ratio</div>
              <div className="stat-right green-color">120%</div>
            </div>
          </div>
          <div className="card-button">
            <Button>Close Trove</Button>
            <Button type="primary" onClick={() => {
              setOpen(true);
              setConfirmed(false);
            }}>
              Adjust
            </Button>
          </div>
        </div>
      ) : open ? (
        <div>
          <div className="form-div">
            <Input addonBefore={"Collateral"} suffix="SOL" />
            <Input addonBefore={"Borrow"} suffix="ROKS" />
          </div>
          <div className="stat-box">
            <div className="stat-row">
              <div className="stat-left">Liquidation Reserve</div>
              <div className="stat-right">200 ROKS</div>
            </div>
            <div className="stat-row">
              <div className="stat-left">Borrowing Fee</div>
              <div className="stat-right">0.00 ROKS (0.50%)</div>
            </div>
            <div className="stat-row">
              <div className="stat-left">Total Debt</div>
              <div className="stat-right">200.00 ROKS</div>
            </div>
            <div className="stat-row">
              <div className="stat-left">Collateral Ratio</div>
              <div className="stat-right green-color">120%</div>
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
        <>
          <div className="card-info-msg">
            <InfoCircleOutlined className="card-message-icon" />
            <Title level={5}>You haven't borrowed any ROKS yet.</Title>
          </div>
          <Typography className="card-message-body">
            You can borrow ROKS by opening a Trove.
          </Typography>
          <div className="card-button">
            <Button type="primary" onClick={() => setOpen(true)}>
              Open Trove
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};
