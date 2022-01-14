import {Network, sfApi} from "../redux/store";
import {FC, ReactElement, useState} from "react";
import {createSkipPaging, Ordering, SkipPaging, Stream, StreamOrderBy} from "@superfluid-finance/sdk-core";
import {AppDataGrid} from "./AppDataGrid";
import {GridColDef} from "@mui/x-data-grid";
import {Box, Card, Typography} from "@mui/material";
import {StreamDetailsDialog} from "./StreamDetails";
import FlowingBalance from "./FlowingBalance";
import SuperTokenAddress from "./SuperTokenAddress";
import FlowRate from "./FlowRate";
import AccountAddress from "./AccountAddress";

interface Props {
  network: Network,
  accountAddress: string
}

const AccountStreams: FC<Props> = ({network, accountAddress}): ReactElement => {
  // TODO(KK): cast sort field to orderby type

  const incomingStreamColumns: GridColDef[] = [
    {field: 'id', type: "string", hide: true, sortable: false},
    {field: 'token', headerName: "Token", flex: 1, sortable: false, renderCell: (params) => (<SuperTokenAddress network={network} address={params.value} />)},
    {field: 'sender', headerName: "Sender", sortable: false, flex: 1, renderCell: (params) => (<AccountAddress network={network} address={params.value} />)},
    {field: 'currentFlowRate', headerName: "Flow Rate", flex: 1, sortable: true, renderCell: (params) => (<FlowRate flowRate={params.value} />)},
    {
      field: 'streamedUntilUpdatedAt',
      headerName: "Total Streamed",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const stream = params.row as Stream;
        return (<FlowingBalance
          {...{
            balance: stream.streamedUntilUpdatedAt,
            balanceTimestamp: stream.updatedAtTimestamp,
            flowRate: stream.currentFlowRate
          }}
        />)
      }
    },
    {field: 'createdAtTimestamp', headerName: "Created At", sortable: true, flex: 1, renderCell: (params) => (new Date(params.value * 1000).toLocaleString())},
    {
      field: 'details', headerName: "Details", flex: 1, sortable: false, renderCell: (cellParams) => (
        <StreamDetailsDialog network={network} streamId={cellParams.id.toString()}/>
      )
    }
  ];

  const [incomingStreamOrdering, setIncomingStreamOrdering] = useState<Ordering<StreamOrderBy> | undefined>({
    orderBy: "createdAtTimestamp",
    orderDirection: "desc"
  });
  const [incomingStreamPaging, setIncomingStreamPaging] = useState<SkipPaging>(createSkipPaging({
    take: 10
  }));

  const incomingStreamsQuery = sfApi.useStreamsQuery({
    chainId: network.chainId,
    filter: {
      receiver: accountAddress
    },
    pagination: incomingStreamPaging,
    order: incomingStreamOrdering
  });

  const incomingStreamRows: Stream[] = incomingStreamsQuery.data ? incomingStreamsQuery.data.data : [];

  const [outgoingStreamOrdering, setOutgoingStreamOrdering] = useState<Ordering<StreamOrderBy> | undefined>({
    orderBy: "createdAtTimestamp",
    orderDirection: "desc"
  });
  const [outgoingStreamPaging, setOutgoingStreamPaging] = useState<SkipPaging>(createSkipPaging({
    take: 10
  }));

  const outgoingStreamColumns: GridColDef[] = [
    {field: 'id', hide: true, flex: 1},
    {field: 'token', headerName: "Token", sortable: false, flex: 1, renderCell: (params) => (<SuperTokenAddress network={network} address={params.value} />)},
    {field: 'receiver', headerName: "Receiver", sortable: false, flex: 1, renderCell: (params) => (<AccountAddress network={network} address={params.value} />)},
    {field: 'currentFlowRate', headerName: "Flow Rate", sortable: true, flex: 1, renderCell: (params) => (<FlowRate flowRate={params.value} />)},
    {
      field: 'streamedUntilUpdatedAt',
      headerName: "Total Streamed",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const stream = params.row as Stream;
        return (<FlowingBalance
          {...{
            balance: stream.streamedUntilUpdatedAt,
            balanceTimestamp: stream.updatedAtTimestamp,
            flowRate: stream.currentFlowRate
          }}
        />)
      }
    },
    {field: 'createdAtTimestamp', headerName: "Created At", sortable: true, flex: 1, renderCell: (params) => (new Date(params.value * 1000).toLocaleString())},
    {
      field: 'details', headerName: "Details", flex: 1, sortable: false, renderCell: (cellParams) => (
        <StreamDetailsDialog network={network} streamId={cellParams.id.toString()}/>
      )
    }
  ];

  const outgoingStreamsQuery = sfApi.useStreamsQuery({
    chainId: network.chainId,
    filter: {
      sender: accountAddress
    },
    pagination: outgoingStreamPaging,
    order: outgoingStreamOrdering
  });

  const outgoingStreamRows: Stream[] = outgoingStreamsQuery.data ? outgoingStreamsQuery.data.data : [];

  // TODO(KK): get rid of anys

  return (<Box>
    <Card variant="outlined">
      <Typography variant="h5" component="h3">
        Incoming
      </Typography>
      <AppDataGrid columns={incomingStreamColumns} rows={incomingStreamRows} queryResult={incomingStreamsQuery}
                   setPaging={setIncomingStreamPaging} ordering={incomingStreamOrdering}
                   setOrdering={(x: any) => setIncomingStreamOrdering(x)}/>
    </Card>
    <Card variant="outlined">
      <Typography variant="h5" component="h3">
        Outgoing
      </Typography>
      <AppDataGrid columns={outgoingStreamColumns} rows={outgoingStreamRows} queryResult={outgoingStreamsQuery}
                   setPaging={setOutgoingStreamPaging} ordering={outgoingStreamOrdering}
                   setOrdering={(x: any) => setOutgoingStreamOrdering(x)}/>
    </Card>
  </Box>);
}

export default AccountStreams;
