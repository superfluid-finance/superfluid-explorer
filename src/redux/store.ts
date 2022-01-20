import {configureStore} from "@reduxjs/toolkit";
import {
  initializeSfApiSlice,
  initializeSfTransactionSlice,
  createApiWithReactHooks,
  setFrameworkForSdkRedux
} from "@superfluid-finance/sdk-redux";
import {Framework} from "@superfluid-finance/sdk-core";
import {ethers} from "ethers";
import {createWrapper, HYDRATE} from "next-redux-wrapper";
import {nextReduxCookieMiddleware, wrapMakeStore} from "next-redux-cookie-wrapper";
import {themePreferenceSlice} from "./slices/appPreferences.slice";

export const {sfApi} = initializeSfApiSlice((options) =>
  createApiWithReactHooks({
    ...options,
    extractRehydrationInfo(action, {reducerPath}) {
      if (action.type === HYDRATE) {
        return action.payload[reducerPath];
      }
    },
  })
);

export const {sfTransactions} = initializeSfTransactionSlice();

// Ugly code below

export const chainIds = [
  3, // ROPSTEN
  4, // RINKEBY
  5, // GOERLI
  42, // KOVAN
  100, // XDAI //TODO(KK): No infura support
  137, // MATIC
  80001, // MUMBAI
];

export type Network = {
  displayName: string,
  slugName: string,
  chainId: number,
  subgraphUrl: string,
  getLinkForTransaction(txHash: string): string;
}

function ensureDefined<T>(value: T | undefined): T {
  if (!value) throw Error('Value has to be defined.');
  return value;
}

export const networks: Network[] = [
  {
    displayName: "Ropsten",
    slugName: "ropsten",
    chainId: 3,
    subgraphUrl: ensureDefined(process.env.NEXT_PUBLIC_SUBGRAPH_ROPSTEN),
    getLinkForTransaction: (txHash: string): string => `https://goerli.etherscan.io/tx/${txHash}`
  },
  {
    displayName: "Rinkeby",
    slugName: "rinkeby",
    chainId: 4,
    subgraphUrl: ensureDefined(process.env.NEXT_PUBLIC_SUBGRAPH_RINKEBY),
    getLinkForTransaction: (txHash: string): string => `https://goerli.etherscan.io/tx/${txHash}`
  },
  {
    displayName: "Goerli",
    slugName: "goerli",
    chainId: 5,
    subgraphUrl: ensureDefined(process.env.NEXT_PUBLIC_SUBGRAPH_GOERLI),
    getLinkForTransaction: (txHash: string): string => `https://goerli.etherscan.io/tx/${txHash}`
  },
  {
    displayName: "Kovan",
    slugName: "kovan",
    chainId: 42,
    subgraphUrl: ensureDefined(process.env.NEXT_PUBLIC_SUBGRAPH_KOVAN),
    getLinkForTransaction: (txHash: string): string => `https://goerli.etherscan.io/tx/${txHash}`
  },
  {
    displayName: "xDAI",
    slugName: "xdai",
    chainId: 100,
    subgraphUrl: ensureDefined(process.env.NEXT_PUBLIC_SUBGRAPH_XDAI),
    getLinkForTransaction: (txHash: string): string => `https://goerli.etherscan.io/tx/${txHash}`
  },
  {
    displayName: "Polygon",
    slugName: "matic",
    chainId: 137,
    subgraphUrl: ensureDefined(process.env.NEXT_PUBLIC_SUBGRAPH_MATIC),
    getLinkForTransaction: (txHash: string): string => `https://polygonscan.com/tx/${txHash}`
  },
  {
    displayName: "Mumbai",
    slugName: "mumbai",
    chainId: 80001,
    subgraphUrl: ensureDefined(process.env.NEXT_PUBLIC_SUBGRAPH_MUMBAI),
    getLinkForTransaction: (txHash: string): string => `https://goerli.etherscan.io/tx/${txHash}`
  },
];

export const networksByName = new Map(networks.map(x => [x.slugName.toLowerCase(), x]))
export const networksByChainId = new Map(networks.map(x => [x.chainId, x]))

export const findNetwork = (x: unknown): Network => {
  // if (typeof x === "number") {
  //   return networksByChainId.get(x);
  // }

  let network: Network | undefined = undefined;

  if (typeof x === "string") {
    network = networksByName.get(x.toLowerCase());
  }

  if (network) {
    return network;
  } else {
    throw Error(`Network ${x} not found. TODO(KK): error page`)
  }
}

export const findNetworkByHash = (x: unknown): Network => {
  // if (typeof x === "number") {
  //   return networksByChainId.get(x);
  // }

  let network: Network | undefined = undefined;

  if (typeof x === "string") {
    network = networksByName.get(x.toLowerCase());
  }

  if (network) {
    return network;
  } else {
    throw Error(`Network ${x} not found. TODO(KK): error page`)
  }
}

const infuraProviders = chainIds.map((chainId) => ({
  chainId,
  frameworkGetter: () =>
    Framework.create({
      chainId,
      provider: new ethers.providers.InfuraProvider(
        chainId,
        process.env.NEXT_PUBLIC_INFURA_ID
      ),
    }),
}));


export const makeStore = wrapMakeStore(() => {
  infuraProviders.map((x) =>
    setFrameworkForSdkRedux(x.chainId, x.frameworkGetter)
  );

  return configureStore({
    reducer: {
      "sfApi": sfApi.reducer,
      "sfTransactions": sfTransactions.reducer,
      [themePreferenceSlice.name]: themePreferenceSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(nextReduxCookieMiddleware({
        compress: true,
        subtrees: ["appPreferences"]
      })).concat(sfApi.middleware),
  });
});

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const wrapper = createWrapper<AppStore>(makeStore, {
  debug: true
});
