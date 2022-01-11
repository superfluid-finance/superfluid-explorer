import {FC} from "react";
import {ethers} from "ethers";
import AppLink from "./AppLink";
import {Network, sfApi} from "../redux/store";
import {Box, CircularProgress, List, ListItem, Tooltip} from "@mui/material";
import QueryError from "./QueryError";

const SuperTokenAddress: FC<{
  network: Network,
  address: string
}> = ({network, address}) => {
  return (<><AppLink className="address" href={`/${network.name}/supertokens/${address}`}>
    <Box component="span" sx={{
      textOverflow: "ellipsis"
    }}>
      {ethers.utils.getAddress(address)}
    </Box>
  </AppLink><Tooltip title={<ToolTipContent network={network} address={address}/>}><p>Test</p></Tooltip></>);
}

const ToolTipContent: FC<{
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

  return (tokenQuery.data ? (<List>
    <ListItem>{tokenQuery.data.name}</ListItem>
  </List>) : null);
}

export default SuperTokenAddress;
