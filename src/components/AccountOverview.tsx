import {FC, ReactElement, useState} from "react";
import {Network, sfApi} from "../redux/store";
import {
  AccountTokenSnapshotOrderBy,
  createSkipPaging,
  Ordering,
  SkipPaging
} from "@superfluid-finance/sdk-core";
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

  return (
    <Card variant="outlined">
      <AccountTokenSnapshotDataGrid network={network}
                                    queryResult={accountTokenSnapshotsQuery}
                                    setPaging={setAccountTokenSnapshotPaging}
                                    ordering={accountTokenSnapshotOrdering}
                                    setOrdering={setAccountTokenSnapshotOrdering}/></Card>)
}

export default AccountOverview;
