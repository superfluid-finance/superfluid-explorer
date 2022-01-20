import {configureStore} from "@reduxjs/toolkit";
import {
  createApiWithReactHooks,
  initializeSfApiSlice,
  initializeSubgraphSlice,
  initializeSfTransactionSlice,
  setFrameworkForSdkRedux
} from "@superfluid-finance/sdk-redux";
import {Framework} from "@superfluid-finance/sdk-core";
import {ethers} from "ethers";
import {createWrapper, HYDRATE} from "next-redux-wrapper";
import {nextReduxCookieMiddleware, wrapMakeStore} from "next-redux-cookie-wrapper";
import {themePreferenceSlice} from "./slices/appPreferences.slice";
import {addressBookSlice} from "./slices/addressBook.slice";
import {chainIds} from "./networks";

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

export const {sfSubgraph} = initializeSubgraphSlice((options) =>
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
      "sfSubgraph": sfSubgraph.reducer,
      [themePreferenceSlice.name]: themePreferenceSlice.reducer,
      [addressBookSlice.name]: addressBookSlice.reducer
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
