import {Network, sfApi} from "../redux/store";
import {createSkipPaging, Ordering, SkipPaging} from "@superfluid-finance/sdk-core";
import {FC, ReactElement, useState} from "react";
import {
  IndexOrderBy
} from "@superfluid-finance/sdk-core";
import PublishedIndexDataGrid from "./PublishedIndexDataGrid";

interface Props {
  network: Network,
  tokenAddress: string
}

const SuperTokenIndexes: FC<Props> = ({network, tokenAddress}): ReactElement => {
  const [publishedIndexPaging, setPublishedIndexPaging] = useState<SkipPaging>(createSkipPaging({
    take: 10
  }));
  const [publishedIndexOrdering, setPublishedIndexOrdering] = useState<Ordering<IndexOrderBy> | undefined>({
    orderBy: "createdAtTimestamp",
    orderDirection: "desc"
  });
  const publishedIndexQuery = sfApi.useIndexesQuery({
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
