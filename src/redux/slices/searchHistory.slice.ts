import {
  createEntityAdapter,
  createSlice
} from '@reduxjs/toolkit'
import {RootState} from "../store";
import {REHYDRATE} from "redux-persist";

export interface SearchEntry {
  address: string,
  timestamp: number
}

export const createEntryId = (address: string) => (`${address.toLowerCase()}`);

export const getEntryId = (entry: SearchEntry) => {
  return `${entry.address.toLowerCase()}`;
}

export const searchHistoryAdapter = createEntityAdapter({
  selectId: (entry: SearchEntry) => getEntryId(entry),
  sortComparer: (entry: SearchEntry) => entry.timestamp,
})

const sliceName = 'searchHistory';

export const searchHistorySlice = createSlice({
  name: sliceName,
  initialState: searchHistoryAdapter.getInitialState(),
  reducers: {
    searchMatched: searchHistoryAdapter.upsertOne
  },
  extraReducers: {
    [REHYDRATE]: (state, {payload}) => ({
      ...state,
      ...(payload ? payload[sliceName] : {}),
    }),
  },
})

export const searchHistorySelectors = searchHistoryAdapter.getSelectors((state: RootState) => state.searchHistory)

