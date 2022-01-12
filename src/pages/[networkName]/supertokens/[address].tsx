import {FC, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {findNetwork, sfApi} from "../../../redux/store";
import {skipToken} from "@reduxjs/toolkit/query";
import {Card, CircularProgress, Container, List, ListItem, ListItemText, Typography} from "@mui/material";
import {Box} from "@mui/system";
import NetworkDisplay from "../../../components/NetworkDisplay";
import { Token } from "@superfluid-finance/sdk-core";
import {NextPage} from "next";
// import {getFramework} from "@superfluid-finance/sdk-redux/dist/module/sdkReduxConfig"; // TODO(KK): Think through the import

const SuperTokenPage: NextPage = () => {
  const router = useRouter()
  const {networkName, address} = router.query;

  const network = typeof networkName === "string" ? findNetwork(networkName) : undefined;
  const queryState = sfApi.useTokenQuery(network ? {
    chainId: network.chainId,
    id: getAddress(address)
  } : skipToken);

  const superToken: Token | null | undefined = queryState.data;

  const [totalSupply, setTotalSupply] = useState<string | undefined>();

  // useEffect(() => {
  //   if (network) {
  //     getFramework(network.chainId).then(x => x.loadSuperToken(getAddress(address))).then(async (x) => {
  //       setTotalSupply(x.totalSupply(await getFramework(network.chainId).))
  //     })
  //   }
  // }, [network])
  //
  // const web3Token = network ? getFramework(network.chainId). : ;



  // const queryState = sfApi.useListEventsQuery(network ? {
  //   chainId: network.chainId,
  //
  // } : skipToken);

  return (<Container>
    <Box>
      <Typography variant="h2" component="h1">
        Super Token
      </Typography>
      <Card>
        {(network && superToken) ? <List>
          <ListItem divider>
            <ListItemText primary={superToken.name} secondary="Name"/>
          </ListItem>
          <ListItem divider>
            <ListItemText secondary="Network" primary={<NetworkDisplay network={network}/>}/>
          </ListItem>
          <ListItem divider>
            <ListItemText secondary="Address" primary={superToken.id}/>
          </ListItem>
          <ListItem divider>
            <ListItemText secondary="Symbol" primary={superToken.symbol}/>
          </ListItem>
          <ListItem>
            <ListItemText secondary="Underlying Token Address" primary={superToken.underlyingAddress}/>
          </ListItem>
        </List> : <CircularProgress/>}
      </Card>

      {/*<Card>*/}
      {/*  {(network && superToken) ? <List>*/}
      {/*    <ListItem divider>*/}
      {/*      <ListItemText primary={superToken.name} secondary="Name"/>*/}
      {/*    </ListItem>*/}
      {/*    <ListItem divider>*/}
      {/*      <ListItemText secondary="Network" primary={<NetworkDisplay network={network}/>}/>*/}
      {/*    </ListItem>*/}
      {/*    <ListItem divider>*/}
      {/*      <ListItemText secondary="Address" primary={superToken.id}/>*/}
      {/*    </ListItem>*/}
      {/*    <ListItem divider>*/}
      {/*      <ListItemText secondary="Symbol" primary={superToken.symbol}/>*/}
      {/*    </ListItem>*/}
      {/*    <ListItem divider>*/}
      {/*      <ListItemText secondary="Underlying Token Address" primary={superToken.underlyingAddress}/>*/}
      {/*    </ListItem>*/}
      {/*  </List> : <CircularProgress/>}*/}
      {/*</Card>*/}
    </Box>
  </Container>);
}

SuperTokenPage.getInitialProps = () => {
  return {};
}

const getAddress = (address: unknown): string => {
  if (typeof address === "string") {
    return address;
  }
  throw Error(`Address ${address} not found. TODO(KK): error page`)
}

export default SuperTokenPage;
