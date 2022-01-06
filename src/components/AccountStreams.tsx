import {Network, sfApi} from "../redux/store";
import {FC, ReactElement, useState} from "react";
import {Account, createSkipPaging, Ordering, SkipPaging, Stream} from "@superfluid-finance/sdk-core";
import {AppDataGrid} from "./AppDataGrid";
import {GridColDef} from "@mui/x-data-grid";
import {StreamOrderBy} from "@superfluid-finance/sdk-core/src/subgraph/entities/stream/stream";

interface Props {
  network: Network,
  account: Account
}

const AccountStreams: FC<Props> = ({ network, account }): ReactElement => {
  // TODO(KK): cast sort field to orderby type

  const incomingStreamColumns: GridColDef[] = [
    {field: 'id', hide: true, sortable: false },
    {field: 'sender', headerName: "Sender", flex: 1, sortable: false},
    {field: 'currentFlowRate', headerName: "Flow Rate", flex: 1, sortable: true},
    {field: 'token', headerName: "Token", flex: 1, sortable: false},
  ];

  const [incomingStreamPaging, setIncomingStreamPaging] = useState<SkipPaging>(createSkipPaging({
    take: 10
  }));
  const [outgoingStreamPaging, setOutgoingStreamPaging] = useState<SkipPaging>(createSkipPaging({
    take: 10
  }));
  const [incomingStreamOrdering, setIncomingStreamOrdering] = useState<Ordering<StreamOrderBy> | undefined>(undefined);
  const [outgoingStreamOrdering, setOutgoingStreamOrdering] = useState<Ordering<StreamOrderBy> | undefined>(undefined);

  const outgoingStreamColumns: GridColDef[] = [
    {field: 'id', hide: true, flex: 1},
    {field: 'receiver', headerName: "Receiver", sortable: false, flex: 1},
    {field: 'currentFlowRate', headerName: "Flow Rate", sortable: true, flex: 1},
    {field: 'token', headerName: "Token", sortable: false, flex: 1},
  ];

  const incomingStreamsQuery = sfApi.useStreamsQuery({
    chainId: network.chainId,
    filter: {
      receiver: account.id
    },
    pagination: incomingStreamPaging,
    order: incomingStreamOrdering
  });

  const incomingStreamRows = incomingStreamsQuery.data ? incomingStreamsQuery.data.data.map((x: Stream) => ({
    id: x.id,
    sender: x.sender,
    currentFlowRate: x.currentFlowRate,
    token: x.token
  })) : [];

  const outgoingStreamsQuery = sfApi.useStreamsQuery({
    chainId: network.chainId,
    filter: {
      sender: account.id
    },
    pagination: outgoingStreamPaging,
    order: outgoingStreamOrdering
  });

  const outgoingStreamRows = outgoingStreamsQuery.data ? outgoingStreamsQuery.data.data.map((x: Stream) => ({
    id: x.id,
    receiver: x.receiver,
    currentFlowRate: x.currentFlowRate,
    token: x.token
  })) : [];

  // TODO(KK): get rid of anys

  return (<>
  <p>INCOMING</p>
    <div style={{height: 640, width: "100%"}}>
      <AppDataGrid columns={incomingStreamColumns} rows={incomingStreamRows} queryResult={incomingStreamsQuery} setPaging={setIncomingStreamPaging} ordering={incomingStreamOrdering} setOrdering={(x: any) => setIncomingStreamOrdering(x)}/>
    </div>
    <p>OUTGOING</p>
    <div style={{height: 640, width: "100%"}}>
      <AppDataGrid columns={outgoingStreamColumns} rows={outgoingStreamRows} queryResult={outgoingStreamsQuery} setPaging={setOutgoingStreamPaging} ordering={outgoingStreamOrdering} setOrdering={(x: any) => setOutgoingStreamOrdering(x)}/>
    </div>
  </>);
}

export default AccountStreams;
