import {FC} from "react";
import {AppDataGrid} from "./AppDataGrid";
import {GridColDef} from "@mui/x-data-grid";
import {IndexSubscription, Ordering, PagedResult, SkipPaging} from "@superfluid-finance/sdk-core";
import {
  IndexSubscriptionOrderBy
} from "@superfluid-finance/sdk-core/src/subgraph/entities/indexSubscription/indexSubscription";
import {Network} from "../redux/store";
import {IndexSubscriptionDetailsDialog} from "./IndexSubscriptionDetails";

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
    {field: 'publisher', headerName: "Publisher", flex: 1},
    {field: 'token', headerName: "Token", flex: 1},
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
