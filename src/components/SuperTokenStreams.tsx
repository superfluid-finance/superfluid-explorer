import {Network, sfApi} from "../redux/store";
import {createSkipPaging, Index, Ordering, SkipPaging, Stream, StreamOrderBy} from "@superfluid-finance/sdk-core";
import {FC, ReactElement, useState} from "react";
import {GridColDef} from "@mui/x-data-grid";
import AccountAddress from "./AccountAddress";
import FlowRate from "./FlowRate";
import {StreamDetailsDialog} from "./StreamDetails";
import {AppDataGrid} from "./AppDataGrid";

interface Props {
  network: Network,
  tokenAddress: string
}

const SuperTokenStreams: FC<Props> = ({network, tokenAddress}): ReactElement => {
  const [streamPaging, setStreamPaging] = useState<SkipPaging>(createSkipPaging({
    take: 10
  }));
  const [streamOrdering, setStreamOrdering] = useState<Ordering<StreamOrderBy> | undefined>({
    orderBy: "createdAtTimestamp",
    orderDirection: "desc"
  });
  const streamQuery = sfApi.useStreamsQuery({
    chainId: network.chainId,
    pagination: streamPaging,
    filter: {
      token: tokenAddress
    },
    order: streamOrdering
  })

  const streamColumns: GridColDef[] = [
    {field: 'id', hide: true, flex: 1},
    {
      field: 'sender',
      headerName: "Sender",
      sortable: false,
      flex: 1,
      renderCell: (params) => (<AccountAddress network={network} address={params.value}/>)
    },
    {
      field: 'receiver',
      headerName: "Receiver",
      sortable: false,
      flex: 1,
      renderCell: (params) => (<AccountAddress network={network} address={params.value}/>)
    },
    {
      field: 'currentFlowRate',
      headerName: "Flow Rate",
      sortable: true,
      flex: 1,
      renderCell: (params) => (<FlowRate flowRate={params.value}/>)
    },
    {field: 'createdAtTimestamp', headerName: "Created At", sortable: true, flex: 1, renderCell: (params) => (new Date(params.value * 1000).toLocaleString())},
    {
      field: 'details', headerName: "Details", flex: 1, sortable: false, renderCell: (cellParams) => (
        <StreamDetailsDialog network={network} streamId={cellParams.id.toString()}/>
      )
    }
  ];

  const rows: Stream[] = streamQuery.data ? streamQuery.data.data : [];

  return <AppDataGrid columns={streamColumns} rows={rows} queryResult={streamQuery}
                      setPaging={setStreamPaging} ordering={streamOrdering}
                      setOrdering={(x: any) => setStreamOrdering(x)}/>
}

export default SuperTokenStreams;
