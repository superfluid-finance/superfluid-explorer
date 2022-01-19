import * as React from 'react';
import type {NextPage} from 'next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { wrapper } from '../redux/store';

const Home: NextPage = () => {

  return (
    <Container maxWidth="lg">
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
