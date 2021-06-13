import React from "react";
import { Card, Col, Input, Row, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { usePrice, useUpdatePrice } from "../../../contexts/price";

export const PriceFeedCard = () => {
  const SOL_VALUE = usePrice().toFixed(2);
  const updatePrice = useUpdatePrice();
  return (
    <Card title="Price" className="cards">
      <Row>
        <Col span={2} className="align-to-input">
          SOL
        </Col>
        <Col span={18}>
          <Input
            suffix={
              <Tooltip title={"Current SOL value to USD is " + SOL_VALUE + "."}>
                <InfoCircleOutlined />
              </Tooltip>
            }
            value={`$${SOL_VALUE}`}
            // eslint-disable-next-line
            addonAfter={<a onClick={() => updatePrice()}>Refresh</a>}
          />
        </Col>
      </Row>
    </Card>
  );
};
