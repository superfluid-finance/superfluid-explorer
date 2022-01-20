import {FC} from "react";
import {ethers} from "ethers";
import AppLink from "./AppLink";
import {sfSubgraph} from "../redux/store";
import {CircularProgress, List, ListItem, ListItemText, Tooltip} from "@mui/material";
import QueryError from "./QueryError";
import {Network} from "../redux/networks";
import {useAppSelector} from "../redux/hooks";
import {addressBookSelectors, createEntryId} from "../redux/slices/addressBook.slice";

// <Tooltip title={<AccountAddressTooltipContent network={network} address={address}/>}>
// </Tooltip>
const AccountAddress: FC<{
  network: Network,
  address: string
}> = ({network, address, children}) => {
  return (
    <AppLink className="address"
             href={`/${network.slugName}/accounts/${address}`}>
      <AccountAddressFormatted network={network} address={address}/>
    </AppLink>);
}

const AccountAddressTooltipContent: FC<{
  network: Network,
  address: string
}> = ({network, address}) => {
  const accountQuery = sfSubgraph.useAccountQuery({
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
  network: Network
  address: string
}> = ({network, address}) => {
  const addressBookEntry = useAppSelector(state => addressBookSelectors.selectById(state, createEntryId(network, address)));

  return <>{addressBookEntry?.nameTag ? `${addressBookEntry.nameTag} (${ethers.utils.getAddress(address)})` : ethers.utils.getAddress(address)}</>
}

export default AccountAddress;
