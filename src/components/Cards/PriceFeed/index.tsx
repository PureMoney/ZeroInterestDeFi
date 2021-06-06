import React from "react";
import { Card, Col, Input, Row, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const SOL_VALUE = "$ 49.620";

export const PriceFeedCard = () => {
  return (
    <Card title="Price" className="cards">
      <Row>
        <Col span={2} className="align-to-input">
          SOL
        </Col>
        <Col span={8}>
          <Input
            suffix={
              <Tooltip title={"Current SOL value to USD is " + SOL_VALUE + "."}>
                <InfoCircleOutlined />
              </Tooltip>
            }
            disabled={true}
            value={SOL_VALUE}
          />
        </Col>
      </Row>
    </Card>
  );
};
