import { ethers } from 'ethers';

const INFURA_KEY = import.meta.env.VITE_INFURA_KEY || 'e2e72692061a4d02969ca51a4a08f545';
export const SEPOLIA_RPC = `https://sepolia.infura.io/v3/${INFURA_KEY}`;
export const MAINNET_RPC = `https://mainnet.infura.io/v3/${INFURA_KEY}`;

export type Network = 'sepolia' | 'mainnet';

export const getProvider = (network: Network = 'sepolia') => {
  const url = network === 'sepolia' ? SEPOLIA_RPC : MAINNET_RPC;
  return new ethers.JsonRpcProvider(url);
};

export const generateWallet = () => {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic?.phrase
  };
};

export const importWalletFromPk = (privateKey: string) => {
  try {
    const wallet = new ethers.Wallet(privateKey);
    return {
      address: wallet.address,
      privateKey: wallet.privateKey
    };
  } catch (e) {
    throw new Error("Invalid private key");
  }
};

export const importWalletFromMnemonic = (phrase: string) => {
  try {
    const wallet = ethers.Wallet.fromPhrase(phrase);
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: phrase
    };
  } catch (e) {
    throw new Error("Invalid mnemonic phrase");
  }
};

export const getEthBalance = async (address: string, network: Network = 'sepolia'): Promise<string> => {
  const provider = getProvider(network);
  const balanceWei = await provider.getBalance(address);
  return ethers.formatEther(balanceWei);
};

export const estimateGasForTransfer = async (
  fromAddress: string,
  toAddress: string,
  amountEth: string,
  network: Network = 'sepolia'
): Promise<string> => {
  const provider = getProvider(network);
  try {
    const value = ethers.parseEther(amountEth);
    const gasLimit = await provider.estimateGas({
      from: fromAddress,
      to: toAddress,
      value
    });
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice || 0n;
    const totalGasWei = gasLimit * gasPrice;
    return ethers.formatEther(totalGasWei);
  } catch (err: any) {
    throw new Error(`Gas estimation failed: ${err.message}`);
  }
};

export const sendEth = async (
  privateKey: string,
  toAddress: string,
  amountEth: string,
  network: Network = 'sepolia'
) => {
  const provider = getProvider(network);
  const wallet = new ethers.Wallet(privateKey, provider);
  const tx = await wallet.sendTransaction({
    to: toAddress,
    value: ethers.parseEther(amountEth)
  });
  return tx;
};

// Generic read/write for smart contracts
export const readContract = async (
  address: string,
  abi: string,
  methodName: string,
  args: any[],
  network: Network = 'sepolia'
) => {
  const provider = getProvider(network);
  const contract = new ethers.Contract(address, abi, provider);
  return await contract[methodName](...args);
};
