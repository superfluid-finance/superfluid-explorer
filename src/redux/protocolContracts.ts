import metadata from "@superfluid-finance/metadata";

interface ContractAddresses {
  resolver: string;
  host: string;
  CFAv1: string;
  IDAv1: string;
  superTokenFactory: string;
  superfluidLoader: string;
  TOGA?: string;
  GDAv1?: string;
  flowScheduler?: string;
  vestingScheduler?: string;
  batchLiquidator?: string;
}

interface NetworkContracts {
  [any: string]: ContractAddresses;
}

const networkMetadataToChainId = metadata.networks.reduce((acc, config) => {
  acc[config.chainId] = {
    resolver: config.contractsV1.resolver,
    host: config.contractsV1.host,
    CFAv1: config.contractsV1.cfaV1,
    IDAv1: config.contractsV1.idaV1,
    superTokenFactory: config.contractsV1.superTokenFactory,
    superfluidLoader: config.contractsV1.superfluidLoader,
    TOGA: config.contractsV1.toga,
    GDAv1: config.contractsV1.gdaV1,
    batchLiquidator: config.contractsV1.batchLiquidator,
    flowScheduler: config.contractsV1.flowScheduler,
    vestingScheduler: config.contractsV1.vestingScheduler,
  };
  return acc;
}, {} as { [key: string]: ContractAddresses });

const protocolContracts: NetworkContracts = {
  "eth-mainnet": networkMetadataToChainId[1],
  "polygon-mainnet": networkMetadataToChainId[137],
  "xdai-mainnet": networkMetadataToChainId[100],
  "optimism-mainnet": networkMetadataToChainId[10],
  "arbitrum-one": networkMetadataToChainId[42161],
  "eth-goerli": networkMetadataToChainId[5],
  "polygon-mumbai": networkMetadataToChainId[80001],
  "avalanche-fuji": networkMetadataToChainId[43113],
  "avalanche-c": networkMetadataToChainId[43114],
  "bsc-mainnet": networkMetadataToChainId[56],
  "celo-mainnet": networkMetadataToChainId[42220],
  "arbitrum-goerli": networkMetadataToChainId[421613],
  "optimism-goerli": networkMetadataToChainId[420],
  "eth-sepolia": networkMetadataToChainId[11155111],
  "polygon-zkevm-testnet": networkMetadataToChainId[1442],
  "base-goerli": networkMetadataToChainId[84531],
};

export default protocolContracts;
