import {Network, sfApi} from "../redux/store";
import {createSkipPaging, Ordering, SkipPaging} from "@superfluid-finance/sdk-core";
import {FC, ReactElement, useState} from "react";
import EventDataGrid, {EventOrderBy} from "./EventDataGrid";

interface Props {
  network: Network,
  address: string
}

const EventList: FC<Props> = ({network, address}): ReactElement => {
  const [eventPaging, setEventPaging] = useState<SkipPaging>(createSkipPaging({
    take: 10
  }));

  const [eventOrdering, setEventOrdering] = useState<Ordering<EventOrderBy> | undefined>({
    orderBy: "timestamp",
    orderDirection: "desc"
  });

  // TODO(KK) Use ordering.

  const eventQuery = sfApi.useListEventsQuery({
    chainId: network.chainId,
    accountAddress: address,
    timestamp_gt: 0,
    skip: eventPaging.skip,
    take: eventPaging.take
  })

  return <EventDataGrid network={network} queryResult={eventQuery} setPaging={setEventPaging}
                                 ordering={eventOrdering} setOrdering={setEventOrdering}/>
}

export default EventList;
