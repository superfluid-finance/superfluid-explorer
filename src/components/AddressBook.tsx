import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, Divider,
  IconButton,
  TextField
} from "@mui/material";
import {FC, useState} from "react";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {addressBookSelectors, addressBookSlice, createEntryId, getEntryId} from "../redux/slices/addressBook.slice";
import {Network} from "../redux/networks";
import {ethers} from "ethers";

export const FavouriteButton: FC<{ network: Network, address: string }> = ({network, address}) => {
  const entry = useAppSelector(state => addressBookSelectors.selectById(state, createEntryId(network, address)));
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (<><IconButton
    onClick={() => setIsDialogOpen(!isDialogOpen)}
  >
    {entry ? (<StarIcon/>) : (<StarBorderIcon/>)}
  </IconButton>
    <FavouriteDialog network={network} address={address} open={isDialogOpen}
                     handleClose={() => setIsDialogOpen(false)}/>
  </>);
}

export const FavouriteDialog: FC<{ network: Network, address: string, open: boolean, handleClose: () => void }> = ({
                                                                                                                     network,
                                                                                                                     address,
                                                                                                                     open,
                                                                                                                     handleClose
                                                                                                                   }) => {
  const getInitialNameTag = () => existingEntry?.nameTag ?? "";

  const existingEntry = useAppSelector(state => addressBookSelectors.selectById(state, createEntryId(network, address)));
  const [nameTag, setNameTag] = useState<string>(getInitialNameTag());

  const dispatch = useAppDispatch();

  const handleCloseWrapped = () => {
    handleClose();
    setNameTag(getInitialNameTag());
  }

  const handleRemove = () => {
    handleCloseWrapped();
    if (existingEntry) {
      dispatch(addressBookSlice.actions.entryRemoved(getEntryId(existingEntry)));
    }
  }

  const handleSave = () => {
    handleCloseWrapped();
    dispatch(addressBookSlice.actions.entryUpserted({
      chainId: network.chainId,
      address: ethers.utils.getAddress(address),
      nameTag: nameTag
    }));
  }

  return (<Dialog fullWidth maxWidth="xs" open={open} onClose={handleCloseWrapped}>
    <Box sx={{pb: 1}}>
      <Box sx={{ display: "flex", justifyContent: 'center' }}>
      <DialogTitle>{existingEntry ? "Add favourite" : "Edit favourite"}</DialogTitle>
      </Box>
      <DialogContent>
        <DialogContentText>
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name Tag"
          type="text"
          fullWidth
          variant="standard"
          value={nameTag}
          onChange={(event => setNameTag(event.target.value.trim()))}
        />
      </DialogContent>
      <DialogActions>
        {existingEntry ? <Button onClick={handleRemove} variant="outlined">Remove favourite</Button> :
          <Button onClick={handleCloseWrapped}>Cancel</Button>}
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Box>
  </Dialog>);
}
