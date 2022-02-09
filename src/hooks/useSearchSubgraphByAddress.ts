import {useMemo} from "react";
import {ethers} from "ethers";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {networks} from "../redux/networks";
import {sfSubgraph} from "../redux/store";
import {skipToken} from "@reduxjs/toolkit/query";
import {searchHistorySlice} from "../redux/slices/searchHistory.slice";
import {gql} from "graphql-request";

const searchByAddressDocument = gql`
  query Search($addressId: ID, $addressBytes: Bytes) {
    tokensByAddress: tokens(where: { id: $addressId, isSuperToken: true }) {
      id
      symbol
      name
      isListed
    }
    tokensByUnderlyingAddress: tokens(
      where: { isSuperToken: true, underlyingAddress: $addressBytes }
    ) {
      id
      symbol
      name
      isListed
    }
    accounts(where: { id: $addressId }) {
      id
    }
  }
`;

export type SubgraphSearchByAddressResult = {
  tokensByAddress: {
    id: string;
    symbol: string;
    name: string;
    isListed: boolean;
  }[];
  tokensByUnderlyingAddress: {
    id: string;
    symbol: string;
    name: string;
    isListed: boolean;
  }[];
  accounts: {
    id: string;
  }[];
};

export const useSearchSubgraphByAddress = (searchTerm: string) => {
  const isSearchTermAddress = useMemo(
    () => ethers.utils.isAddress(searchTerm),
    [searchTerm]
  );

  const dispatch = useAppDispatch();
  const lastSearchAddress = useAppSelector(
    (state) => state.searchHistory.ids[0] as string
  );

  const results = networks.map((network) =>
    sfSubgraph.useCustomQuery(
      isSearchTermAddress
        ? {
          chainId: network.chainId,
          document: searchByAddressDocument,
          variables: {
            addressId: searchTerm.toLowerCase(),
            addressBytes: searchTerm.toLowerCase(),
          },
        }
        : skipToken
    )
  );

  if (
    isSearchTermAddress &&
    searchTerm.toLowerCase() !== lastSearchAddress?.toLowerCase()
  ) {
    const areThereAnyResults =
      results
        .map(
          (x) =>
            (x.data as SubgraphSearchByAddressResult | undefined) ?? {
              tokensByAddress: [],
              tokensByUnderlyingAddress: [],
              accounts: [],
            }
        )
        .map((x) =>
          ([] as any)
            .concat(x.tokensByAddress)
            .concat(x.tokensByUnderlyingAddress)
            .concat(x.accounts)
        ).length >= 1;

    if (areThereAnyResults) {
      dispatch(
        searchHistorySlice.actions.searchMatched({
          address: ethers.utils.getAddress(searchTerm),
          timestamp: new Date().getTime(),
        })
      );
    }
  }

  return results;
};
