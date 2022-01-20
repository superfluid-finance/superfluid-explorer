import {FC} from "react";
import {ethers} from "ethers";
import AppLink from "./AppLink";
import {sfApi} from "../redux/store";
import {CircularProgress, List, ListItem, ListItemText, Tooltip} from "@mui/material";
import QueryError from "./QueryError";
import {Network} from "../redux/networks";

// <Tooltip title={<AccountAddressTooltipContent network={network} address={address}/>}>
// </Tooltip>
const AccountAddress: FC<{
  network: Network,
  address: string
}> = ({network, address, children}) => {
  return (
    <AppLink className="address"
             href={`/${network.slugName}/accounts/${address}`}>
      <AccountAddressFormatted address={address}/>
    </AppLink>);
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

export const AccountAddressFormatted: FC<{
  address: string
}> = ({address}) => {
  return <>{ethers.utils.getAddress(address)}</>
}

export default AccountAddress;
