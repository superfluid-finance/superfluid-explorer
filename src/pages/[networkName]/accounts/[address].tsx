import {
  Box,
  Card,
  Container,
  List,
  ListItem,
  ListItemText, Skeleton,
  Tab,
  Tabs,
  Typography
} from "@mui/material";
import {ReactNode, SyntheticEvent, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {findNetwork, sfApi} from "../../../redux/store";
import {skipToken} from "@reduxjs/toolkit/query";
import AccountStreams from "../../../components/AccountStreams";
import AccountIndexes from "../../../components/AccountIndexes";
import AccountTokens from "../../../components/AccountTokens";
import {NextPage} from "next";
import NetworkDisplay from "../../../components/NetworkDisplay";
import SkeletonNetwork from "../../../components/skeletons/SkeletonNetwork";
import SkeletonAddress from "../../../components/skeletons/SkeletonAddress";
import {AccountAddressFormatted} from "../../../components/AccountAddress";
import EventList from "../../../components/EventList";

const getAddress = (address: unknown): string => {
  if (typeof address === "string") {
    return address;
  }

  throw Error(`Address ${address} not found. TODO(KK): error page`)
}

const AccountPage: NextPage = () => {
  const router = useRouter()
  const {networkName, address} = router.query;
  const [value, setValue] = useState(0);

  const network = typeof networkName === "string" ? findNetwork(networkName) : undefined;
  const accountQuery = sfApi.useAccountQuery(network ? {
    chainId: network.chainId,
    id: getAddress(address)
  } : skipToken);

  const [triggerMonitoring, monitorResult] = sfApi.useMonitorForEventsToInvalidateCacheMutation();
  useEffect(() => {
    if (network && accountQuery.data && monitorResult.isUninitialized) {
      triggerMonitoring({
        chainId: network.chainId,
        address: accountQuery.data.id
      });
      return monitorResult.reset;
    }
  }, [])

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (<Container className="page">
    <Typography variant="h3" component="h1" sx={{mt: 2, mb: 4}}>
      Account
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
          <ListItemText secondary="Address"
                        primary={accountQuery.data ? <AccountAddressFormatted address={accountQuery.data.id}/> :
                          <SkeletonAddress/>}/>
        </ListItem>
        <ListItem>
          <ListItemText secondary="Account Type"
                        primary={accountQuery.data ? (accountQuery.data.isSuperApp ? "Super App" : "Regular account") :
                          <Skeleton sx={{width: "40px"}}/>}/>
        </ListItem>
      </List>
    </Card>

    <Box sx={{mt: 3, mb: 2, borderBottom: 1, borderColor: 'divider'}}>
      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
        <Tab label="Events" />
        <Tab label="Super tokens" />
        <Tab label="Streams" />
        <Tab label="Indexes" />
      </Tabs>
    </Box>

    <Box>
      <TabPanel value={value} index={0}>
        {(network && address) && <EventList network={network} address={getAddress(address)}/>}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {(network && address) && <AccountTokens network={network} accountAddress={getAddress(address)}/>}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {(network && address) && <AccountStreams network={network} accountAddress={getAddress(address)}/>}
      </TabPanel>
      <TabPanel value={value} index={3}>
        {(network && address) && <AccountIndexes network={network} accountAddress={getAddress(address)}/>}
      </TabPanel>
    </Box>
  </Container>);

}

AccountPage.getInitialProps = () => {
  return {};
}

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

export default AccountPage;
