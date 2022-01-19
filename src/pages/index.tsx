import * as React from 'react';
import type {NextPage} from 'next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {Button} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {changeThemePreference} from "../redux/slices/appPreferences.slice";
import { wrapper } from '../redux/store';

const Home: NextPage = () => {
  const dispatch = useAppDispatch();
  const appPreferences = useAppSelector((state) => state.appPreferences);

  return (
    <Container maxWidth="lg">
      <p>Current preference: {appPreferences?.themePreference}</p>
      <Button onClick={() => console.log(appPreferences?.themePreference)}>Log current preference</Button>
      <Button onClick={() => dispatch(changeThemePreference('light'))}>Set preference to light</Button>
      <Button onClick={() => {
        dispatch(changeThemePreference('dark'))
      }}>Set preference to dark</Button>
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Superfluid Console
        </Typography>
      </Box>
    </Container>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async () => {
  return {
    props: {},
  };
})

export default Home;
