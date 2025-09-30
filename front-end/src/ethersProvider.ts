import { JsonRpcProvider } from "ethers";

// Westend Asset Hub RPC URL
const PASSET_RPC_URL = "https://testnet-passet-hub-eth-rpc.polkadot.io";

// Force to use Westend network - always use direct RPC connection
export const ethersProvider = new JsonRpcProvider(PASSET_RPC_URL);
