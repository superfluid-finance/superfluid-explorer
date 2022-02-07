import { BigNumber, ethers } from "ethers";

const calculateEtherAmountReceived = (
    publisherIndexValue: BigNumber,
    subscriberTotalAmountReceivedUntilUpdatedAt: BigNumber,
    subscriberIndexValueUntilUpdatedAt: BigNumber,
    subscriberUnits: number
  ) => {
    const totalUnitsReceived = subscriberTotalAmountReceivedUntilUpdatedAt.add(
      publisherIndexValue
        .sub(subscriberIndexValueUntilUpdatedAt)
        .mul(subscriberUnits)
    );
  
    return ethers.utils.formatEther(totalUnitsReceived);
  };

export default calculateEtherAmountReceived;