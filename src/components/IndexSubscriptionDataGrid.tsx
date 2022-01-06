import {FC} from "react";
import {AppDataGrid} from "./AppDataGrid";
import {GridColDef} from "@mui/x-data-grid";
import {IndexSubscription, Ordering, PagedResult, SkipPaging} from "@superfluid-finance/sdk-core";
import {
  IndexSubscriptionOrderBy
} from "@superfluid-finance/sdk-core/src/subgraph/entities/indexSubscription/indexSubscription";

interface Props {
  queryResult: {
    isFetching: boolean
    data?: PagedResult<IndexSubscription>
  }
  setPaging: (paging: SkipPaging) => void;
  ordering?: Ordering<IndexSubscriptionOrderBy>;
  setOrdering: (ordering?: Ordering<IndexSubscriptionOrderBy>) => void;
}

const columns: GridColDef[] = [
  {field: 'id', hide: true, flex: 1}
];

const IndexSubscriptionDataGrid: FC<Props> = ({queryResult, setPaging, ordering, setOrdering}) => {
  const rows = queryResult.data ? queryResult.data.data.map((x: IndexSubscription) => ({
    id: x.id
  })) : [];

  return (<AppDataGrid columns={columns} rows={rows} queryResult={queryResult} setPaging={setPaging} ordering={ordering}
                       setOrdering={x => setOrdering(x as any)}/>);
}

export default IndexSubscriptionDataGrid;
