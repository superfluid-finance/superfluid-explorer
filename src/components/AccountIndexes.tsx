import {Network, sfApi} from "../redux/store";
import {Account, createSkipPaging, Ordering, SkipPaging} from "@superfluid-finance/sdk-core";
import {FC, ReactElement, useState} from "react";
import {AppDataGrid} from "./AppDataGrid";
import IndexSubscriptionDataGrid from "./IndexSubscriptionDataGrid";
import {IndexOrderBy} from "@superfluid-finance/sdk-core/src/subgraph/entities/index";
import {
  IndexSubscriptionOrderBy
} from "@superfluid-finance/sdk-core/src/subgraph/entities/indexSubscription/indexSubscription";
import PublishedIndexDataGrid from "./PublishedIndexDataGrid";

interface Props {
  network: Network,
  account: Account
}

const AccountIndexes: FC<Props> = ({network, account}): ReactElement => {
  const [indexSubscriptionPaging, setIndexSubscriptionPaging] = useState<SkipPaging>(createSkipPaging({
    take: 10
  }));
  const [indexSubscriptionOrdering, setIndexSubscriptionOrdering] = useState<Ordering<IndexSubscriptionOrderBy> | undefined>(undefined);
  const indexSubscriptionQuery = sfApi.useIndexSubscriptionsQuery({
    chainId: network.chainId,
    pagination: indexSubscriptionPaging,
    filter: {
      subscriber: account.id
    }
  })

  const [publishedIndexPaging, setPublishedIndexPaging] = useState<SkipPaging>(createSkipPaging({
    take: 10
  }));
  const [publishedIndexOrdering, setPublishedIndexOrdering] = useState<Ordering<IndexOrderBy> | undefined>(undefined);
  const publishedIndexQuery = sfApi.useIndexesQuery({
    chainId: network.chainId,
    pagination: indexSubscriptionPaging,
    filter: {
      publisher: account.id
    },
    order: publishedIndexOrdering
  })


  return <>
    <div style={{height: 640, width: "100%"}}>
      <p>Published Indexes</p>
      <PublishedIndexDataGrid queryResult={publishedIndexQuery} setPaging={setPublishedIndexPaging} ordering={publishedIndexOrdering} setOrdering={setPublishedIndexOrdering} />
    </div>
    <p>Index Subscriptions</p>
    <IndexSubscriptionDataGrid queryResult={indexSubscriptionQuery} setPaging={setIndexSubscriptionPaging} ordering={indexSubscriptionOrdering} setOrdering={setIndexSubscriptionOrdering}/>
  </>
}

export default AccountIndexes;
