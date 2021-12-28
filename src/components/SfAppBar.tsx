import * as React from "react";
import {AppBar, Button, Menu, MenuItem, Toolbar} from "@mui/material";
import {chainIds, networks} from "../redux/store";
import AppLink from "./AppLink";

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
        <Button
          id="network-menu"
          aria-controls="network-menu"
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={openMenu}
          onMouseEnter={openMenu}
          size="medium"
        >
          Network
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={closeMenu}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
            onMouseLeave: closeMenu
          }}
        >
          {networks.map(network => (<AppLink href={`/${network.name}/supertokens`}><MenuItem>{network.name}</MenuItem></AppLink>))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default SfAppBar;
