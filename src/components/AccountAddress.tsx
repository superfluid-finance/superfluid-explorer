import {FC} from "react";
import {ethers} from "ethers";
import AppLink from "./AppLink";
import {Network, sfApi} from "../redux/store";
import {CircularProgress, List, ListItem, ListItemText, Tooltip} from "@mui/material";
import QueryError from "./QueryError";

const AccountAddress: FC<{
  network: Network,
  address: string
}> = ({network, address}) => {
  return (
    <Tooltip title={<AccountAddressTooltipContent network={network} address={address}/>}><AppLink className="address"
                                                                                                  href={`/${network.name}/accounts/${address}`}>
      {ethers.utils.getAddress(address)}
    </AppLink></Tooltip>);
}

const AccountAddressTooltipContent: FC<{
  network: Network,
  address: string
}> = ({network, address}) => {
  const accountQuery = sfApi.useAccountQuery({
    chainId: network.chainId,
    id: address
  });

  if (accountQuery.isLoading) {
    return <CircularProgress/>
  }

  if (accountQuery.error) {
    return <QueryError error={accountQuery.error}/>
  }

  return (accountQuery.data ? (<List>
    <ListItem>
      <ListItemText primary={accountQuery.data.isSuperApp ? "SuperApp" : "Account"}/></ListItem>
  </List>) : null);
}

export default AccountAddress;
