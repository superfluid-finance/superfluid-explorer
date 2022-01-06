import {FC} from "react";
import {AppDataGrid} from "./AppDataGrid";
import {GridColDef} from "@mui/x-data-grid";
import {Index, IndexSubscription, Ordering, PagedResult, SkipPaging} from "@superfluid-finance/sdk-core";
import {IndexOrderBy} from "@superfluid-finance/sdk-core/src/subgraph/entities/index";

interface Props {
  queryResult: {
    isFetching: boolean
    data?: PagedResult<Index>
  }
  setPaging: (paging: SkipPaging) => void;
  ordering?: Ordering<IndexOrderBy>;
  setOrdering: (ordering?: Ordering<IndexOrderBy>) => void;
}

const columns: GridColDef[] = [
  {field: 'id', hide: true, flex: 1}
];

const PublishedIndexDataGrid: FC<Props> = ({queryResult, setPaging, ordering, setOrdering}) => {
  const rows = queryResult.data ? queryResult.data.data.map((x: Index) => ({
    id: x.id
  })) : [];

  return (<AppDataGrid columns={columns} rows={rows} queryResult={queryResult} setPaging={setPaging} ordering={ordering}
                       setOrdering={x => setOrdering(x as any)}/>);
}

export default PublishedIndexDataGrid;
