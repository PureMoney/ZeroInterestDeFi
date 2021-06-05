import React from "react";
import { useWallet } from "../../contexts/wallet";
import { Col, Row, Tabs, Typography } from "antd";
import { LABELS } from "../../constants";
import { DashboardContent } from "../dashboard";
import { FarmContent } from "../farm";
import { RedemptionContent } from "../redemption";
import { RiskyTrovesContent } from "../riskyTroves";

const { Title } = Typography;
const { TabPane } = Tabs;

const screens = [
  {
    title: "DASHBOARD",
    component: <DashboardContent />,
  },
  {
    title: "FARM",
    component: <FarmContent />,
  },
  {
    title: "RISKY TROVES",
    component: <RiskyTrovesContent />,
  },
  {
    title: "REDEMPTION",
    component: <RedemptionContent />,
  },
];

const tabs = (
  <Tabs defaultActiveKey="0" centered>
    {screens.map((screen, i) => (
      <TabPane tab={screen.title} key={i}>
        {screen.component}
      </TabPane>
    ))}
  </Tabs>
);

export const HomeView = () => {
  const { connected } = useWallet();

  const alignStyle = !connected ? "middle" : undefined;

  return (
    <Row justify="center" align={alignStyle} style={{ margin: 10 }}>
      <Col span={24}>
        {!connected && <Title level={3}>{LABELS.CONNECT_WALLET_MESSAGE}</Title>}
        {connected && tabs}
      </Col>
    </Row>
  );
};
