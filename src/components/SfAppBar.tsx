import * as React from "react";
import {AppBar, Button, Toolbar} from "@mui/material";
import AppLink from "./AppLink";
import AppSearch from "./AppSearch";
import SelectThemeButton from "./SelectThemeButton";

const SfAppBar = () => {

  return (
    <AppBar position="sticky">
      <Toolbar>
        <AppSearch/>
        <AppLink href="/subgraph"> <Button sx={{ml: 1}}
                                           id="search-button"
                                           size="medium"
                                           variant="contained">Subgraph</Button></AppLink>
        <SelectThemeButton />
      </Toolbar>
    </AppBar>
  );
}

export default SfAppBar;
