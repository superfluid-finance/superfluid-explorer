import {
  Box,
  Breadcrumbs,
  Card,
  Container,
  Link,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  Typography
} from "@mui/material";
import {ReactNode, SyntheticEvent, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {findNetwork, sfApi} from "../../../redux/store";
import {skipToken} from "@reduxjs/toolkit/query";
import AccountStreams from "../../../components/AccountStreams";
import AppLink from "../../../components/AppLink";
import AccountIndexes from "../../../components/AccountIndexes";
import AccountOverview from "../../../components/AccountOverview";
import {NextPage} from "next";
import NetworkDisplay from "../../../components/NetworkDisplay";
import SkeletonNetwork from "../../../components/skeletons/SkeletonNetwork";
import SkeletonAddress from "../../../components/skeletons/SkeletonAddress";
import SkeletonTokenName from "../../../components/skeletons/SkeletonTokenName";
import SkeletonTokenSymbol from "../../../components/skeletons/SkeletonTokenSymbol";
import {AccountAddressFormatted} from "../../../components/AccountAddress";

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

  return (<Container>
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
        <ListItem>
          <ListItemText secondary="Address"
                        primary={accountQuery.data ? <AccountAddressFormatted address={accountQuery.data.id} /> : <SkeletonAddress/>}/>
        </ListItem>
      </List>
    </Card>

    <Box sx={{mt: 3, mb: 2, borderBottom: 1, borderColor: 'divider'}}>
      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
        <Tab label="Super tokens" {...a11yProps(0)} />
        <Tab label="Streams" {...a11yProps(1)} />
        <Tab label="Indexes" {...a11yProps(2)} />
      </Tabs>
    </Box>

    <Box>
      <TabPanel value={value} index={0}>
        {(network && address) && <AccountOverview network={network} accountAddress={getAddress(address)}/>}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {(network && address) && <AccountStreams network={network} accountAddress={getAddress(address)}/>}
      </TabPanel>
      <TabPanel value={value} index={2}>
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

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
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
