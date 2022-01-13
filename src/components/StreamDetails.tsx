import {FC, forwardRef, ReactElement, Ref, useState} from "react";
import {Network, sfApi} from "../redux/store";
import {
  createSkipPaging,
  IndexSubscription,
  Ordering,
  SkipPaging, Stream,
  StreamPeriodOrderBy, SuperToken
} from "@superfluid-finance/sdk-core";
import Container from "@mui/material/Container";
import StreamPeriodDataGrid from "./StreamPeriodDataGrid";
import {
  AppBar,
  Box,
  Button,
  Card,
  Dialog,
  Grid,
  IconButton,
  List, ListItem, ListItemText, Skeleton,
  Slide,
  TextField,
  Toolbar,
  Typography
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {TransitionProps} from "@mui/material/transitions";
import {AppDataGrid} from "./AppDataGrid";
import DetailsDialog from "./DetailsDialog";
import AccountAddress from "./AccountAddress";
import SuperTokenAddress from "./SuperTokenAddress";
import SkeletonAddress from "./skeletons/SkeletonAddress";

interface Props {
  network: Network;
  streamId: string
}

const StreamDetails: FC<Props> = ({network, streamId}) => {
  const streamQuery = sfApi.useStreamQuery({
    chainId: network.chainId,
    id: streamId
  });

  const stream: Stream | undefined | null = streamQuery.data

  const [streamPeriodPaging, setStreamPeriodPaging] = useState<SkipPaging>(createSkipPaging())
  const [streamPeriodOrdering, setStreamPeriodOrdering] = useState<Ordering<StreamPeriodOrderBy> | undefined>()
  const streamPeriodListQuery = sfApi.useStreamPeriodsQuery({
    chainId: network.chainId,
    filter: {
      stream: streamId.toLowerCase()
    },
    pagination: streamPeriodPaging,
    order: streamPeriodOrdering
  });

  return (<Container>
    <Typography variant="h2">
      Stream Details
    </Typography>
    <Card variant="outlined">
      <List>
        <ListItem divider>
          <ListItemText primary="Token" secondary={(network && stream) ? <SuperTokenAddress network={network} address={stream.token}/> : <SkeletonAddress />}/>
        </ListItem>
        <ListItem divider>
          <ListItemText primary="Sender" secondary={(network && stream) ? <AccountAddress network={network} address={stream.sender}/> : <SkeletonAddress />}/>
        </ListItem>
        <ListItem divider>
          <ListItemText primary="Receiver" secondary={(network && stream) ? <AccountAddress network={network} address={stream.receiver}/> : <SkeletonAddress />}/>
        </ListItem>
        <ListItem divider>
          <ListItemText primary="Current Flow Rate" secondary={(stream) ? stream.currentFlowRate : <Skeleton sx={{width: "125px" }} />}/>
        </ListItem>
        <ListItem>
          <ListItemText primary="Created At" secondary={(stream) ? new Date(stream.createdAtTimestamp * 1000).toDateString() : <Skeleton sx={{width: "100px" }} />}/>
        </ListItem>
      </List>
    </Card>
    <Card variant="outlined">
      <Typography variant="h3">
        Stream Periods
      </Typography>
      <StreamPeriodDataGrid queryResult={streamPeriodListQuery} setPaging={setStreamPeriodPaging}
                            ordering={streamPeriodOrdering} setOrdering={setStreamPeriodOrdering}/>
    </Card>
  </Container>)
};

export const StreamDetailsDialog: FC<Props> = (props) => {
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
        <StreamDetails {...props} />
      </DetailsDialog>
    </Box>
  );
}
