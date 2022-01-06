import {FC, ReactElement, useEffect, useState} from "react";
import {
  Box,
  Modal,
  Button,
  TextField,
  Typography,
  DialogContent,
  Dialog,
  DialogTitle,
  ListItem,
  List
} from "@mui/material";
import {useRouter} from "next/router";
import {findNetwork, Network, networks, sfApi} from "../redux/store";
import {Account, Token} from "@superfluid-finance/sdk-core";
import {skipToken} from "@reduxjs/toolkit/query";
import {ethers} from "ethers";

const AppSearch: FC = () => {
  // return <TextField id="outlined-search" label="Search field" type="search" />
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const router = useRouter()
  const {networkName} = router.query;
  const [searchTerm, setSearchTerm] = useState("");
  const [accounts, setAccounts] = useState<({ network: Network } & Account)[]>([]);
  const [tokens, setTokens] = useState<({ network: Network } & Token)[]>([]);

  const network = typeof networkName === "string" ? findNetwork(networkName) : undefined;
  const isAddress = ethers.utils.isAddress(searchTerm);

  const accountsQuery = sfApi.useAccountsQuery((network && isAddress) ? {
    chainId: network.chainId,
    filter: {
      id: searchTerm
    }
  } : skipToken);
  const tokensQuery = sfApi.useTokensQuery((network && isAddress) ? {
    chainId: network.chainId,
    filter: {
      id: searchTerm
    }
  } : skipToken);

  // const [triggerAccountsQuery, accountsQueryResult] = sfApi.useLazyAccountsQuery();
  // const [triggerTokensQuery, tokensQueryResult] = sfApi.useLazyTokensQuery();
  //
  //
  //
  // useEffect(() => {
  //   const accountQueryResults = networks.map((network) => {
  //     return triggerAccountsQuery({
  //       chainId: network.chainId,
  //       filter: {
  //         id: searchTerm
  //       }
  //     })
  //   })
  //
  //   const tokenQueryResults = networks.map((network) => {
  //     return triggerAccountsQuery({
  //       chainId: network.chainId,
  //       filter: {
  //         id: searchTerm
  //       }
  //     })
  //   })
  //
  // }, [searchTerm])

  return (
    <>
      <Button id="search-button"
              aria-controls="network-menu"
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleOpen}
              size="medium"
              variant="contained">Search</Button>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Search</DialogTitle>
        <DialogContent>
          <DialogContent>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContent>

          <TextField autoFocus fullWidth id="outlined-search" label="Search field" type="search"
                     onChange={(e) => setSearchTerm(e.currentTarget.value)}/>
          <List>
            {
              accountsQuery.data ? accountsQuery.data.data.map(x => (<ListItem>{x.id}</ListItem>)) :
                <ListItem>No accounts.</ListItem>
            }
          </List>
          <List>
            {
              tokensQuery.data ? tokensQuery.data.data.map(x => (<ListItem>{x.id}</ListItem>)) :
                <ListItem>No tokens.</ListItem>
            }
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AppSearch;
