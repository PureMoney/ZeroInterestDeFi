import React, { useState } from "react";
import { Alert, Button, Card, Input } from "antd";
import { notify } from "../../../utils/notifications";
import { usePrice } from "../../../contexts/price";

// (SOL * Current Price of SOL / ROKS borrowed) * 100%
const getCollRatio = (
  collateral: number,
  borrow: number,
  priceOfSol: number
) => {
  const result = ((collateral * priceOfSol) / borrow) * 100;
  return isFinite(result) ? result.toFixed(2) : 0.0;
};

export const TroveCard = () => {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [collateral, setCollateral] = useState(0);
  const [borrow, setBorrow] = useState(0);

  const priceOfSol = usePrice();
  const ratio = getCollRatio(collateral, borrow, priceOfSol) || 0;
  const isValid = ratio >= 150;
  const ratioColor = isValid ? "green-color" : "orange-color";

  return (
    <Card title="Trove" className="cards">
      {confirmed ? (
        <div>
          <div className="form-div">
            <Input
              addonBefore={"Collateral"}
              suffix="SOL"
              disabled
              value={collateral}
            />
            <Input
              addonBefore={"Borrow"}
              suffix="ROKS"
              value={borrow}
              disabled
            />
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
              <div className={"stat-right " + ratioColor}>{ratio}%</div>
            </div>
          </div>
          <div className="card-button">
            <Button>Close Trove</Button>
            <Button
              type="primary"
              onClick={() => {
                setOpen(true);
                setConfirmed(false);
              }}
            >
              Adjust
            </Button>
          </div>
        </div>
      ) : open ? (
        <div>
          <div className="form-div">
            <Input
              addonBefore={"Collateral"}
              suffix="SOL"
              onChange={(text) => setCollateral(parseInt(text.target.value))}
              value={collateral}
              type="number"
            />
            <Input
              addonBefore={"Borrow"}
              suffix="ROKS"
              value={borrow}
              onChange={(text) => setBorrow(parseInt(text.target.value))}
              type="number"
            />
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
              <div className={"stat-right " + ratioColor}>{ratio}%</div>
            </div>
          </div>
          {isValid && (
            <Alert
              className="card-alert"
              message={`You wil deposit ${collateral} SOL and receive ${borrow} ROKS.`}
              type="info"
              showIcon
            />
          )}
          {!isValid && (
            <>
              <Alert
                className="card-alert"
                message={`Keeping your CR above 150% can help avoid liquidation under Recovery Mode.`}
                type="info"
                showIcon
              />
              <Alert
                className="card-alert"
                message={`You're not allowed to open a Trove that would cause the Total Collateral Ratio to fall below 150%. Please increase your Trove's Collateral Ratio.`}
                type="warning"
                showIcon
              />
            </>
          )}
          <div className="card-button">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              disabled={!isValid}
              onClick={() => {
                setConfirmed(true);
                notify({
                  message: "Trove Created",
                  description: "Trove was successfully created.",
                });
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Alert
            message={`You haven't borrowed any ROKS yet.`}
            description={"You can borrow ROKS by opening a Trove."}
            type="info"
            showIcon
          />
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
