"use client";

import { Typography } from "antd";

export const MASTER_DATA_EMPTY_MESSAGE =
  "Please create this master data in ERPNext first.";

export default function MasterDataEmptyHint() {
  return <Typography.Text type="secondary">{MASTER_DATA_EMPTY_MESSAGE}</Typography.Text>;
}
