import * as React from 'react';
import Head from 'next/head';
import {AppContext, AppProps} from 'next/app';
import CssBaseline from '@mui/material/CssBaseline';
import {CacheProvider, EmotionCache} from '@emotion/react';
import createEmotionCache from '../utils/createEmotionCache';
import {wrapper} from "../redux/store";
import SfAppBar from "../components/SfAppBar";
import {FC} from "react";
import Box from "@mui/material/Box";
import "../styles/graphiql.min.css"
import "../styles/app.css"
import {ThemeProvider} from "@mui/material/styles";
import useSfTheme from "../styles/useSfTheme";
import App from "next/app"

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function MyApp(props: MyAppProps) {
  const {Component, emotionCache = clientSideEmotionCache, pageProps} = props;
  const theme = useSfTheme();

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Superfluid Console</title>
        <meta name="viewport" content="initial-scale=1, width=device-width"/>
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline/>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </CacheProvider>
  );
}

// This disables the ability to
// perform automatic static optimization, causing every page in your app to be server-side rendered.
// SF: We do it because of server-side rendering of dark mode to stop flickering.
MyApp.getInitialProps = async (appContext: AppContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  return {...appProps}
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

// NOTE: This wraps the React code with Redux provider component.
export default wrapper.withRedux(MyApp);



