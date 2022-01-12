import {FC} from "react";
import {AppDataGrid} from "./AppDataGrid";
import {GridColDef} from "@mui/x-data-grid";
import {
  IndexSubscription,
  IndexSubscriptionOrderBy,
  Ordering,
  PagedResult,
  SkipPaging
} from "@superfluid-finance/sdk-core";
import {Network} from "../redux/store";
import {IndexSubscriptionDetailsDialog} from "./IndexSubscriptionDetails";
import AccountAddress from "./AccountAddress";
import SuperTokenAddress from "./SuperTokenAddress";

interface Props {
  network: Network,
  queryResult: {
    isFetching: boolean
    data?: PagedResult<IndexSubscription>
  }
  setPaging: (paging: SkipPaging) => void;
  ordering: Ordering<IndexSubscriptionOrderBy> | undefined;
  setOrdering: (ordering?: Ordering<IndexSubscriptionOrderBy>) => void;
}

const IndexSubscriptionDataGrid: FC<Props> = ({network, queryResult, setPaging, ordering, setOrdering}) => {
  const columns: GridColDef[] = [
    {field: 'id', hide: true},
    {field: 'publisher', headerName: "Publisher", flex: 1, renderCell: (params) => (<AccountAddress network={network} address={params.value} />)},
    {field: 'token', headerName: "Token", flex: 1, renderCell: (params) => (<SuperTokenAddress network={network} address={params.value} />)},
    {field: 'approved', headerName: "Approved", flex: 1},
    {field: 'units', headerName: "Total Index Units", flex: 1},
    {field: 'totalAmountReceivedUntilUpdatedAt', headerName: "Total Amount Received", flex: 1},
    {field: 'units', headerName: "Subscription Units", flex: 1},
    {
      field: 'details', headerName: "Details", flex: 1, sortable: false, renderCell: (cellParams) => (
        <IndexSubscriptionDetailsDialog network={network} indexSubscriptionId={cellParams.id.toString()}/>
      )
    }
  ];

  const rows: IndexSubscription[] = queryResult.data ? queryResult.data.data : [];

  return (<AppDataGrid columns={columns} rows={rows} queryResult={queryResult} setPaging={setPaging} ordering={ordering}
                       setOrdering={x => setOrdering(x as any)}/>);
}

export default IndexSubscriptionDataGrid;
