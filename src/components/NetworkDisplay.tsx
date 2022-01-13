import {FC} from "react";
import {Network} from "../redux/store";

const NetworkDisplay: FC<{network: Network}> = ({network}) => {
  return (<>{`${network.displayName}`}</>);
}

export default NetworkDisplay;
