import {FC, forwardRef, ReactElement, Ref, useState} from "react";
import {Network, sfApi} from "../redux/store";
import {createSkipPaging, Ordering, SkipPaging, StreamPeriodOrderBy} from "@superfluid-finance/sdk-core";
import Container from "@mui/material/Container";
import StreamPeriodDataGrid from "./StreamPeriodDataGrid";
import {AppBar, Box, Button, Dialog, Grid, IconButton, Slide, TextField, Toolbar, Typography} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {TransitionProps} from "@mui/material/transitions";
import {AppDataGrid} from "./AppDataGrid";

interface Props {
  network: Network;
  streamId: string
}

const StreamDetails: FC<Props> = ({network, streamId}) => {
  const streamQuery = sfApi.useStreamQuery({
    chainId: network.chainId,
    id: streamId
  });

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
    {streamQuery.data && (<><Grid container spacing={2}>
      <Grid item xs={8}>
        Sender
      </Grid>
      <Grid item xs={4}>
        {streamQuery.data.sender}
      </Grid>
      <Grid item xs={8}>
        Receiver
      </Grid>
      <Grid item xs={4}>
        {streamQuery.data.receiver}
      </Grid></Grid></>)}
    <div style={{height: 640, width: "100%"}}>
      <StreamPeriodDataGrid queryResult={streamPeriodListQuery} setPaging={setStreamPeriodPaging}
                            ordering={streamPeriodOrdering} setOrdering={setStreamPeriodOrdering}/>
    </div>

  </Container>)
};


const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
        <StreamDetails {...props} />
      </Dialog>
    </Box>
  );
}

