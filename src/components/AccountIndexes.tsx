import {sfSubgraph} from "../redux/store";
import {
  Account, createSkipPaging, Ordering, SkipPaging, IndexSubscription_OrderBy,
  Index_OrderBy
} from "@superfluid-finance/sdk-core";
import {FC, ReactElement, useState} from "react";
import IndexSubscriptionDataGrid from "./IndexSubscriptionDataGrid";
import PublishedIndexDataGrid from "./PublishedIndexDataGrid";
import {Box, Card, Typography} from "@mui/material";
import {Network} from "../redux/networks";

interface Props {
  network: Network,
  accountAddress: string
}

const AccountIndexes: FC<Props> = ({network, accountAddress}): ReactElement => {
  const [indexSubscriptionPaging, setIndexSubscriptionPaging] = useState<SkipPaging>(createSkipPaging({
    take: 10
  }));
  const [indexSubscriptionOrdering, setIndexSubscriptionOrdering] = useState<Ordering<IndexSubscription_OrderBy> | undefined>(undefined);
  const indexSubscriptionQuery = sfSubgraph.useIndexSubscriptionsQuery({
    chainId: network.chainId,
    pagination: indexSubscriptionPaging,
    filter: {
      subscriber: accountAddress
    },
    order: indexSubscriptionOrdering
  })

  const [publishedIndexPaging, setPublishedIndexPaging] = useState<SkipPaging>(createSkipPaging({
    take: 10
  }));
  const [publishedIndexOrdering, setPublishedIndexOrdering] = useState<Ordering<Index_OrderBy> | undefined>(undefined);
  const publishedIndexQuery = sfSubgraph.useIndexesQuery({
    chainId: network.chainId,
    pagination: publishedIndexPaging,
    filter: {
      publisher: accountAddress
    },
    order: publishedIndexOrdering
  })

  return <>
    <Box>
      <Typography variant="h6" component="h2" sx={{ml: 1, mb: 1}}>
        Publications
      </Typography>
      <PublishedIndexDataGrid network={network} queryResult={publishedIndexQuery} setPaging={setPublishedIndexPaging}
                              ordering={publishedIndexOrdering} setOrdering={setPublishedIndexOrdering}/>
    </Box>
    <Box>
      <Typography variant="h6" component="h2" sx={{mt: 3, ml: 1, mb: 1}}>
        Subscriptions
      </Typography>
      <IndexSubscriptionDataGrid network={network} queryResult={indexSubscriptionQuery}
                                 setPaging={setIndexSubscriptionPaging} ordering={indexSubscriptionOrdering}
                                 setOrdering={setIndexSubscriptionOrdering}/>
    </Box>
  </>
}

export default AccountIndexes;
