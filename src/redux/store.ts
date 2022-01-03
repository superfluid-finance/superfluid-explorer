import {configureStore, Dispatch} from "@reduxjs/toolkit";
import {
  initializeSfApiSlice,
  initializeSfTransactionSlice,
  createApiWithReactHooks,
  setFrameworkForSdkRedux
} from "@superfluid-finance/sdk-redux";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {Framework} from "@superfluid-finance/sdk-core";
import {ethers} from "ethers";
import {createWrapper, HYDRATE} from "next-redux-wrapper";

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

export const store = configureStore({
  reducer: {
    "sfApi": sfApi.reducer,
    "sfTransactions": sfTransactions.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sfApi.middleware),
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useAppDispatch = () => useDispatch<Dispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Ugly code below

export const chainIds = [
  3, // ROPSTEN
  4, // RINKEBY
  5, // GOERLI
  42, // KOVAN
  // 100, // XDAI //TODO(KK): No infura support
  137, // MATIC
  80001, // MUMBAI
];

export type Network = {
  name: string,
  chainId: number
}

export const networks: Network[] = [
  {
    name: "ropsten",
    chainId: 3
  },
  {
    name: "rinkeby",
    chainId: 4
  },
  {
    name: "goerli",
    chainId: 5
  },
  {
    name: "kovan",
    chainId: 42
  },
  {
    name: "matic",
    chainId: 137
  },
  {
    name: "mumbai",
    chainId: 80001
  },
];

export const networksByName = new Map(networks.map(x => [x.name.toLowerCase(), x]))
export const networksByChainId = new Map(networks.map(x => [x.chainId, x]))

export const findNetwork = (x: unknown): Network | undefined => {
  // if (typeof x === "number") {
  //   return networksByChainId.get(x);
  // }

  if (typeof x === "string") {
    return networksByName.get(x.toLowerCase());
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

export const makeStore = () => {
  const chainId = 5;

  infuraProviders.map((x) =>
    setFrameworkForSdkRedux(x.chainId, x.frameworkGetter)
  );

  return configureStore({
    reducer: {
      sfApi: sfApi.reducer,
      sfTransactions: sfTransactions.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(sfApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const wrapper = createWrapper<AppStore>(makeStore, {
  debug: true,
  serializeState: (state) => JSON.stringify(state),
  deserializeState: (state) => JSON.parse(state),
});
