import {DataGrid, GridColDef, GridRowsProp} from "@mui/x-data-grid";
import {useRouter} from "next/router";
import {findNetwork, networksByName, sfApi} from "../../redux/store";

const columns: GridColDef[] = [
  {field: 'address', headerName: 'Address', width: 150},
  {field: 'symbol', headerName: 'Symbol', width: 150},
];

const SuperTokensPage = () => {
  const router = useRouter()
  const {networkName} = router.query;
  console.log("foo")
  console.log({
    query: router.query
  })

  const network = findNetwork(networkName);
  if (!network) {
    throw Error(`Network ${networkName} not found. TODO(KK): error page`)
  }

  const {data: pagedResult} = sfApi.useListSuperTokensQuery({
    chainId: network.chainId, // TODO(KK): Ugly...
    isListed: undefined,
    skip: 0,
    take: 10
  });

  const rows = pagedResult ? pagedResult.data.map(x => ({
    address: x.id, // TODO(KK): "id" could be named "address"...
    symbol: x.symbol
  })) : [];

  return (
    <div style={{height: 300, width: '100%'}}>
      <DataGrid rows={rows} columns={columns}/>
    </div>);
}

export default SuperTokensPage;
