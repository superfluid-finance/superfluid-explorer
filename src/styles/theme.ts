import {createTheme} from '@mui/material/styles';
import {red} from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
  components: {
    MuiButtonBase: {
      // The properties to apply
      defaultProps: {
        disableRipple: true // No more ripple, on the whole application!
      }
    }
  }
});

export default theme;
