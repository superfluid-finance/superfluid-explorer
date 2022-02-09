import { sfSubgraph } from "../redux/store";
import { skipToken } from "@reduxjs/toolkit/query";
import { ethers } from "ethers";
import { gql } from "graphql-request";
import { PossibleErrors } from "@superfluid-finance/sdk-redux";
import _ from "lodash";
import { Network, networks, networksByChainId } from "../redux/networks";
import { useAppSelector } from "../redux/hooks";
import { useMemo } from "react";
import { addressBookSelectors } from "../redux/slices/addressBook.slice";

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

const searchByTokenSymbolDocument = gql`
  query Search($tokenSymbol: String) {
    tokensBySymbol: tokens(
      where: { isSuperToken: true, symbol_contains: $tokenSymbol }
    ) {
      id
      symbol
      name
      isListed
    }
  }
`;

type SubgraphSearchByAddressResult = {
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

type SubgraphSearchByTokenSymbolResult = {
  tokensBySymbol: {
    id: string;
    symbol: string;
    name: string;
    isListed: boolean;
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
    isListed: boolean;
  }[];
  accounts: {
    id: string;
  }[];
};

const useSearchAddressBook = (searchTerm: string) => {
  const isSearchTermAddress = useMemo(
    () => ethers.utils.isAddress(searchTerm),
    [searchTerm]
  );

  return networks.map((network) => {
    const addressBookEntries = useAppSelector((state) =>
      !isSearchTermAddress
        ? addressBookSelectors
            .selectAll(state)
            .filter((x) => x.chainId === network.chainId)
        : []
    );

    return {
      network: network,
      accounts: addressBookEntries
        .filter((x) => x.nameTag.toLowerCase().includes(searchTerm))
        .map((x) => ({ id: x.address })),
    };
  });
};

export const useSearch = (searchTerm: string) => {
  const subgraphSearchByAddressResults = useSearchSubgraph(searchTerm);
  const subgraphSearchByTokenSymbolResults =
    useSearchSubgraphTokens(searchTerm);
  const addressBookResults = useSearchAddressBook(searchTerm);

  const subgraphSearchByAddressMappedResults: NetworkSearchResult[] =
    subgraphSearchByAddressResults
      .filter((x) => !!x.originalArgs)
      .map((searchQuery) => {
        const searchResult: SubgraphSearchByAddressResult =
          (searchQuery.data as SubgraphSearchByAddressResult) ?? {
            accounts: [],
            tokensByAddress: [],
            tokensByUnderlyingAddress: [],
          };

        return {
          network: networksByChainId.get(searchQuery.originalArgs!.chainId)!,
          isFetching: searchQuery.isFetching,
          error: searchQuery.error,
          tokens: searchResult.tokensByAddress.concat(
            searchResult.tokensByUnderlyingAddress
          ),
          accounts: searchResult.accounts,
        };
      });

  const subgraphSearchByTokenSymbolMappedResults: NetworkSearchResult[] =
    subgraphSearchByTokenSymbolResults
      .filter((x) => !!x.originalArgs)
      .map((searchQuery) => {
        const searchResult: SubgraphSearchByTokenSymbolResult =
          (searchQuery.data as SubgraphSearchByTokenSymbolResult) ?? {
            tokensBySymbol: [],
          };

        return {
          network: networksByChainId.get(searchQuery.originalArgs!.chainId)!,
          isFetching: searchQuery.isFetching,
          error: searchQuery.error,
          tokens: searchResult.tokensBySymbol,
          accounts: [],
        };
      });

  const subgraphSearchByAddressResultsMappedDictionary = Object.fromEntries(
    subgraphSearchByAddressMappedResults.map((x) => [x.network.slugName, x])
  );
  const subgraphSearchByTokenSymbolResultsMappedDictionary = Object.fromEntries(
    subgraphSearchByTokenSymbolMappedResults.map((x) => [x.network.slugName, x])
  );
  const addressBookMappedResultsDictionary = Object.fromEntries(
    addressBookResults.map((x) => [x.network.slugName, x])
  );

  return _.orderBy(networks, (x) => x.isTestnet, "asc").map((network) => {
    const searchByAddressMappedResult =
      subgraphSearchByAddressResultsMappedDictionary[network.slugName] ?? {
        isFetching: false,
        accounts: [],
        tokens: [],
      };

    const searchByTokenSymbolMappedResult =
      subgraphSearchByTokenSymbolResultsMappedDictionary[network.slugName] ?? {
        isFetching: false,
        accounts: [],
        tokens: [],
      };

    const addressBookResult = addressBookMappedResultsDictionary[
      network.slugName
    ] ?? {
      accounts: [],
    };

    return {
      network: network,
      isFetching:
        searchByAddressMappedResult.isFetching ||
        searchByTokenSymbolMappedResult.isFetching,
      error:
        searchByAddressMappedResult.error &&
        searchByTokenSymbolMappedResult.error,
      tokens: _.orderBy(
        _.uniqBy(
          searchByAddressMappedResult.tokens
            .concat(searchByTokenSymbolMappedResult.tokens)
            .map((x) => ({ ...x, id: ethers.utils.getAddress(x.id) })),
          (x) => x.id
        ),
        (x) => x.isListed,
        "desc"
      ),
      accounts: _.uniqBy(
        searchByAddressMappedResult.accounts
          .concat(addressBookResult.accounts)
          .map((x) => ({ ...x, id: ethers.utils.getAddress(x.id) })),
        (x) => x.id
      ),
    };
  });
};

const useSearchSubgraph = (searchTerm: string) => {
  const isSearchTermAddress = useMemo(
    () => ethers.utils.isAddress(searchTerm),
    [searchTerm]
  );

  return networks.map((network) =>
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
};

const useSearchSubgraphTokens = (searchTerm: string) => {
  const isSearchTermAddress = useMemo(
    () => ethers.utils.isAddress(searchTerm),
    [searchTerm]
  );

  return networks.map((network) =>
    sfSubgraph.useCustomQuery(
      !isSearchTermAddress && searchTerm.length > 2
        ? {
            chainId: network.chainId,
            document: searchByTokenSymbolDocument,
            variables: {
              tokenSymbol: searchTerm,
            },
          }
        : skipToken
    )
  );
};
