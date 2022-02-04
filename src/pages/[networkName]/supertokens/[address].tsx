import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { sfSubgraph, sfApi } from "../../../redux/store";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  Breadcrumbs,
  Card,
  Container, Grid,
  List,
  ListItem,
  ListItemText, Skeleton, Tab,
  Typography
} from "@mui/material";
import { Box } from "@mui/system";
import NetworkDisplay from "../../../components/NetworkDisplay";
import { Token } from "@superfluid-finance/sdk-core";
import { NextPage } from "next";
import SuperTokenIndexes from "../../../components/SuperTokenIndexes";
import SuperTokenStreams from "../../../components/SuperTokenStreams";
import SkeletonNetwork from "../../../components/skeletons/SkeletonNetwork";
import SkeletonTokenSymbol from "../../../components/skeletons/SkeletonTokenSymbol";
import SkeletonAddress from "../../../components/skeletons/SkeletonAddress";
import SkeletonTokenName from "../../../components/skeletons/SkeletonTokenName";
import EventList from "../../../components/EventList";
import { findNetwork } from "../../../redux/networks";
import { TabContext, TabList, TabPanel } from "@mui/lab";

const SuperTokenPage: NextPage = () => {
  const router = useRouter()
  const { networkName, address } = router.query;

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

  const [tabValue, setTabValue] = useState<string>("streams");

  return (
    <Container component={Box} sx={{ my: 2, py: 2 }}>

      <Grid container spacing={3}>
        
        <Grid item xs={12}>
          <Breadcrumbs aria-label="breadcrumb">
            <Typography color="text.secondary">{network && network.displayName}</Typography>
            <Typography color="text.secondary">Super Tokens</Typography>
            <Typography color="text.secondary">{superToken && superToken.symbol}</Typography>
          </Breadcrumbs>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h3" component="h1">
            {superToken ? superToken.name : <SkeletonTokenName />}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Card elevation={2}>
            <Grid container>
              <Grid item md={6}>
                <List>
                  <ListItem divider>
                    <ListItemText secondary="Symbol"
                      primary={superToken ? superToken.symbol : <SkeletonTokenSymbol />} />
                  </ListItem>
                  <ListItem divider>
                    <ListItemText secondary="Address" primary={superToken ? superToken.id : <SkeletonAddress />} />
                  </ListItem>
                  <ListItem divider>
                    <ListItemText secondary="Listed" primary={superToken ? (superToken.isListed ? "Yes" : "No") : <Skeleton sx={{ width: "20px"}} />} />
                  </ListItem>
                </List>
              </Grid>
              <Grid item md={6}>
                <List>
                  <ListItem divider>
                    <ListItemText secondary="Network"
                      primary={network ? <NetworkDisplay network={network} /> : <SkeletonNetwork />} />
                  </ListItem>
                  <ListItem divider>
                    <ListItemText secondary="Underlying Token Address"
                      primary={superToken ? superToken.underlyingAddress : <SkeletonAddress />} />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card elevation={2}>
            <TabContext value={tabValue}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList variant="scrollable"
                  scrollButtons="auto"
                  onChange={(_event, newValue: string) => setTabValue(newValue)}
                  aria-label="tabs">
                  <Tab label="Streams" value="streams" />
                  <Tab label="Indexes" value="indexes" />
                  <Tab label="Events" value="events" />
                </TabList>
              </Box>
              <Box>
                <TabPanel value="events">
                  {(network && address) && <EventList network={network} address={getAddress(address)} />}
                </TabPanel>
                <TabPanel value="streams">
                  {(network && address) && <SuperTokenStreams network={network} tokenAddress={getAddress(address)} />}
                </TabPanel>
                <TabPanel value="indexes">
                  {(network && address) &&
                    <SuperTokenIndexes network={network} tokenAddress={getAddress(address)} />}
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
