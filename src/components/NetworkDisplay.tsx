import { Box } from "@mui/material";
import { FC } from "react";
import { Network } from "../redux/networks";

const NetworkDisplay: FC<{ network: Network }> = ({ network }) => {
  return <Box sx={{ fontSize: "inherit" }}>{`${network.displayName}`}</Box>;
};

export default NetworkDisplay;
