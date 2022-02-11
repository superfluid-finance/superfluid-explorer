import { FC, useState } from "react";
import AppLink from "./AppLink";
import { Network } from "../redux/networks";
import { IconButton, Tooltip } from "@mui/material";
import SubgraphIcon from "./SubgraphIcon";

const SubgraphQueryLink: FC<{
  network: Network;
  query: string;
  variables?: string;
}> = ({ network, query, variables }) => {
  const [queryCompressed] = useState(btoa(query));
  const [variablesCompressed] = useState(
    variables ? btoa(variables) : undefined
  );

  return (
    <Tooltip title="View on Subgraph Explorer">
      <AppLink
        href={`/subgraph?_network=${
          network.slugName
        }&_query=${queryCompressed}${
          variablesCompressed ? `&_variables=${variablesCompressed}` : ""
        }`}
      >
        <IconButton>
          <SubgraphIcon />
        </IconButton>
      </AppLink>
    </Tooltip>
  );
};

export default SubgraphQueryLink;
