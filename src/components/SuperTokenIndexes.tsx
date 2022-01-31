import {sfSubgraph} from "../redux/store";
import {createSkipPaging, Ordering, SkipPaging} from "@superfluid-finance/sdk-core";
import {FC, ReactElement, useState} from "react";
import {
  Index_OrderBy
} from "@superfluid-finance/sdk-core";
import PublishedIndexDataGrid from "./PublishedIndexDataGrid";
import {Network} from "../redux/networks";

interface Props {
  network: Network,
  tokenAddress: string
}

const SuperTokenIndexes: FC<Props> = ({network, tokenAddress}): ReactElement => {
  const [publishedIndexPaging, setPublishedIndexPaging] = useState<SkipPaging>(createSkipPaging({
    take: 10
  }));
  const [publishedIndexOrdering, setPublishedIndexOrdering] = useState<Ordering<Index_OrderBy> | undefined>({
    orderBy: "createdAtTimestamp",
    orderDirection: "desc"
  });
  const publishedIndexQuery = sfSubgraph.useIndexesQuery({
    chainId: network.chainId,
    pagination: publishedIndexPaging,
    filter: {
      token: tokenAddress
    },
    order: publishedIndexOrdering
  })

  return <PublishedIndexDataGrid network={network} queryResult={publishedIndexQuery} setPaging={setPublishedIndexPaging}
                                 ordering={publishedIndexOrdering} setOrdering={setPublishedIndexOrdering}/>
}

export default SuperTokenIndexes;
