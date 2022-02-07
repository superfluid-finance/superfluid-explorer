import { sfSubgraph } from "../redux/store";
import { skipToken } from "@reduxjs/toolkit/query";
import { ethers } from "ethers";
import { gql } from "graphql-request";
import { PossibleErrors } from "@superfluid-finance/sdk-redux";
import _ from "lodash";
import { Network, networks } from "../redux/networks";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { searchHistorySlice } from "../redux/slices/searchHistory.slice";
import { useCallback, useMemo } from "react";
import { addressBookSelectors } from "../redux/slices/addressBook.slice";

const searchByAddressDocument = gql`
  query Search($addressId: ID, $addressBytes: Bytes) {
    tokensByAddress: tokens(where: { id: $addressId, isSuperToken: true }) {
      id
      symbol
      name
    }
    tokensByUnderlyingAddress: tokens(
      where: { isSuperToken: true, underlyingAddress: $addressBytes }
    ) {
      id
      symbol
      name
    }
    accounts(where: { id: $addressId }) {
      id
    }
  }
`;

type SubgraphSearchResult = {
  tokensByAddress: {
    id: string;
    symbol: string;
    name: string;
  }[];
  tokensByUnderlyingAddress: {
    id: string;
    symbol: string;
    name: string;
  }[];
  accounts: {
    id: string;
  }[];
};

type NetworkSearchResult = {
  network: Network;
  isFetching: boolean;
  error?: PossibleErrors;
  tokens: {
    id: string;
    symbol: string;
    name: string;
  }[];
  accounts: {
    id: string;
  }[];
};

const useSearchHook = (address: string): NetworkSearchResult[] => {
  const dispatch = useAppDispatch();
  const isSearchTermAddress = useMemo(
    () => ethers.utils.isAddress(address),
    [address]
  );

  const chainResults: NetworkSearchResult[] = [];

  networks.forEach((network) => {
    // The number & order of networks is deterministic, that's why we're okay using the hook inside a for-loop.
    const queryState = sfSubgraph.useCustomQuery(
      isSearchTermAddress
        ? {
            chainId: network.chainId,
            document: searchByAddressDocument,
            variables: {
              addressId: address.toLowerCase(),
              addressBytes: address.toLowerCase(),
            },
          }
        : skipToken
    );

    const addressBookEntries = useAppSelector((state) =>
      !isSearchTermAddress
        ? addressBookSelectors
            .selectAll(state)
            .filter((x) => x.chainId === network.chainId)
        : []
    );

    if (isSearchTermAddress) {
      const subgraphSearchResult =
        (queryState.data as SubgraphSearchResult) ?? {
          accounts: [],
          tokensByAddress: [],
          tokensByUnderlyingAddress: [],
        };

      chainResults.push({
        network: network,
        isFetching: queryState.isFetching,
        error: queryState.error,
        tokens: _.uniq(
          subgraphSearchResult.tokensByAddress.concat(
            subgraphSearchResult.tokensByUnderlyingAddress
          )
        ),
        accounts: subgraphSearchResult.accounts,
      });
    } else {
      const addressBookMatches = addressBookEntries.filter((x) =>
        x.nameTag.toLowerCase().includes(address)
      );
      if (addressBookMatches.length) {
        chainResults.push({
          network: network,
          isFetching: false,
          error: undefined,
          tokens: [],
          accounts: addressBookMatches.map((x) => ({
            id: x.address,
          })),
        });
      }
    }
  });

  const lastSearchAddress = useAppSelector(
    (state) => state.searchHistory.ids[0]
  );

  if (
    isSearchTermAddress &&
    lastSearchAddress !== address.toLowerCase() &&
    (chainResults.some((x) => x.tokens.length) ||
      chainResults.some((x) => x.accounts.length))
  ) {
    dispatch(
      searchHistorySlice.actions.searchMatched({
        address: ethers.utils.getAddress(address),
        timestamp: new Date().getTime(),
      })
    );
  }

  return chainResults;
};

export default useSearchHook;
