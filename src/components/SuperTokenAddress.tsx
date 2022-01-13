import {FC} from "react";
import {ethers} from "ethers";
import AppLink from "./AppLink";
import {Network, sfApi} from "../redux/store";
import {CircularProgress, Grid, List, ListItem, ListItemText, Tooltip, Typography} from "@mui/material";
import QueryError from "./QueryError";

const SuperTokenAddress: FC<{
  network: Network,
  address: string
}> = ({network, address}) => {
  return (<Tooltip title={<SuperTokenTooltipContent network={network} address={address}/>}><AppLink
    className="address" href={`/${network.slugName}/supertokens/${address}`}>
    {ethers.utils.getAddress(address)}
  </AppLink></Tooltip>);
}

const SuperTokenTooltipContent: FC<{
  network: Network,
  address: string
}> = ({network, address}) => {
  const tokenQuery = sfApi.useTokenQuery({
    chainId: network.chainId,
    id: address
  });

  if (tokenQuery.isLoading) {
    return <CircularProgress/>
  }

  if (tokenQuery.error) {
    return <QueryError error={tokenQuery.error}/>
  }

  // <List>
  //   <ListItem>
  //     <ListItemText primary={accountQuery.data.isSuperApp ? "SuperApp" : "Account"}/></ListItem>
  // </List>

  return (tokenQuery.data ? (<List>
    <ListItem><ListItemText primary="Super Token"/></ListItem>
    <ListItem><ListItemText primary={tokenQuery.data.name}/></ListItem>
  </List>) : null);
}

export const SuperTokenFormatted: FC<{
  address: string
  name: string,
  symbol: string,
}> = ({address, name, symbol}) => {
  return <span><Grid><Grid item xs={12}>{name} ({symbol})</Grid><Grid item
                                                                      xs={12}><Typography variant="caption" component="span">{ethers.utils.getAddress(address)}</Typography></Grid></Grid>
    </span>
}

export default SuperTokenAddress;
