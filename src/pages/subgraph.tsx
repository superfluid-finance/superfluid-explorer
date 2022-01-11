import {FC} from "react";
import dynamic from "next/dynamic";

const DynamicLazyComponent = dynamic(() => import('../components/SubgraphExplorer'), {
  ssr: false,
})

const SubgraphPage: FC = () => {
  return (<DynamicLazyComponent />);
}

export default SubgraphPage;
