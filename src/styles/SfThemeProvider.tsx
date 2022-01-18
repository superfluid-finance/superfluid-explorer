import {FC, useEffect, useMemo, useState} from "react";
import * as NextThemes from "next-themes";
import {createSfTheme} from "./theme";
import {ThemeProvider} from "@mui/material/styles";
import * as React from "react";
import {Theme} from "@mui/system";

export const SfThemeProvider: FC = ({children}) => {
  return (<NextThemes.ThemeProvider>
    <MuiThemeProviderInsideNextThemes>
      {children}
    </MuiThemeProviderInsideNextThemes>
  </NextThemes.ThemeProvider>);
}

const MuiThemeProviderInsideNextThemes: FC = ({children}) => {
  const {theme} = NextThemes.useTheme()
  const themeProperlyTyped = theme as 'light' | 'dark' | undefined;

  // On server, we can only use the light theme because next-themes does not work there (no access to local storage).
  const [ muiTheme, setMuiTheme ] = useState<Theme>(createSfTheme('light'));

  // useEffect does not run on the server.
  useEffect(() => {
    if (muiTheme.palette.mode !== theme) {
      setMuiTheme(createSfTheme(themeProperlyTyped));
    }
  }, [theme])

  return (<ThemeProvider theme={muiTheme}>
    {children}
  </ThemeProvider>);
}
