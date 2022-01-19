import { createSlice } from '@reduxjs/toolkit';
import {HYDRATE} from "next-redux-wrapper";

export interface IAppPreferences {
  themePreference: 'system' | 'light' | 'dark';
}

const initialState: IAppPreferences = {
  themePreference: 'system',
};

const sliceName = 'appPreferences'

export const themePreferenceSlice = createSlice({
  name: sliceName,
  initialState: initialState,
  reducers: {
    changeThemePreference(state, action) {
      state.themePreference = action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, {payload}) => ({
      ...state,
      ...payload[sliceName],
    }),
  },
});

export const { changeThemePreference } = themePreferenceSlice.actions;
