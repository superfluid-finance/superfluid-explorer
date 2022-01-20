import {FC} from "react";
import {Network} from "../redux/networks";
import AppLink from "./AppLink";

export const TransactionHash: FC<{ network: Network, transactionHash: string }> = ({network, transactionHash}) =>
    <AppLink href={network.getLinkForTransaction(transactionHash)} target="_blank">{transactionHash}</AppLink>;
