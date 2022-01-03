import {Breadcrumbs, Link, Container, Typography, Box, Tabs, Tab} from "@mui/material";
import {useRouter} from "next/router";
import {ReactNode, useState} from "react";
import {sfApi} from "../../../redux/store";

const SuperTokenPage = () => {
  const router = useRouter()
  const { network, address } = router.query;


  // TODO(KK): useGetSuperTokenQuery

  // TODO(KK): Bit annoying to type out so many things...
  // TODO(KK): aliasing "data" is a bit annoying...
  const { data: pagedResult, error } = sfApi.useListSuperTokensQuery({
    chainId: Number(network), // TODO(KK): Ugly...
    isListed: undefined,
    skip: 0,
    take: 10
  }, {
    skip: window !== undefined
  });

  console.log({
    error,
    pagedResult
  })

  const [value, setValue] = useState(0);

  function a11yProps(index: number) {
    return {
      id: `tab-${index}`,
      'aria-controls': `tabpanel-${index}`,
    };
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const superToken = pagedResult ? pagedResult.data[0] : null;

  return (
    <Container>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
          Networks
        </Link>
        <Link underline="hover" color="inherit" href="/">
          {network}
        </Link>
        <Link underline="hover" color="inherit" href="/">
          Super Tokens
        </Link>
        <Link underline="hover" color="inherit" href="/">
          { address }
        </Link>
      </Breadcrumbs>
      <Typography variant="h1">
        { address }
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Overview" {...a11yProps(0)} />
          <Tab label="Streams" {...a11yProps(1)} />
          <Tab label="Indexes" {...a11yProps(2)} />
          <Tab label="Events" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>

        <Typography variant="h5" component="h2">
          Overview
        </Typography>

      </TabPanel>
      <TabPanel value={value} index={1}>

        <Typography variant="h5" component="h2">
          Streams
        </Typography>

      </TabPanel>
      <TabPanel value={value} index={2}>

        <Typography variant="h5" component="h2">
          Indexes
        </Typography>

      </TabPanel>
      <TabPanel value={value} index={3}>

        <Typography variant="h5" component="h2">
          Events
        </Typography>

      </TabPanel>
    </Container>
  )
}

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default SuperTokenPage;
