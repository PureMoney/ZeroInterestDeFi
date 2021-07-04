import { Button, Col, Row, Typography, Input } from "antd";
import React from "react";
import { Card } from 'antd';
import { ReloadOutlined } from "@ant-design/icons";

const { Title } = Typography;

export const StakingView = () => {
  return (
    <Row justify="start" style={{textAlign: "left"}}>
      <Col span={6}/>
      <Col span={12}>
        <Card
          title={<Title level={3}>Staking</Title>}
          style={{ margin: "1rem" }}
          extra={<Button
                  shape="circle"
                  icon={<ReloadOutlined />}
                  />
                }>
          <Input suffix="VTT" type="number" size="large" />
          <Row style={{textAlign: "center"}}>
            <Col span={24} style={{margin: "1rem"}}>
              <Button>Confirm</Button>
              {" "}
              <Button>Cancel</Button>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={6}/>
    </Row>
  );
};
