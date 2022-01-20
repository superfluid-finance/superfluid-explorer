import {CircularProgress} from "@mui/material";
import React from "react";

export default function SfLoader() {
  return(
      <div style={{alignItems: "center", display: "flex", justifyContent: "center", height: "100vh", width: "100vw"}}>
        <CircularProgress/>
        <span style={{justifyContent: "center", position: "fixed", top: "63%"}}>Loading...please wait</span>
      </div>
    )
}
