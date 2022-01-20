import {useRouter} from "next/router";
import {sfApi, wrapper} from "../../redux/store";
import {GridColDef, GridRenderCellParams,} from "@mui/x-data-grid";
import {Box} from "@mui/material";
import QueryError from "../../components/QueryError";
import {useState} from "react";
import {skipToken} from "@reduxjs/toolkit/query";
import {createSkipPaging, SkipPaging} from "@superfluid-finance/sdk-core"
import AppLink from "../../components/AppLink";
import {AppDataGrid} from "../../components/AppDataGrid";
import {NextPage} from "next";
import {findNetwork} from "../../redux/networks";

const AccountsPage: NextPage = () => {
  const router = useRouter()

  const [paging, setPaging] = useState<SkipPaging>(createSkipPaging({
    take: 10
  }));

  const {networkName} = router.query;

  const queryResult = sfApi.useAccountsQuery(typeof networkName === "string" ? {
    chainId: findNetwork(networkName).chainId,
    pagination: paging
  } : skipToken);

  const columns: GridColDef[] = [
    {
      field: 'id', headerName: 'Address', flex: 1, renderCell: (params: GridRenderCellParams) => (
        <AppLink href={`/${networkName}/accounts/${params.id}`}
        >
          {params.id}
        </AppLink>
      ),
    },
  ];

  const rows = queryResult.data ? queryResult.data.data.map(x => ({
    id: x.id
  })) : [];

  return (
    <Box sx={{ width: '100%'}}>
      {
        queryResult.error && <QueryError error={queryResult.error}/>
      }
      {queryResult.data && (
        <div style={{minHeight: 256, width: "100%"}}>
          <AppDataGrid columns={columns} rows={rows} queryResult={queryResult} setPaging={setPaging} setOrdering={x => {
          }}/>
        </div>
      )}
    </Box>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(store => async () => {
  return {
    props: {},
  };
})

export default AccountsPage;

