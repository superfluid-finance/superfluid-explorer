import Tooltip from "@mui/material/Tooltip";
import {BigNumber, ethers} from "ethers";
import {FC} from "react";

const FlowRate: FC<{
  flowRate: string
}> = ({ flowRate }) => {
  return (<Tooltip title={flowRate} placement="right" arrow><span>{ethers.utils.formatEther(BigNumber.from(flowRate).mul(60 * 60).toString())} per hour</span></Tooltip>);
}

export default FlowRate;
