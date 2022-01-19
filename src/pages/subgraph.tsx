import dynamic from "next/dynamic";
import {NextPage} from "next";
import {wrapper} from "../redux/store";

const DynamicLazyComponent = dynamic(() => import('../components/SubgraphExplorer'), {
  ssr: false,
})

const SubgraphPage: NextPage = () => {
  return (<DynamicLazyComponent />);
}

export const getServerSideProps = wrapper.getServerSideProps(store => async () => {
  return {
    props: {},
  };
})

export default SubgraphPage;
