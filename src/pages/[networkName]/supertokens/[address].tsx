import {ReactNode, SyntheticEvent, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {findNetwork, sfApi} from "../../../redux/store";
import {skipToken} from "@reduxjs/toolkit/query";
import {
  Card,
  Container,
  List,
  ListItem,
  ListItemText, Tab,
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

const SuperTokenPage: NextPage = () => {
  const router = useRouter()
  const {networkName, address} = router.query;

  const network = typeof networkName === "string" ? findNetwork(networkName) : undefined;
  const tokenQuery = sfApi.useTokenQuery(network ? {
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

  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (<Container className="page">
    <Typography variant="h3" component="h1" sx={{mt: 2, mb: 4}}>
      Super Token
    </Typography>
    <Typography variant="h6" component="h2" sx={{ml: 1, mb: 1}}>
      Overview
    </Typography>
    <Card variant="outlined">
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

    <Box sx={{mt: 3, mb: 2, borderBottom: 1, borderColor: 'divider'}} >
      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
        <Tab label="Events"/>
        <Tab label="Streams"/>
        <Tab label="Indexes"/>
      </Tabs>
    </Box>

    <Box>
      <TabPanel value={value} index={0}>
        {(network && address) && <EventList network={network} address={getAddress(address)}/>}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {(network && address) && <SuperTokenStreams network={network} tokenAddress={getAddress(address)}/>}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {(network && address) &&
          <SuperTokenIndexes network={network} tokenAddress={getAddress(address)}/>}
      </TabPanel>
    </Box>
  </Container>)
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

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {value === index && children}
        </Box>
      )}
    </div>
  );
}

