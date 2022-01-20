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
import storage from "redux-persist/lib/storage";
import {FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE} from "redux-persist";
import isServer from "../utils/isServer";

export const {sfApi} = initializeSfApiSlice((options) =>
  createApiWithReactHooks({
    ...options,
    extractRehydrationInfo(action, {reducerPath}) {
      if (action.type === HYDRATE) {
        return action.payload[reducerPath]
      }
      if (action.type === REHYDRATE) {
        return action.payload[reducerPath]
      }
    }
  })
);

export const {sfSubgraph} = initializeSubgraphSlice((options) =>
  createApiWithReactHooks({
    ...options,
    extractRehydrationInfo(action, {reducerPath}) {
      if (action.type === HYDRATE) {
        return action.payload[reducerPath]
      }
      if (action.type === REHYDRATE) {
        return action.payload[reducerPath]
      }
    }
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

const sdkReduxPersistConfig = { key: 'sdk-redux', version: 1, storage };

export const makeStore = wrapMakeStore(() => {
  infuraProviders.map((x) =>
    setFrameworkForSdkRedux(x.chainId, x.frameworkGetter)
  );

  const addressBookReducer = persistReducer(
    { key: 'address-book', version: 1, storage },
    addressBookSlice.reducer,
  );

  const sfApiReducer = persistReducer(
    sdkReduxPersistConfig,
    sfApi.reducer,
  );

  const sfSubgraphReducer = persistReducer(
    sdkReduxPersistConfig,
    sfSubgraph.reducer
  );

  const store = configureStore({
    reducer: {
      "sfApi": sfApiReducer,
      "sfSubgraph": sfSubgraphReducer,
      "sfTransactions": sfTransactions.reducer,
      [themePreferenceSlice.name]: themePreferenceSlice.reducer,
      [addressBookSlice.name]: addressBookReducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // Ignore redux-persist actions: https://stackoverflow.com/a/62610422
        },
      }).prepend(nextReduxCookieMiddleware({
        compress: true,
        subtrees: ["appPreferences"]
      })).concat(sfApi.middleware),
  });

  if (!isServer()) {
    persistStore(store);
  }

  return store;
});

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const wrapper = createWrapper<AppStore>(makeStore, {
  debug: true
});
