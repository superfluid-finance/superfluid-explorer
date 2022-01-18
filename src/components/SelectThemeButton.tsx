import {FC} from "react";
import {useTheme} from "next-themes";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const SelectThemeButton: FC = () => {
  const { theme, setTheme } = useTheme();

  const isDarkTheme = theme === 'dark';

  return (      <IconButton sx={{ ml: 1 }} onClick={() => setTheme(isDarkTheme ? 'light' : 'dark')} color="inherit">
    {isDarkTheme ? <Brightness7Icon /> : <Brightness4Icon />}
  </IconButton>);
}

export default SelectThemeButton;
