import React from "react";
import { Card, Typography } from "antd";
const { Title } = Typography;

export const StatisticsCard = () => {
  return (
    <Card title="Zero interest statistics" className="cards">
      <Title level={5}>Protocol</Title>
      <div className="stat-row">
        <div className="stat-left">Borrowing Fee</div>
        <div className="stat-right">0.50%</div>
      </div>
      <div className="stat-row">
        <div className="stat-left">TVL</div>
        <div className="stat-right">49,492,699.82 SOL ($2.52B)</div>
      </div>
      <div className="stat-row">
        <div className="stat-left">Troves</div>
        <div className="stat-right">773</div>
      </div>
      <div className="stat-row">
        <div className="stat-left">ROKS supply</div>
        <div className="stat-right">756M</div>
      </div>
      <div className="stat-row">
        <div className="stat-left">ROKS in Stability Pool</div>
        <div className="stat-right">700M (92.6%)</div>
      </div>
      <div className="stat-row">
        <div className="stat-left">Staked VTT</div>
        <div className="stat-right">4.16M</div>
      </div>
      <div className="stat-row">
        <div className="stat-left">Total Collateral Ratio</div>
        <div className="stat-right">333.5%</div>
      </div>
      <div className="stat-row">
        <div className="stat-left">Recovery Mode</div>
        <div className="stat-right">No</div>
      </div>
      <div className="stat-row">
        <div className="stat-left">Recovery Mode Price Threshold</div>
        <div className="stat-right">$1,194.42</div>
      </div>
    </Card>
  );
};
