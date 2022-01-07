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
import {Card, Typography} from "@mui/material";

const AccountOverview: FC<{
  network: Network,
  accountAddress: string
}> = ({network, accountAddress}): ReactElement => {
  const [accountTokenSnapshotPaging, setAccountTokenSnapshotPaging] = useState<SkipPaging>(createSkipPaging({
    take: 10
  }));
  const [accountTokenSnapshotOrdering, setAccountTokenSnapshotOrdering] = useState<Ordering<AccountTokenSnapshotOrderBy> | undefined>(undefined);
  const accountTokenSnapshotsQuery = sfApi.useAccountTokenSnapshotsQuery({
    chainId: network.chainId,
    pagination: accountTokenSnapshotPaging,
    filter: {
      account: accountAddress
    },
    order: accountTokenSnapshotOrdering
  })

  return (<>
    <Typography variant="h5" component="h2">
      Overview
    </Typography>
    <Card>
      <AccountTokenSnapshotDataGrid queryResult={accountTokenSnapshotsQuery}
                                    setPaging={setAccountTokenSnapshotPaging}
                                    ordering={accountTokenSnapshotOrdering}
                                    setOrdering={setAccountTokenSnapshotOrdering}/></Card></>)
}

export default AccountOverview;
