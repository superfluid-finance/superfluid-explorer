import { configureStore, Dispatch} from "@reduxjs/toolkit";
import { createSdkReduxParts } from "@superfluid-finance/sdk-redux";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import { Framework } from "@superfluid-finance/sdk-redux";
import { ethers } from "ethers";

const {
    superfluidContext,
    apiSlice,
    transactionSlice,
} = createSdkReduxParts();

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        [transactionSlice.reducerPath]: transactionSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export { superfluidContext };

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
          process.env.REACT_APP_INFURA_ID
        ),
      }),
  }));

infuraProviders.map((x) =>
  superfluidContext.setFramework(x.chainId, x.frameworkGetter)
);
