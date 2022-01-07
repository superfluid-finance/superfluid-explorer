import {DataGrid, GridColumns, GridRowsProp, GridSortModel} from "@mui/x-data-grid";
import {ILightEntity, PagedResult, SkipPaging, Ordering} from "@superfluid-finance/sdk-core";
import {Box, Pagination} from "@mui/material";
import {FC, ReactElement, useState} from "react";

interface Props {
  columns: GridColumns,
  rows: GridRowsProp,
  queryResult: {
    isFetching: boolean
    data?: PagedResult<ILightEntity>
  }
  setPaging: (paging: SkipPaging) => void;
  ordering?: Ordering<string>;
  setOrdering: (ordering?: Ordering<string>) => void;
}

export const AppDataGrid: FC<Props> = ({
                                         columns,
                                         rows,
                                         queryResult,
                                         setPaging,
                                         ordering,
                                         setOrdering
                                       }): ReactElement => {

  return (
    <DataGrid
      autoHeight={true}
      disableColumnFilter={true}
      pagination={true}
      rows={rows}
      columns={columns}
      paginationMode="server"
      components={{
        // Header: () => (<Box sx={{float: "right"}}><AppDataGridPagination paging={paging} hasNextPage={hasNextPage}
        //                                                                  setPaging={setPaging}/></Box>),
        Pagination: () =>
          AppDataGridPagination({
            paging: queryResult.data?.paging as SkipPaging,
            hasNextPage: !!queryResult.data?.nextPaging,
            setPaging
          }),
      }}
      loading={queryResult.isFetching}
      disableSelectionOnClick={true}
      sortingMode={"server"}
      sortModel={ordering ? [{
        field: ordering.orderBy,
        sort: ordering.orderDirection,
      }] : []}
      onSortModelChange={(sortModel) => setOrdering(sortModel[0] ? {
        orderBy: sortModel[0].field,
        orderDirection: sortModel[0].sort! // TODO(KK): Forbidden
      } : undefined)}
    />)
}

interface PaginationProps {
  paging?: SkipPaging,
  hasNextPage: boolean,
  setPaging: (paging: SkipPaging) => void
}

const AppDataGridPagination: FC<PaginationProps> = ({paging, hasNextPage, setPaging}) => {
  if (!paging) {
    return (<></>);
  }

  const pageSize = paging.take;
  const page = (paging.skip / pageSize) + 1;
  return ((page == 1 && !hasNextPage) ? <></> :
      <Pagination
        count={hasNextPage ? page + 1 : page}
        disabled={(page === 1 && !hasNextPage)}
        page={page}
        onChange={(event, value) => setPaging({
          skip: (value - 1) * pageSize,
          take: paging.take
        })}
      />
  );
};
