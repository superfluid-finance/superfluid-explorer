import {FC} from "react";
import {Network} from "../redux/networks";

const NetworkDisplay: FC<{network: Network}> = ({network}) => {
  return (<>{`${network.displayName}`}</>);
}

export default NetworkDisplay;
