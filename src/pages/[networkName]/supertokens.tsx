import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {useRouter} from "next/router";
import {sfSubgraph, wrapper} from "../../redux/store";
import {skipToken} from "@reduxjs/toolkit/query";
import {NextPage} from "next";
import {findNetwork} from "../../redux/networks";

const columns: GridColDef[] = [
  {field: 'id', headerName: 'Address', width: 150},
  {field: 'symbol', headerName: 'Symbol', width: 150},
];

const SuperTokensPage: NextPage = () => {
  const router = useRouter()

  const {networkName} = router.query;

  const {data: pagedResult} = sfSubgraph.useTokensQuery(typeof networkName === "string" ? {
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

export const getServerSideProps = wrapper.getServerSideProps(store => async () => {
  return {
    props: {},
  };
})

export default SuperTokensPage;
