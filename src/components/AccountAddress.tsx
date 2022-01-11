import {FC} from "react";
import {ethers} from "ethers";
import AppLink from "./AppLink";
import {Network} from "../redux/store";

const AccountAddress: FC<{
  network: Network,
  address: string
}> = ({network, address}) => {
  return (<AppLink className="address" href={`/${network.name}/accounts/${address}`}>
    {ethers.utils.getAddress(address)}
  </AppLink>);
}

export default AccountAddress;
