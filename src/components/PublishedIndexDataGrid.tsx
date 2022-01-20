import {FC} from "react";
import {AppDataGrid} from "./AppDataGrid";
import {GridColDef} from "@mui/x-data-grid";
import {Index, Ordering, PagedResult, SkipPaging, IndexOrderBy} from "@superfluid-finance/sdk-core";
import {IndexPublicationDetailsDialog} from "./IndexPublicationDetails";
import SuperTokenAddress from "./SuperTokenAddress";
import {Network} from "../redux/networks";

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

const epochs: [string, number][] = [
  ['year', 31536000],
  ['month', 2592000],
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
  ['second', 1]
];

const getDuration = (timeAgoInSeconds: number) => {
  for (let [name, seconds] of epochs) {
    const interval = Math.floor(timeAgoInSeconds / seconds);
    if (interval >= 1) {
      return {
        interval: interval,
        epoch: name
      };
    }
  }
};

const timeAgo = (date: number) => {
  const timeAgoInSeconds = Math.floor((new Date().valueOf() - new Date(date).valueOf()) / 1000);
  // @ts-ignore
  const {interval, epoch} = getDuration(timeAgoInSeconds);
  const suffix = interval === 1 ? '' : 's';
  return `${interval} ${epoch}${suffix} ago`;
};

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
