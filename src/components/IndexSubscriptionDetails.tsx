import {FC, forwardRef, ReactElement, Ref, useState} from "react";
import {Network, sfApi} from "../redux/store";
import {
  createSkipPaging, Index, IndexSubscription,
  IndexUpdatedEventOrderBy,
  Ordering,
  SkipPaging, SubscriptionUnitsUpdatedEventOrderBy
} from "@superfluid-finance/sdk-core";
import Container from "@mui/material/Container";
import {
  AppBar,
  Box,
  Button,
  Card,
  Dialog,
  Divider,
  IconButton,
  List,
  ListItem, ListItemText,
  Slide,
  Toolbar,
  Typography
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {TransitionProps} from "@mui/material/transitions";
import IndexUpdatedEventDataGrid from "./IndexUpdatedEventDataGrid";
import SubscriptionUnitsUpdatedEventDataGrid from "./SubscriptionUnitsUpdatedEventDataGrid";
import {BigNumber} from "ethers";
import {skipToken} from "@reduxjs/toolkit/query";

interface Props {
  network: Network;
  indexSubscriptionId: string
}

const IndexSubscriptionDetails: FC<Props> = ({network, indexSubscriptionId}) => {
  const indexSubscriptionQuery = sfApi.useIndexSubscriptionQuery({
    chainId: network.chainId,
    id: indexSubscriptionId
  });

  const indexSubscription: IndexSubscription | undefined | null = indexSubscriptionQuery.data

  const indexQuery = sfApi.useIndexQuery(indexSubscription ? {
    chainId: network.chainId,
    id: indexSubscription.index
  } : skipToken);

  const index: Index | undefined | null = indexQuery.data

  const [subscriptionUnitsUpdatedEventPaging, setSubscriptionUnitsUpdatedEventPaging] = useState<SkipPaging>(createSkipPaging({
    take: 10
  }))
  const [subscriptionUnitsUpdatedEventPagingOrdering, setSubscriptionUnitsUpdatedEventOrdering] = useState<Ordering<SubscriptionUnitsUpdatedEventOrderBy> | undefined>()
  const subscriptionUnitsUpdatedEventQuery = sfApi.useSubscriptionUnitsUpdatedEventsQuery({
    chainId: network.chainId,
    filter: {
      subscription: indexSubscriptionId.toLowerCase()
    },
    pagination: subscriptionUnitsUpdatedEventPaging,
    order: subscriptionUnitsUpdatedEventPagingOrdering
  });

  return (<Container>
    <Typography variant="h2">
      Index Subscription Details
    </Typography>
    {
      (indexSubscription && index) && (<>
        <Card>
          <List>
            <ListItem divider>
              <ListItemText primary="Token" secondary={indexSubscription.token}/>
            </ListItem>
            <ListItem divider>
              <ListItemText primary="Publisher" secondary={indexSubscription.publisher}/>
            </ListItem>
            <ListItem>
              <ListItemText primary="Subscriber" secondary={indexSubscription.subscriber}/>
            </ListItem>
            <ListItem>
              <ListItemText primary="Total Units Received" secondary={calculateUnitsReceived(
                BigNumber.from(index.indexValue),
                BigNumber.from(indexSubscription.totalAmountReceivedUntilUpdatedAt),
                BigNumber.from(indexSubscription.indexValueUntilUpdatedAt),
                Number(indexSubscription.units)
                ).toString()}/>
            </ListItem>
          </List>
        </Card>
        <Card>
          <Typography variant="h3">
            Distributions
          </Typography>
          <SubscriptionUnitsUpdatedEventDataGrid indexSubscription={indexSubscription} queryResult={subscriptionUnitsUpdatedEventQuery}
                                     setPaging={setSubscriptionUnitsUpdatedEventPaging}
                                     ordering={subscriptionUnitsUpdatedEventPagingOrdering}
                                     setOrdering={setSubscriptionUnitsUpdatedEventOrdering}/>
        </Card>
      </>)}
  </Container>)
};

export default IndexSubscriptionDetails;

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const IndexSubscriptionDetailsDialog: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Button variant="outlined" onClick={handleClickOpen}>
        Details
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{position: 'relative'}}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon/>
            </IconButton>
          </Toolbar>
        </AppBar>
        <IndexSubscriptionDetails {...props} />
      </Dialog>
    </Box>
  );
}

const calculateUnitsReceived = (
  publisherIndexValue: BigNumber,
  subscriberTotalAmountReceivedUntilUpdatedAt: BigNumber,
  subscriberIndexValueUntilUpdatedAt: BigNumber,
  subscriberUnits: number
) => {
  const totalUnitsReceived = subscriberTotalAmountReceivedUntilUpdatedAt.add(
    publisherIndexValue
      .sub(subscriberIndexValueUntilUpdatedAt)
      .mul(subscriberUnits)
  );

  return totalUnitsReceived;
};
