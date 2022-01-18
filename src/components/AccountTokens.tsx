import {FC, ReactElement, useState} from "react";
import {Network, sfApi} from "../redux/store";
import {
  AccountTokenSnapshotOrderBy,
  createSkipPaging,
  Ordering,
  SkipPaging
} from "@superfluid-finance/sdk-core";
import AccountTokenSnapshotDataGrid from "./AccountTokenSnapshotDataGrid";
import {Card} from "@mui/material";

const AccountTokens: FC<{
  network: Network,
  accountAddress: string
}> = ({network, accountAddress}): ReactElement => {
  const [accountTokenSnapshotPaging, setAccountTokenSnapshotPaging] = useState<SkipPaging>(createSkipPaging({
    take: 10
  }));
  const [accountTokenSnapshotOrdering, setAccountTokenSnapshotOrdering] = useState<Ordering<AccountTokenSnapshotOrderBy> | undefined>({
    orderBy: "balanceUntilUpdatedAt",
    orderDirection: "desc"
  });
  const accountTokenSnapshotsQuery = sfApi.useAccountTokenSnapshotsQuery({
    chainId: network.chainId,
    pagination: accountTokenSnapshotPaging,
    filter: {
      account: accountAddress
    },
    order: accountTokenSnapshotOrdering
  })

  return (
      <AccountTokenSnapshotDataGrid network={network}
                                    queryResult={accountTokenSnapshotsQuery}
                                    setPaging={setAccountTokenSnapshotPaging}
                                    ordering={accountTokenSnapshotOrdering}
                                    setOrdering={setAccountTokenSnapshotOrdering}/>)
}

export default AccountTokens;
