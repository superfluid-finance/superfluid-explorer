import {FC} from "react";
import {AppDataGrid} from "./AppDataGrid";
import {GridColDef} from "@mui/x-data-grid";
import {
  IndexSubscription,
  Ordering,
  PagedResult,
  SkipPaging,
  SubscriptionUnitsUpdatedEvent,
  SubscriptionUnitsUpdatedEventOrderBy
} from "@superfluid-finance/sdk-core";

interface Props {
  queryResult: {
    isFetching: boolean
    data?: PagedResult<SubscriptionUnitsUpdatedEvent>
  }
  setPaging: (paging: SkipPaging) => void;
  ordering: Ordering<SubscriptionUnitsUpdatedEventOrderBy> | undefined;
  setOrdering: (ordering?: Ordering<SubscriptionUnitsUpdatedEventOrderBy>) => void;
}

const columns: GridColDef[] = [
  {field: 'id', hide: true, sortable: false, flex: 1},
  {field: 'timestamp', headerName: "Distribution Date", sortable: true, flex: 1, renderCell: (params) => (new Date(params.value * 1000).toLocaleString())},
  {field: 'units', headerName: "Units", sortable: true, flex: 1},
];

const SubscriptionUnitsUpdatedEventDataGrid: FC<Props> = ({queryResult, setPaging, ordering, setOrdering}) => {
  const rows: SubscriptionUnitsUpdatedEvent[] = queryResult.data ? queryResult.data.data : [];

  return (<AppDataGrid columns={columns} rows={rows} queryResult={queryResult} setPaging={setPaging} ordering={ordering}
                       setOrdering={x => setOrdering(x as any)}/>);
}

export default SubscriptionUnitsUpdatedEventDataGrid;


