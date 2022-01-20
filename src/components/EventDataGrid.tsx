import {FC, SyntheticEvent} from "react";
import {AppDataGrid} from "./AppDataGrid";
import {GridColDef} from "@mui/x-data-grid";
import {useRouter} from "next/router";
import {
  AllEvents,
  Ordering,
  PagedResult,
  SkipPaging
} from "@superfluid-finance/sdk-core";
import {Network} from "../redux/store";
import {Event_OrderBy} from "@superfluid-finance/sdk-core/dist/module/subgraph/schema.generated";


export type EventOrderBy = Event_OrderBy;
// TODO(KK): bad import

interface Props {
  network: Network,
  queryResult: {
    isFetching: boolean
    data?: PagedResult<AllEvents>
  }
  setPaging: (paging: SkipPaging) => void;
  ordering: Ordering<EventOrderBy> | undefined;
  setOrdering: (ordering?: Ordering<EventOrderBy>) => void;
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


const EventDataGrid: FC<Props> = ({network, queryResult, setPaging, ordering, setOrdering}) => {
  const router = useRouter()

  const columns: GridColDef[] = [
    {field: 'id', hide: true, sortable: false, flex: 1},
    {field: 'name', headerName: "Name", sortable: false, flex: 1},
    {
      field: 'timestamp',
      headerName: "Timestamp",
      sortable: false,
      flex: 1,
      renderCell: (params) => (timeAgo(params.value * 1000))
    },
    {field: 'blockNumber', headerName: "Block Number", sortable: false, flex: 1},
    {
      field: 'transactionHash', headerName: "Transaction Hash", sortable: false, flex: 1, renderCell: (params) => {
        const onTransactionHashClick = (e: SyntheticEvent): void => {
          e.stopPropagation()
          router.push(network.getLinkForTransaction(params.value))
        }

        return (
          <span style={{cursor: 'pointer'}} onClick={onTransactionHashClick}>{params.value}</span>)
      }
    }
  ];
  const rows: AllEvents[] = queryResult.data ? queryResult.data.data : [];

  return (<AppDataGrid columns={columns} rows={rows} queryResult={queryResult} setPaging={setPaging} ordering={ordering}
                       setOrdering={x => setOrdering(x as any)}/>);
}

export default EventDataGrid;
