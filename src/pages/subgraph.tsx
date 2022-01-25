import dynamic from "next/dynamic";
import {NextPage} from "next";

const DynamicLazyComponent = dynamic(() => import('../components/SubgraphExplorer'), {
  ssr: false,
})

// NOTE: Don't start loading the Subgraph component on the server.
const SubgraphPage: NextPage = () => {
  return (<DynamicLazyComponent />);
}

export default SubgraphPage;
