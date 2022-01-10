import {FC, useEffect, useState} from "react";
import {
  Button,
  TextField,
  Typography,
  DialogContent,
  Dialog,
  DialogTitle,
  InputAdornment, Card, ListItem, List
} from "@mui/material";
import {useRouter} from "next/router";
import {Network, networks, sfApi} from "../redux/store";
import {skipToken} from "@reduxjs/toolkit/query";
import {ethers} from "ethers";
import {gql} from "graphql-request";
import SearchIcon from "@mui/icons-material/Search";
import AccountAddress from "./AccountAddress";
import SuperTokenAddress from "./SuperTokenAddress";
import {PossibleErrors} from "@superfluid-finance/sdk-redux";
import QueryError from "./QueryError";
import Box from "@mui/material/Box";
import {BoxProps} from "@mui/material/Box/Box";

const searchByAddressDocument = gql`
  query Search($addressId: ID, $addressString: String) {
    tokensByAddress: tokens(where: {id: $addressId}) {
      id
    }
    tokensByUnderlyingAddress: tokens(where: {underlyingToken: $addressString}) {
      id
    }
    accounts(where: {id: $addressId}) {
      id
    }
  }
`;

type SubgraphSearchResult = {
  tokensByAddress: {
    id: string
  }[],
  tokensByUnderlyingAddress: {
    id: string
  }[],
  accounts: {
    id: string
  }[],
}

type NetworkSearchResult = {
  network: Network,
  error?: PossibleErrors,
  tokens: {
    id: string
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
        addressString: address.toLowerCase()
      }
    } : skipToken);

    if (!!queryState.data) {
      const queryResult = queryState.data as SubgraphSearchResult;
      chainResults.push({
        network: network,
        error: queryState.error,
        tokens: queryResult.tokensByAddress.concat(queryResult.tokensByUnderlyingAddress),
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
        <DialogTitle>Search</DialogTitle>
        <DialogContent>
          <TextField autoFocus fullWidth id="outlined-search" type="search"
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
            networkSearchResults.map(x => (<Box key={x.network.chainId}>
              <Typography variant="h3">
                {x.network.name}
              </Typography>
              {x.error ? <QueryError error={x.error}/> : <Card sx={{p: 2}}>
                <List>
                  {x.accounts.map(account => <ListItem key={`${x.network.chainId}_${account.id}`}><AccountAddress network={x.network} address={account.id}/></ListItem>)}
                  {x.tokens.map(token => <ListItem key={`${x.network.chainId}_${token.id}`}><SuperTokenAddress network={x.network} address={token.id}/></ListItem>)}
                </List>
              </Card>
              }
            </Box>))
          }
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default AppSearch;
