import {FC, forwardRef, ReactElement, Ref, useState} from "react";
import {Network, sfApi} from "../redux/store";
import {
  createSkipPaging, Index, IndexSubscriptionOrderBy,
  IndexUpdatedEventOrderBy,
  Ordering,
  SkipPaging
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
import DetailsDialog from "./DetailsDialog";
import SuperTokenAddress from "./SuperTokenAddress";
import AccountAddress from "./AccountAddress";
import IndexSubscriptionDataGrid from "./IndexSubscriptionDataGrid";

interface Props {
  network: Network;
  indexId: string
}

const IndexPublicationDetails: FC<Props> = ({network, indexId}) => {
  const indexQuery = sfApi.useIndexQuery({
    chainId: network.chainId,
    id: indexId
  });

  const [indexUpdatedEventPaging, setIndexUpdatedEventPaging] = useState<SkipPaging>(createSkipPaging({
    take: 10
  }))
  const [indexUpdatedEventPagingOrdering, setIndexUpdatedEventOrdering] = useState<Ordering<IndexUpdatedEventOrderBy> | undefined>()
  const indexUpdatedEventQuery = sfApi.useIndexUpdatedEventsQuery({
    chainId: network.chainId,
    filter: {
      index: indexId.toLowerCase()
    },
    pagination: indexUpdatedEventPaging,
    order: indexUpdatedEventPagingOrdering
  });

  const [indexSubscriptionPaging, setIndexSubscriptionPaging] = useState<SkipPaging>(createSkipPaging({
    take: 10
  }))
  const [indexSubscriptionPagingOrdering, setIndexSubscriptionOrdering] = useState<Ordering<IndexSubscriptionOrderBy> | undefined>()
  const indexSubscriptionEventQuery = sfApi.useIndexSubscriptionsQuery({
    chainId: network.chainId,
    filter: {
      index: indexId.toLowerCase()
    },
    pagination: indexSubscriptionPaging,
    order: indexSubscriptionPagingOrdering
  });

  const index: Index | undefined | null = indexQuery.data

  return (<Container>
    <Typography variant="h2">
      Published Index Details
    </Typography>
    {
      index && (<>
        <Card variant="outlined">
          <List>
            <ListItem divider>
              <ListItemText primary="Token" secondary={<SuperTokenAddress network={network} address={index.token}/>}/>
            </ListItem>
            <ListItem divider>
              <ListItemText primary="Publisher"
                            secondary={<AccountAddress network={network} address={index.publisher}/>}/>
            </ListItem>
            <ListItem divider>
              <ListItemText primary="Total Units" secondary={index.totalUnits}/>
            </ListItem>
            <ListItem>
              <ListItemText primary="Total Distributed" secondary={index.totalAmountDistributedUntilUpdatedAt}/>
            </ListItem>
          </List>
        </Card>
        <Card variant="outlined">
          <Typography variant="h3">
            Distributions
          </Typography>
          <IndexUpdatedEventDataGrid index={index} queryResult={indexUpdatedEventQuery}
                                     setPaging={setIndexUpdatedEventPaging}
                                     ordering={indexUpdatedEventPagingOrdering}
                                     setOrdering={setIndexUpdatedEventOrdering}/>
        </Card>
        <Card variant="outlined">
          <Typography variant="h3">
            Subscriptions
          </Typography>
          <IndexSubscriptionDataGrid network={network}
                                     queryResult={indexSubscriptionEventQuery}
                                     setPaging={setIndexSubscriptionPaging}
                                     ordering={indexSubscriptionPagingOrdering}
                                     setOrdering={setIndexSubscriptionOrdering}/>
        </Card>
      </>)}
  </Container>)
};

export default IndexPublicationDetails;

export const IndexPublicationDetailsDialog: FC<Props> = (props) => {
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
        <IndexPublicationDetails {...props} />
      </DetailsDialog>
    </Box>
  );
}

