import * as React from 'react';
import type {NextPage} from 'next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {Card, Divider, Tab} from "@mui/material";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import {networks} from "../redux/networks";
import {NetworkStreams} from "../components/networkStreams";
import _ from 'lodash';

const Home: NextPage = () => {
  const [value, setValue] = React.useState('matic');

  const networksOrdered = _.sortBy(networks, x => x.isTestnet, x => x.slugName)

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Superfluid Console
        </Typography>
      </Box>
      <Card>
        <Typography variant="h5" sx={{m: 2}}>
          Network Data
        </Typography>
        <Divider/>
        <TabContext value={value}>
          <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
            <TabList variant="scrollable"
                     scrollButtons="auto"
                     onChange={(_event, newValue: string) => setValue(newValue)}>
              {
                networksOrdered.map((network) => <Tab key={`Tab_${network.slugName}`} label={network.displayName} value={network.slugName}/>)
              }
            </TabList>
          </Box>
          {
            networksOrdered.map((network) => <TabPanel key={`TabPanel_${network.slugName}`} value={network.slugName}>
              <NetworkStreams network={network} />
            </TabPanel>)
          }
        </TabContext>
      </Card>
    </Container>
  );
};

export default Home;



