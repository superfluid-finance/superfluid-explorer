import dynamic from "next/dynamic";
import {NextPage} from "next";

const DynamicLazyComponent = dynamic(() => import('../components/SubgraphExplorer'), {
  ssr: false,
})

const SubgraphPage: NextPage = () => {
  return (<DynamicLazyComponent />);
}

export default SubgraphPage;
