import { FC, ReactElement } from "react";
import { PossibleErrors } from "@superfluid-finance/sdk-redux";
import { Alert, Button } from "@mui/material";

interface Props {
  error: PossibleErrors;
  retry?: () => void;
}

const QueryError: FC<Props> = ({ error, retry }): ReactElement => {
  return (
    <>
      <Alert sx={{ m: 1 }} severity="error">
        {error.message}
      </Alert>
      {retry && (
        <Button variant="contained" onClick={() => retry()}>
          Try again?
        </Button>
      )}
    </>
  );
};

export default QueryError;
