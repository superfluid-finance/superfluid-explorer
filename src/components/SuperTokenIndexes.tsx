import {Network, sfApi} from "../redux/store";
import {Account, createSkipPaging, Ordering, SkipPaging} from "@superfluid-finance/sdk-core";
import {FC, ReactElement, useState} from "react";
import IndexSubscriptionDataGrid from "./IndexSubscriptionDataGrid";
import {
  IndexSubscriptionOrderBy,
  IndexOrderBy
} from "@superfluid-finance/sdk-core";
import PublishedIndexDataGrid from "./PublishedIndexDataGrid";
import {Card, Typography} from "@mui/material";

interface Props {
  network: Network,
  tokenAddress: string
}

const SuperTokenIndexes: FC<Props> = ({network, tokenAddress}): ReactElement => {
  const [publishedIndexPaging, setPublishedIndexPaging] = useState<SkipPaging>(createSkipPaging({
    take: 10
  }));
  const [publishedIndexOrdering, setPublishedIndexOrdering] = useState<Ordering<IndexOrderBy> | undefined>(undefined);
  const publishedIndexQuery = sfApi.useIndexesQuery({
    chainId: network.chainId,
    pagination: publishedIndexPaging,
    filter: {
      token: tokenAddress
    },
    order: publishedIndexOrdering
  })

  return <>
    <Typography variant="h5" component="h2">
      Indexes
    </Typography>
    <PublishedIndexDataGrid network={network} queryResult={publishedIndexQuery} setPaging={setPublishedIndexPaging}
                            ordering={publishedIndexOrdering} setOrdering={setPublishedIndexOrdering}/>
  </>
}

export default SuperTokenIndexes;
