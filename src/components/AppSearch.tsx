import {FC, useEffect, useState} from "react";
import {
  Button,
  TextField,
  Typography,
  DialogContent,
  Dialog,
  DialogTitle,
  InputAdornment, Card, ListItem, List, Menu, MenuItem, ListItemButton, CircularProgress, Container, Grid
} from "@mui/material";
import {useRouter} from "next/router";
import {Network, networks, sfApi} from "../redux/store";
import {skipToken} from "@reduxjs/toolkit/query";
import {ethers} from "ethers";
import {gql} from "graphql-request";
import SearchIcon from "@mui/icons-material/Search";
import AccountAddress, {AccountAddressFormatted} from "./AccountAddress";
import SuperTokenAddress, {SuperTokenFormatted} from "./SuperTokenAddress";
import {PossibleErrors} from "@superfluid-finance/sdk-redux";
import QueryError from "./QueryError";
import Box from "@mui/material/Box";
import {BoxProps} from "@mui/material/Box/Box";
import _ from "lodash";
import AppLink from "./AppLink";
import NextLink from 'next/link';
import NetworkFormatted from "./NetworkDisplay";

const searchByAddressDocument = gql`
  query Search($addressId: ID, $addressBytes: Bytes) {
    tokensByAddress: tokens(where: {id: $addressId}) {
      id
      symbol
      name
    }
    tokensByUnderlyingAddress: tokens(where: {underlyingAddress: $addressBytes}) {
      id
      symbol
      name
    }
    accounts(where: {id: $addressId}) {
      id
    }
  }
`;

type SubgraphSearchResult = {
  tokensByAddress: {
    id: string,
    symbol: string,
    name: string
  }[],
  tokensByUnderlyingAddress: {
    id: string,
    symbol: string,
    name: string
  }[],
  accounts: {
    id: string
  }[],
}

type NetworkSearchResult = {
  network: Network,
  isFetching: boolean,
  error?: PossibleErrors,
  tokens: {
    id: string
    symbol: string,
    name: string
  }[],
  accounts: {
    id: string
  }[]
}

const useSearchHook = (address: string): NetworkSearchResult[] => {
  const isSearchTermAddress = ethers.utils.isAddress(address);
  const chainResults: NetworkSearchResult[] = [];

  networks.forEach(network => {
    const queryState = sfApi.useAdHocSubgraphQuery(isSearchTermAddress ? {
      chainId: network.chainId,
      document: searchByAddressDocument,
      variables: {
        addressId: address.toLowerCase(),
        addressBytes: address.toLowerCase()
      }
    } : skipToken);

    if (!!queryState.data) {
      const queryResult = queryState.data as SubgraphSearchResult;
      chainResults.push({
        network: network,
        isFetching: queryState.isFetching,
        error: queryState.error,
        tokens: _.uniq(queryResult.tokensByAddress.concat(queryResult.tokensByUnderlyingAddress)),
        accounts: queryResult.accounts
      });
    }
  });

  if (!isSearchTermAddress) {
    return [];
  }

  return chainResults;
}

const AppSearch: FC<BoxProps> = (boxProps) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleRouteChange = () => {
      handleClose();
    }

    router.events.on('routeChangeStart', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [])

  const networkSearchResults = useSearchHook(searchTerm);

  return (
    <Box {...boxProps} >
      <Button id="search-button"
              aria-controls="network-menu"
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleOpen}
              size="medium"
              variant="contained">Search</Button>
      <Dialog
        fullWidth
        maxWidth="lg"
        onClose={handleClose} open={open}>
        <DialogContent>
          <TextField sx={{
            mt: 1
          }}
                     label="Search"
                     autoFocus fullWidth id="outlined-search" type="search"
                     value={searchTerm}
                     InputProps={{
                       startAdornment: (
                         <InputAdornment position="start">
                           <SearchIcon/>
                         </InputAdornment>
                       ),
                     }}
                     variant="outlined"
                     onChange={(e) => setSearchTerm(e.currentTarget.value)}/>
          {
            networkSearchResults.some(x => x.isFetching) ?
              <Grid container justifyContent="center" sx={{mt: 3}}>
                <CircularProgress/>
              </Grid> : networkSearchResults.filter(x => x.tokens.length || x.accounts.length).map(x => (
                <Box component="section" key={x.network.chainId}>
                  <Typography variant="subtitle1" component="h3"><NetworkFormatted network={x.network}/></Typography>
                  {x.error ? <QueryError error={x.error}/> :
                    <List>
                      {x.accounts.map(account => <ListItem disablePadding key={`${x.network.chainId}_${account.id}`}>
                        <NextLink href={`/${x.network.slugName}/accounts/${account.id}`} passHref>
                          <ListItemButton component="a">
                            <AccountAddressFormatted address={account.id}/>
                          </ListItemButton>
                        </NextLink>
                      </ListItem>)}
                      {x.tokens.map(token => <ListItem disablePadding key={`${x.network.chainId}_${token.id}`}>
                        <NextLink href={`/${x.network.slugName}/supertokens/${token.id}`} passHref>
                          <ListItemButton component="a">
                            <SuperTokenFormatted name={token.name} symbol={token.symbol} address={token.id}/>
                          </ListItemButton>
                        </NextLink>
                      </ListItem>)}
                    </List>
                  }
                </Box>))
          }
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default AppSearch;
