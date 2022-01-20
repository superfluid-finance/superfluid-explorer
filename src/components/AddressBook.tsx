import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField
} from "@mui/material";
import {FC, useState} from "react";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import { addressBookSelectors, addressBookSlice, createEntryId, getEntryId} from "../redux/slices/addressBook.slice";
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

  const existingEntry = useAppSelector(state => addressBookSelectors.selectById(state, createEntryId(network, address)));
  const [nameTag, setNameTag] = useState<string>(existingEntry?.nameTag ?? "");

  const dispatch = useAppDispatch();

  const handleRemove = () => {
    handleClose();
    if (existingEntry) {
      dispatch(addressBookSlice.actions.entryRemoved(getEntryId(existingEntry)));
    }
  }

  const handleSave = () => {
    handleClose();
    dispatch(addressBookSlice.actions.entryUpserted({
      chainId: network.chainId,
      address: ethers.utils.getAddress(address),
      nameTag: nameTag
    }));
  }

  return (<Dialog open={open} onClose={handleClose}>
    <DialogTitle>{ existingEntry ? "Add favourite" : "Edit favourite" }</DialogTitle>
    <DialogContent>
      <DialogContentText>
Lorem ipsum text
      </DialogContentText>
      <TextField
        autoFocus
        margin="dense"
        id="name"
        label="Name"
        type="text"
        fullWidth
        variant="standard"
        value={nameTag}
        onChange={(event => setNameTag(event.target.value.trim()))}
      />
    </DialogContent>
    <DialogActions>
      {existingEntry ? <Button onClick={handleRemove} variant="outlined">Remove favourite</Button> :
        <Button onClick={handleClose}>Cancel</Button>}
      <Button onClick={handleSave} variant="contained">Save</Button>
    </DialogActions>
  </Dialog>);
}
