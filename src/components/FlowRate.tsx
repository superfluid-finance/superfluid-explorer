import {FC} from "react";
import {ethers} from "ethers";
import AppLink from "./AppLink";
import {Network} from "../redux/store";

const FlowRate: FC<{
  flowRate: string
}> = ({ flowRate }) => {
  return (<span>{flowRate}</span>);
}

export default FlowRate;
