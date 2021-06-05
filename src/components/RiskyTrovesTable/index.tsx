import React from "react";
import { Table } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const columns = [
  { title: "Owner", dataIndex: "owner", key: "owner" },
  { title: "Collateral (SOL)", dataIndex: "collateral", key: "collateral" },
  { title: "Debt (ROKS)", dataIndex: "debt", key: "debt" },
  { title: "Coll. Ratio", dataIndex: "collRatio", key: "collRatio" },
  {
    dataIndex: "",
    key: "x",
    render: () => <DeleteOutlined />,
  },
];

const data = [
  {
    owner: "0x5CE5...c441",
    collateral: "62.7844",
    debt: "145,433.29",
    collRatio: "113.4%",
  },
  {
    owner: "0x0C24...A0D2",
    collateral: "28.4114",
    debt: "59,767.99",
    collRatio: "124.9%",
  },
  {
    owner: "0x0001...C326",
    collateral: "8.6757	",
    debt: "16,635.42",
    collRatio: "137.0%",
  },
  {
    owner: "0xEcEc...5aFF",
    collateral: "202.0902",
    debt: "374,465.01",
    collRatio: "141.8%",
  },
];

export const RiskyTrovesTable = () => {
  return (
    <Table
      columns={columns}
      dataSource={data}
    />
  );
};
