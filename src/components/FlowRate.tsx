import {FC} from "react";

const FlowRate: FC<{
  flowRate: string
}> = ({ flowRate }) => {
  return (<span>{flowRate}</span>);
}

export default FlowRate;
