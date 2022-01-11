import {FC} from "react";
import {Network} from "../redux/store";

const NetworkDisplay: FC<{network: Network}> = ({network}) => {
  return (<span>{`${network.name}`}</span>);
}

export default NetworkDisplay;
