import { ensureEnvironmentVariable } from "../utils/getEnvironmentVariableOrThrow";

export type Network = {
  displayName: string,
  slugName: string,
  chainId: number,
  rpcUrl: string,
  subgraphUrl: string
  getLinkForTransaction(txHash: string): string;
  isTestnet: boolean
}

const infuraId = ensureEnvironmentVariable(process.env.NEXT_PUBLIC_INFURA_ID, "NEXT_PUBLIC_INFURA_ID");

export const networks: Network[] = [
  {
    displayName: "Ropsten",
    slugName: "ropsten",
    chainId: 3,
    isTestnet: true,
    rpcUrl: `https://ropsten.infura.io/v3/${infuraId}`,
    subgraphUrl: "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-ropsten",
    getLinkForTransaction: (txHash: string): string => `https://ropsten.etherscan.io/tx/${txHash}`,
  },
  {
    displayName: "Rinkeby",
    slugName: "rinkeby",
    chainId: 4,
    isTestnet: true,
    rpcUrl: `https://rinkeby.infura.io/v3/${infuraId}`,
    subgraphUrl: "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-rinkeby",
    getLinkForTransaction: (txHash: string): string => `https://rinkeby.etherscan.io/tx/${txHash}`
  },
  {
    displayName: "Goerli",
    slugName: "goerli",
    chainId: 5,
    isTestnet: true,
    rpcUrl: `https://goerli.infura.io/v3/${infuraId}`,
    subgraphUrl: "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-goerli",
    getLinkForTransaction: (txHash: string): string => `https://goerli.etherscan.io/tx/${txHash}`
  },
  {
    displayName: "Kovan",
    slugName: "kovan",
    chainId: 42,
    isTestnet: true,
    rpcUrl: `https://kovan.infura.io/v3/${infuraId}`,
    subgraphUrl: "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-kovan",
    getLinkForTransaction: (txHash: string): string => `https://kovan.etherscan.io/tx/${txHash}`
  },
  {
    displayName: "Gnosis Chain",
    slugName: "xdai",
    chainId: 100,
    isTestnet: false,
    rpcUrl: "https://rpc.xdaichain.com/",
    subgraphUrl: "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-xdai",
    getLinkForTransaction: (txHash: string): string => `https://blockscout.com/xdai/mainnet/tx/${txHash}`
  },
  {
    displayName: "Polygon",
    slugName: "matic",
    chainId: 137,
    isTestnet: false,
    rpcUrl: `https://polygon-mainnet.infura.io/v3/${infuraId}`,
    subgraphUrl: "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-matic",
    getLinkForTransaction: (txHash: string): string => `https://polygonscan.com/tx/${txHash}`
  },
  {
    displayName: "Mumbai",
    slugName: "mumbai",
    chainId: 80001,
    isTestnet: true,
    rpcUrl: `https://polygon-mumbai.infura.io/v3/${infuraId}`,
    subgraphUrl: "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-mumbai",
    getLinkForTransaction: (txHash: string): string => `https://mumbai.polygonscan.com/tx/${txHash}`
  },
  {
    displayName: "Arbitrum-Rinkeby",
    slugName: "arbitrum-rinkeby",
    chainId: 421611,
    isTestnet: true,
    rpcUrl: `https://arbitrum-rinkeby.infura.io/v3/${infuraId}`,
    subgraphUrl: "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-arbitrum-rinkeby",
    getLinkForTransaction: (txHash: string): string => `https://rinkeby-explorer.arbitrum.io/tx/${txHash}`
  },
  {
    displayName: "Optimism-Kovan",
    slugName: "optimism-kovan",
    chainId: 69,
    isTestnet: true,
    rpcUrl: `https://optimism-kovan.infura.io/v3/${infuraId}`,
    subgraphUrl: "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-optimism-kovan",
    getLinkForTransaction: (txHash: string): string => `https://kovan-optimistic.etherscan.io/tx/${txHash}`
  },
  {
    displayName: "Avalanche-Fuji",
    slugName: "avalanche-fuji",
    chainId: 43113,
    isTestnet: true,
    rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
    subgraphUrl: "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-avalanche-fuji",
    getLinkForTransaction: (txHash: string): string => `https://testnet.snowtrace.io/tx/${txHash}`
  },
];

export const networksByName = new Map(networks.map(x => [x.slugName.toLowerCase(), x]))

export const networksByChainId = new Map(networks.map(x => [x.chainId, x]))

export const tryGetNetwork = (x: unknown): Network | undefined => {
  let network: Network | undefined = undefined;

  if (typeof x === "string") {
    network = networksByName.get(x.toLowerCase());
  }

  if (typeof x === "number") {
    network = networksByChainId.get(x);
  }

  return network;
}

export const tryGetString = (x: unknown): string | undefined => {
  if (typeof x === "string") {
    return x;
  }
} 
