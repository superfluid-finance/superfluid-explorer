import {FC, ReactElement, useState} from "react";
import {Network, sfApi} from "../redux/store";
import {
  Account, AccountTokenSnapshot,
  AccountTokenSnapshotOrderBy,
  createSkipPaging,
  Ordering,
  SkipPaging
} from "@superfluid-finance/sdk-core";
import {
  IndexSubscriptionOrderBy
} from "@superfluid-finance/sdk-core/src/subgraph/entities/indexSubscription/indexSubscription";
import AccountTokenSnapshotDataGrid from "./AccountTokenSnapshotDataGrid";
import {Card} from "@mui/material";

const AccountOverview: FC<{
  network: Network,
  account: Account
}> = ({network, account}): ReactElement => {
  const [accountTokenSnapshotPaging, setAccountTokenSnapshotPaging] = useState<SkipPaging>(createSkipPaging({
    take: 10
  }));
  const [accountTokenSnapshotOrdering, setAccountTokenSnapshotOrdering] = useState<Ordering<AccountTokenSnapshotOrderBy> | undefined>(undefined);
  const accountTokenSnapshotsQuery = sfApi.useAccountTokenSnapshotsQuery({
    chainId: network.chainId,
    pagination: accountTokenSnapshotPaging,
    filter: {
      account: account.id
    },
    order: accountTokenSnapshotOrdering
  })

  return (<>
    {
      accountTokenSnapshotsQuery.data && (<Card><AccountTokenSnapshotDataGrid queryResult={accountTokenSnapshotsQuery}
                                                                              setPaging={setAccountTokenSnapshotPaging}
                                                                              ordering={accountTokenSnapshotOrdering}
                                                                              setOrdering={setAccountTokenSnapshotOrdering}/></Card>)
    }
  </>);
}

export default AccountOverview;
