import {DataGrid, GridColDef, GridRowsProp} from "@mui/x-data-grid";
import {useRouter} from "next/router";
import {findNetwork, networksByName, sfApi} from "../../redux/store";

const columns: GridColDef[] = [
  {field: 'id', headerName: 'Address', width: 150},
  {field: 'symbol', headerName: 'Symbol', width: 150},
];

const SuperTokensPage = () => {
  // Disable for prerendering.
  if (typeof window === 'undefined') {
    return <></>;
  }

  const router = useRouter()
  const {networkName} = router.query;

  const network = findNetwork(networkName);
  if (!network) {
    throw Error(`Network ${networkName} not found. TODO(KK): error page`)
  }

  const {data: pagedResult} = sfApi.useTokensQuery({
    chainId: network.chainId, // TODO(KK): Ugly...
  });

  const rows = pagedResult ? pagedResult.data.map(x => ({
    id: x.id, // TODO(KK): "id" could be named "address"...
    symbol: x.symbol
  })) : [];

  return (
    <div style={{height: 300, width: '100%'}}>
      <DataGrid rows={rows} columns={columns}/>
    </div>);
}

export default SuperTokensPage;
