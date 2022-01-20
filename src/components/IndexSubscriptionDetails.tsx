import {FC, useState} from "react";
import {sfSubgraph} from "../redux/store";
import {
  createSkipPaging, Index, IndexSubscription,
  Ordering,
  SkipPaging, SubscriptionUnitsUpdatedEventOrderBy
} from "@superfluid-finance/sdk-core";
import Container from "@mui/material/Container";
import {
  Box,
  Button,
  Card,
  List,
  ListItem, ListItemText, Skeleton,
  Typography
} from "@mui/material";
import SubscriptionUnitsUpdatedEventDataGrid from "./SubscriptionUnitsUpdatedEventDataGrid";
import {BigNumber} from "ethers";
import {skipToken} from "@reduxjs/toolkit/query";
import DetailsDialog from "./DetailsDialog";
import SuperTokenAddress from "./SuperTokenAddress";
import AccountAddress from "./AccountAddress";
import SkeletonAddress from "./skeletons/SkeletonAddress";
import {Network} from "../redux/networks";

interface Props {
  network: Network;
  indexSubscriptionId: string
}

const IndexSubscriptionDetails: FC<Props> = ({network, indexSubscriptionId}) => {
  const indexSubscriptionQuery = sfSubgraph.useIndexSubscriptionQuery({
    chainId: network.chainId,
    id: indexSubscriptionId
  });

  const indexSubscription: IndexSubscription | undefined | null = indexSubscriptionQuery.data

  const indexQuery = sfSubgraph.useIndexQuery(indexSubscription ? {
    chainId: network.chainId,
    id: indexSubscription.index
  } : skipToken);

  const index: Index | undefined | null = indexQuery.data

  const [subscriptionUnitsUpdatedEventPaging, setSubscriptionUnitsUpdatedEventPaging] = useState<SkipPaging>(createSkipPaging({
    take: 10
  }))
  const [subscriptionUnitsUpdatedEventPagingOrdering, setSubscriptionUnitsUpdatedEventOrdering] = useState<Ordering<SubscriptionUnitsUpdatedEventOrderBy> | undefined>()
  const subscriptionUnitsUpdatedEventQuery = sfSubgraph.useSubscriptionUnitsUpdatedEventsQuery({
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
    <Card variant="outlined">
      <List>
        <ListItem divider>
          <ListItemText secondary="Token"
                        primary={(network && indexSubscription) ?
                          <SuperTokenAddress network={network} address={indexSubscription.token}/> :
                          <SkeletonAddress/>}/>
        </ListItem>
        <ListItem divider>
          <ListItemText secondary="Publisher"
                        primary={(network && indexSubscription) ?
                          <AccountAddress network={network} address={indexSubscription.publisher}/> :
                          <SkeletonAddress/>}/>
        </ListItem>
        <ListItem divider>
          <ListItemText secondary="Subscriber"
                        primary={(network && indexSubscription) ?
                          <AccountAddress network={network} address={indexSubscription.subscriber}/> :
                          <SkeletonAddress/>}/>
        </ListItem>
        <ListItem>
          <ListItemText secondary="Total Units Received" primary={(indexSubscription && index) ? calculateUnitsReceived(
            BigNumber.from(index.indexValue),
            BigNumber.from(indexSubscription.totalAmountReceivedUntilUpdatedAt),
            BigNumber.from(indexSubscription.indexValueUntilUpdatedAt),
            Number(indexSubscription.units)
          ).toString() : <Skeleton sx={{width: "100px"}}/>}/>
        </ListItem>
      </List>
    </Card>
    <Card variant="outlined">
      <Typography variant="h3">
        Distributions
      </Typography>
      <SubscriptionUnitsUpdatedEventDataGrid
        queryResult={subscriptionUnitsUpdatedEventQuery}
        setPaging={setSubscriptionUnitsUpdatedEventPaging}
        ordering={subscriptionUnitsUpdatedEventPagingOrdering}
        setOrdering={setSubscriptionUnitsUpdatedEventOrdering}/>
    </Card>
  </Container>)
};

export default IndexSubscriptionDetails;

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
      <DetailsDialog open={open} handleClose={handleClose}>
        <IndexSubscriptionDetails {...props} />
      </DetailsDialog>
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
