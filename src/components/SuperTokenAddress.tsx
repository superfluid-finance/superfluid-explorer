import {FC} from "react";
import {ethers} from "ethers";
import AppLink from "./AppLink";
import {sfApi} from "../redux/store";
import {CircularProgress, Grid, List, ListItem, ListItemText, Tooltip, Typography} from "@mui/material";
import QueryError from "./QueryError";
import {Network} from "../redux/networks";

// <Tooltip title={<SuperTokenTooltipContent network={network} address={address}/>}>
//*</Tooltip>*/}
const SuperTokenAddress: FC<{
  network: Network,
  address: string
}> = ({network, address}) => {
  const tokenQuery = sfApi.useTokenQuery({
    chainId: network.chainId,
    id: address
  })

  const appLink = (<AppLink className="address" href={`/${network.slugName}/supertokens/${address}`}>
    {tokenQuery.data ? <>{tokenQuery.data.name} ({tokenQuery.data.symbol})</> : ethers.utils.getAddress(address)}
  </AppLink>);

  return (<>
    {tokenQuery.data ?
      <Tooltip title={tokenQuery.data.id} placement="right" arrow>
        {appLink}
      </Tooltip> : appLink
    }</>);
}


// <Tooltip title={tokenQuery.data.id}>
// </Tooltip>
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
  return <Grid><Grid item xs={12}>{name} ({symbol})</Grid><Grid item
                                                                xs={12}><Typography variant="caption"
                                                                                    component="span">{ethers.utils.getAddress(address)}</Typography></Grid></Grid>
}

export default SuperTokenAddress;
