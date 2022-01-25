import {ReactNode, SyntheticEvent, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {sfSubgraph, sfApi, wrapper} from "../../../redux/store";
import {skipToken} from "@reduxjs/toolkit/query";
import {
  Card,
  Container, Divider, Grid,
  List,
  ListItem,
  ListItemText, Paper, Tab,
  Tabs,
  Typography
} from "@mui/material";
import {Box} from "@mui/system";
import NetworkDisplay from "../../../components/NetworkDisplay";
import {Token} from "@superfluid-finance/sdk-core";
import {NextPage} from "next";
import SuperTokenIndexes from "../../../components/SuperTokenIndexes";
import SuperTokenStreams from "../../../components/SuperTokenStreams";
import SkeletonNetwork from "../../../components/skeletons/SkeletonNetwork";
import SkeletonTokenSymbol from "../../../components/skeletons/SkeletonTokenSymbol";
import SkeletonAddress from "../../../components/skeletons/SkeletonAddress";
import SkeletonTokenName from "../../../components/skeletons/SkeletonTokenName";
import EventList from "../../../components/EventList";
import {findNetwork, networks} from "../../../redux/networks";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import {NetworkStreams} from "../../../components/networkStreams";
import * as React from "react";

const SuperTokenPage: NextPage = () => {
  const router = useRouter()
  const {networkName, address} = router.query;

  const network = typeof networkName === "string" ? findNetwork(networkName) : undefined;

  const tokenQuery = sfSubgraph.useTokenQuery(network ? {
    chainId: network.chainId,
    id: getAddress(address)
  } : skipToken);

  const [triggerMonitoring, monitorResult] = sfApi.useMonitorForEventsToInvalidateCacheMutation();
  useEffect(() => {
    if (network && tokenQuery.data) {
      triggerMonitoring({
        chainId: network.chainId,
        address: tokenQuery.data.id
      });
      return monitorResult.reset;
    }
  }, [])

  const superToken: Token | null | undefined = tokenQuery.data;

  const [totalSupply, setTotalSupply] = useState<string | undefined>();

  const [tabValue, setTabValue] = useState<string>("streams");

  return (
    <Container component={Paper} elevation={1} sx={{my: 2, py: 2}}>

      <Grid container spacing={3}>

        <Grid item>
          <Typography variant="h3" component="h1">
            Super Token
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Card elevation={2}>
            <Typography variant="h6" component="h2" sx={{ml: 1, mb: 2, mt: 2}}>
              Overview
            </Typography>
            <Divider/>
            <List>
              <ListItem divider>
                <ListItemText secondary="Network"
                              primary={network ? <NetworkDisplay network={network}/> : <SkeletonNetwork/>}/>
              </ListItem>
              <ListItem divider>
                <ListItemText secondary="Address" primary={superToken ? superToken.id : <SkeletonAddress/>}/>
              </ListItem>
              <ListItem divider>
                <ListItemText primary={superToken ? superToken.name : <SkeletonTokenName/>} secondary="Name"/>
              </ListItem>
              <ListItem divider>
                <ListItemText secondary="Symbol"
                              primary={superToken ? superToken.symbol : <SkeletonTokenSymbol/>}/>
              </ListItem>
              <ListItem>
                <ListItemText secondary="Underlying Token Address"
                              primary={superToken ? superToken.underlyingAddress : <SkeletonAddress/>}/>
              </ListItem>
            </List>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card elevation={2}>
            <TabContext value={tabValue}>
              <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <TabList variant="scrollable"
                         scrollButtons="auto"
                         onChange={(_event, newValue: string) => setTabValue(newValue)}
                         aria-label="tabs">
                  <Tab label="Events" value="events"/>
                  <Tab label="Streams" value="streams"/>
                  <Tab label="Indexes" value="indexes"/>
                </TabList>
              </Box>
              <Box>
                <TabPanel value="events">
                  {(network && address) && <EventList network={network} address={getAddress(address)}/>}
                </TabPanel>
                <TabPanel value="streams">
                  {(network && address) && <SuperTokenStreams network={network} tokenAddress={getAddress(address)}/>}
                </TabPanel>
                <TabPanel value="indexes">
                  {(network && address) &&
                    <SuperTokenIndexes network={network} tokenAddress={getAddress(address)}/>}
                </TabPanel>
              </Box>
            </TabContext>
          </Card>
        </Grid>

      </Grid>

    </Container>
  )
}

const getAddress = (address: unknown): string => {
  if (typeof address === "string") {
    return address;
  }
  throw Error(`Address ${address} not found. TODO(KK): error page`)
}

export default SuperTokenPage;
