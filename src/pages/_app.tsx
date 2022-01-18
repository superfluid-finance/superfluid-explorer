import * as React from 'react';
import Head from 'next/head';
import {AppProps} from 'next/app';
import CssBaseline from '@mui/material/CssBaseline';
import {CacheProvider, EmotionCache} from '@emotion/react';
import createEmotionCache from '../utils/createEmotionCache';
import {Provider} from "react-redux";
import {store, wrapper} from "../redux/store";
import SfAppBar from "../components/SfAppBar";
import {FC, useState} from "react";
import Box from "@mui/material/Box";
import "../styles/graphiql.min.css"
import "../styles/app.css"
import {Button} from "@mui/material";
import {SfThemeProvider} from "../styles/SfThemeProvider";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export function MyApp(props: MyAppProps) {
  const {Component, emotionCache = clientSideEmotionCache, pageProps} = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Superfluid Console</title>
        <meta name="viewport" content="initial-scale=1, width=device-width"/>
      </Head>
      <SfThemeProvider>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline/>
        <Provider store={store}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </SfThemeProvider>
    </CacheProvider>
  );
}


const Layout: FC = ({children}) => {
  return (
    <Box sx={{
      display: "flex",
      flexFlow: "column",
      height: "100vh"
    }}>
      <SfAppBar/>
      <Box className="wave-container" component="main" sx={{height: "100vh"}}>{children}</Box>
    </Box>
  )
}

export default wrapper.withRedux(MyApp);



