import {FC, useState} from "react";
import {sfSubgraph} from "../redux/store";
import {
  createSkipPaging,
  Ordering,
  SkipPaging, Stream,
  StreamPeriodOrderBy
} from "@superfluid-finance/sdk-core";
import Container from "@mui/material/Container";
import StreamPeriodDataGrid from "./StreamPeriodDataGrid";
import {
  Box,
  Button,
  Card,
  List, ListItem, ListItemText, Skeleton,
  Typography
} from "@mui/material";
import DetailsDialog from "./DetailsDialog";
import AccountAddress from "./AccountAddress";
import SuperTokenAddress from "./SuperTokenAddress";
import SkeletonAddress from "./skeletons/SkeletonAddress";
import FlowingBalance from "./FlowingBalance";
import {Network} from "../redux/networks";

interface Props {
  network: Network;
  streamId: string
}

const StreamDetails: FC<Props> = ({network, streamId}) => {
  const streamQuery = sfSubgraph.useStreamQuery({
    chainId: network.chainId,
    id: streamId
  });

  const stream: Stream | undefined | null = streamQuery.data

  const [streamPeriodPaging, setStreamPeriodPaging] = useState<SkipPaging>(createSkipPaging())
  const [streamPeriodOrdering, setStreamPeriodOrdering] = useState<Ordering<StreamPeriodOrderBy> | undefined>({
    orderBy: "startedAtTimestamp",
    orderDirection: "desc"
  })
  const streamPeriodListQuery = sfSubgraph.useStreamPeriodsQuery({
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
          <ListItemText secondary="Token" primary={(network && stream) ? <SuperTokenAddress network={network} address={stream.token}/> : <SkeletonAddress />}/>
        </ListItem>
        <ListItem divider>
          <ListItemText secondary="Sender" primary={(network && stream) ? <AccountAddress network={network} address={stream.sender}/> : <SkeletonAddress />}/>
        </ListItem>
        <ListItem divider>
          <ListItemText secondary="Receiver" primary={(network && stream) ? <AccountAddress network={network} address={stream.receiver}/> : <SkeletonAddress />}/>
        </ListItem>
        <ListItem divider>
          <ListItemText secondary="Current Flow Rate" primary={(stream) ? stream.currentFlowRate : <Skeleton sx={{width: "125px" }} />}/>
        </ListItem>
        <ListItem divider>
          <ListItemText secondary="Total Amount Streamed" primary={(stream) ? <FlowingBalance
            {...{
              balance: stream.streamedUntilUpdatedAt,
              balanceTimestamp: stream.updatedAtTimestamp,
              flowRate: stream.currentFlowRate
            }}
          /> : <Skeleton sx={{width: "125px" }} />}/>
        </ListItem>
        <ListItem>
          <ListItemText secondary="Created At" primary={(stream) ? new Date(stream.createdAtTimestamp * 1000).toDateString() : <Skeleton sx={{width: "100px" }} />}/>
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
