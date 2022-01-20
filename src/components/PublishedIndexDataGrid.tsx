import {FC} from "react";
import {AppDataGrid} from "./AppDataGrid";
import {GridColDef} from "@mui/x-data-grid";
import {Index, Ordering, PagedResult, SkipPaging, IndexOrderBy} from "@superfluid-finance/sdk-core";
import {IndexPublicationDetailsDialog} from "./IndexPublicationDetails";
import SuperTokenAddress from "./SuperTokenAddress";
import {Network} from "../redux/networks";
import {timeAgo} from "../utils/dateTime";

interface Props {
  network: Network,
  queryResult: {
    isFetching: boolean
    data?: PagedResult<Index>
  }
  setPaging: (paging: SkipPaging) => void;
  ordering: Ordering<IndexOrderBy> | undefined;
  setOrdering: (ordering?: Ordering<IndexOrderBy>) => void;
  // columnsToHide: string[];
}

const PublishedIndexDataGrid: FC<Props> = ({network, queryResult, setPaging, ordering, setOrdering}) => {
  const columns: GridColDef[] = [
    {field: 'id', hide: true, flex: 1},
    // {field: 'publisher', headerName: "Publisher", flex: 1, renderCell: (params) => (<AccountAddress network={network} address={params.value} />)},
    {field: 'token', headerName: "Token", sortable: true, flex: 1, renderCell: (params) => (<SuperTokenAddress network={network} address={params.value} />)},
    {field: 'totalUnits', headerName: "Total Units", sortable: true, flex: 1},
    {field: 'totalAmountDistributedUntilUpdatedAt', headerName: "Total Distributed", sortable: true, flex: 1},
    {field: 'createdAtTimestamp', headerName: "Created At", sortable: true, flex: 1, renderCell: (params) => (timeAgo(params.value * 1000))},
    {
      field: 'details', headerName: "Details", flex: 1, sortable: false, renderCell: (cellParams) => (
        <IndexPublicationDetailsDialog network={network} indexId={cellParams.id.toString()}/>
      )
    }
  ];

  const rows: Index[] = queryResult.data ? queryResult.data.data : [];

  return (<AppDataGrid columns={columns} rows={rows} queryResult={queryResult} setPaging={setPaging} ordering={ordering}
                       setOrdering={x => setOrdering(x as any)} />);
}

export default PublishedIndexDataGrid;
