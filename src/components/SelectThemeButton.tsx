import {FC} from "react";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import useSfTheme from "../styles/useSfTheme";
import {useAppDispatch} from "../redux/hooks";
import {changeThemePreference} from "../redux/slices/appPreferences.slice";

const SelectThemeButton: FC = () => {
  const dispatch = useAppDispatch();
  const theme = useSfTheme();

  const isDarkTheme = theme.palette.mode === 'dark';

  return (<IconButton sx={{ml: 1}} onClick={() => dispatch(changeThemePreference(isDarkTheme ? 'light' : 'dark'))}
                      color="inherit">
    {isDarkTheme ? <Brightness7Icon/> : <Brightness4Icon/>}
  </IconButton>);
}

export default SelectThemeButton;
