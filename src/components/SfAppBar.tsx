import * as React from "react";
import {AppBar, Button, Menu, MenuItem, Toolbar} from "@mui/material";
import {networks} from "../redux/store";
import AppLink from "./AppLink";
import AppSearch from "./AppSearch";

const SfAppBar = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <AppSearch/>
        <AppLink href="/subgraph"> <Button sx={{ml: 1}}
                                           id="search-button"
                                           size="medium"
                                           variant="contained">Subgraph</Button></AppLink>


        {/*<Button*/}
        {/*  id="network-menu"*/}
        {/*  aria-controls="network-menu"*/}
        {/*  aria-haspopup="true"*/}
        {/*  aria-expanded={open ? 'true' : undefined}*/}
        {/*  onClick={openMenu}*/}
        {/*  onMouseEnter={openMenu}*/}
        {/*  size="medium"*/}
        {/*  variant="contained"*/}
        {/*>*/}
        {/*  Network*/}
        {/*</Button>*/}
        {/*<Menu*/}
        {/*  id="basic-menu"*/}
        {/*  anchorEl={anchorEl}*/}
        {/*  open={open}*/}
        {/*  onClose={closeMenu}*/}
        {/*  MenuListProps={{*/}
        {/*    'aria-labelledby': 'basic-button',*/}
        {/*    onMouseLeave: closeMenu*/}
        {/*  }}*/}
        {/*>*/}
        {/*  {networks.map(network => (<AppLink key={network.chainId} href={`/${network.name}/supertokens`}><MenuItem>{network.name}</MenuItem></AppLink>))}*/}
        {/*</Menu>*/}
      </Toolbar>
    </AppBar>
  );
}

export default SfAppBar;
