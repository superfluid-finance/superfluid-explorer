import {DataGrid, GridColDef, GridRowsProp} from "@mui/x-data-grid";
import {useRouter} from "next/router";
import {findNetwork, networksByName, sfApi} from "../../redux/store";
import {skipToken} from "@reduxjs/toolkit/query";

const columns: GridColDef[] = [
  {field: 'id', headerName: 'Address', width: 150},
  {field: 'symbol', headerName: 'Symbol', width: 150},
];

const SuperTokensPage = () => {
  const router = useRouter()

  const {networkName} = router.query;

  const {data: pagedResult} = sfApi.useTokensQuery(typeof networkName === "string" ? {
    chainId: findNetwork(networkName).chainId, // TODO(KK): Ugly...
  } : skipToken);

  const rows = pagedResult ? pagedResult.data.map(x => ({
    id: x.id, // TODO(KK): "id" could be named "address"...
    symbol: x.symbol
  })) : [];

  return (
    <div style={{height: 300, width: '100%'}}>
      <DataGrid rows={rows} columns={columns} onRowClick={async (params) => {
        await router.push(`/${networkName}/supertokens/${params.id}`);
      }}/>
    </div>);
}

export default SuperTokensPage;
