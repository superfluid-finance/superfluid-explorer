import * as React from "react";
import {FC, useMemo, useState} from "react";
import {Network} from "../redux/networks";
import {GridColDef} from "@mui/x-data-grid";
import SuperTokenAddress from "./SuperTokenAddress";
import FlowRate from "./FlowRate";
import AccountAddress from "./AccountAddress";
import {createSkipPaging, Ordering, SkipPaging, Stream, StreamOrderBy} from "@superfluid-finance/sdk-core";
import FlowingBalance from "./FlowingBalance";
import {timeAgo} from "../utils/dateTime";
import {StreamDetailsDialog} from "./StreamDetails";
import {sfSubgraph} from "../redux/store";
import {AppDataGrid} from "./AppDataGrid";

export const NetworkStreams: FC<{ network: Network }> = ({network}) => {
  const columns: GridColDef[] = useMemo(() => [
    {field: 'id', type: "string", hide: true, sortable: false},
    {
      field: 'token',
      headerName: "Token",
      flex: 1,
      sortable: false,
      renderCell: (params) => (<SuperTokenAddress network={network} address={params.value}/>)
    },
    {
      field: 'currentFlowRate',
      headerName: "Flow Rate",
      flex: 1,
      sortable: true,
      renderCell: (params) => (<FlowRate flowRate={params.value}/>)
    },
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
    {
      field: 'createdAtTimestamp',
      headerName: "Created At",
      sortable: true,
      flex: 0.5,
      renderCell: (params) => (timeAgo(params.value * 1000))
    },
    {
      field: 'details', headerName: "Details", flex: 0.5, sortable: false, renderCell: (cellParams) => (
        <StreamDetailsDialog network={network} streamId={cellParams.id.toString()}/>
      )
    }
  ], [network.chainId]);

  const [ordering, setOrdering] = useState<Ordering<StreamOrderBy> | undefined>({
    orderBy: "createdAtTimestamp",
    orderDirection: "desc"
  });
  const [paging, setPaging] = useState<SkipPaging>(createSkipPaging({
    take: 10
  }));

  const query = sfSubgraph.useStreamsQuery({
    chainId: network.chainId,
    order: ordering,
    pagination: paging
  });

  const rows = query.data ? query.data.data : [];

  return (<AppDataGrid columns={columns} rows={rows} queryResult={query}
                       setPaging={setPaging} ordering={ordering}
                       setOrdering={(x: any) => setOrdering(x)}
                       headerTitle="Latest Streams"/>);
}
