import {FC} from "react";
import {ethers} from "ethers";
import AppLink from "./AppLink";
import {Network} from "../redux/store";

const SuperTokenAddress: FC<{
  network: Network,
  address: string,
}> = ({network, address}) => {
  return (<AppLink href={`/${network.name}/supertokens/${address}`}>
    {ethers.utils.getAddress(address)}
  </AppLink>);
}

export default SuperTokenAddress;
