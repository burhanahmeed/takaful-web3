import * as ethers from 'ethers';
import ContractABI from '../../contracts/contactABI.json'
// import takafulAbi from '../../artifacts/contracts/takaful.sol/Takaful.json'

// const ContractABI = takafulAbi.abi;

export const contractAddress = '0x75396387172c596EfaF43Be5B0f9bD366F1Fd344';

const haqqNetwork = {
  chainId: 54211,  // HAQQ chain ID
  name: 'HAQQ',
  rpc: 'https://rpc.eth.testedge2.haqq.network'  // HAQQ RPC URL
};

export const connectWalletRpc = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/');
      const wallet = new ethers.Wallet('', provider);
      const address = wallet.address
      const balance = wallet.getBalance();
      const signer = provider.getSigner();

      return { address, balance, provider, signer };
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      throw new Error('No crypto wallet found. Please install it.');
    }
  } else {
    throw new Error('No crypto wallet found. Please install it.');
  }
};

export async function connectWallet() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Create a new Web3Provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Check if we're on the HAQQ network
      const network = await provider.getNetwork();
      if (network.chainId !== haqqNetwork.chainId) {
        // If not, request a network switch
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: ethers.utils.hexValue(haqqNetwork.chainId) }],
        });
      }

      // Get the signer
      const signer = provider.getSigner();
      
      // Get the connected wallet address
      const address = await signer.getAddress();

      localStorage.setItem('walletConnected', 'true');
      
      return { provider, signer, address };
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  } else {
    console.error('Ethereum object not found, install MetaMask.');
    throw new Error('No crypto wallet found. Please install it.');
  }
}

export async function checkWalletConnection() {
  const isConnected = localStorage.getItem('walletConnected') === 'true';
  if (isConnected) {
    return connectWallet();
  }
  return null;
}

export async function getWalletBalance(address: string) {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  } else {
    throw new Error('No Ethereum provider found');
  }
}

export function getContractDetail(signer: any) {
  return new ethers.Contract(contractAddress, ContractABI, signer);
}

export async function getContractBalance() {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    return ethers.utils.formatEther(balance);
  } else {
    throw new Error('No Ethereum provider found');
  }
}

export async function getNetworkCurrency() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const network = await provider.getNetwork();

  switch(network.chainId) {
    case 1:
      return 'ETH'; // Ethereum Mainnet
    case 137:
      return 'MATIC'; // Polygon
    case 56:
      return 'BNB'; // Binance Smart Chain
    // Add more cases for other networks as needed
    case 11155111:
      return 'SepoliaETH';
    case 11235:
    case 54211:
      return 'ISLM';
    default:
      return 'Unknown';
  }
}

export const contribute =  async (amount: string) => {
  const { signer } = await connectWallet();
  const contract = getContractDetail(signer);
  const tx = await contract.contribute({ value: ethers.utils.parseEther(amount) });
  return await tx.wait();
};

export const getTotalContribution = async () => {
  const { signer } = await connectWallet();
  const contract = getContractDetail(signer);
  const totalContribution = await contract.getTotalContributions();
  return ethers.utils.formatEther(totalContribution);
};

export const listClaims = async () => {
  const { signer } = await connectWallet();
  const contract = getContractDetail(signer);
  const claims = await contract.listClaims();
  const address = await signer.getAddress();

  return Promise.all(claims.map(async (claim: any, idx: number) => {
    const hasVoted = await contract.hasVotedFunction(idx, address);
    return {
      claimant: claim.claimant,
      amount: ethers.utils.formatEther(claim.amount),
      reason: claim.reason,
      votesFor: claim.votesFor.toNumber(),
      votesAgainst: claim.votesAgainst.toNumber(),
      decided: claim.decided,
      approved: claim.approved,
      votingDeadline: new Date(claim.votingDeadline.toNumber() * 1000),
      hasVoted: hasVoted
    };
  }));
};

export const isAdmin = async () => {
  const { signer } = await connectWallet();
  const contract = getContractDetail(signer);
  const adminAddress = await contract.admin();
  const currentAddress = await signer.getAddress();
  return adminAddress.toLowerCase() === currentAddress.toLowerCase();
};

export const getTotalParticipants = async () => {
  const { signer } = await connectWallet();
  const contract = getContractDetail(signer);
  const totalParticipants = await contract.getTotalParticipants();
  return totalParticipants.toNumber();
};

export const makeAClaim = async (amount: any, reasonHash: string) => {
  const { signer } = await connectWallet();
  const contract = getContractDetail(signer);

  const tx = await contract.submitClaim(amount, reasonHash);
  return await tx.wait(); // Wait for transaction to be mined
}

export const voteOnClaim = async (claimId: number, approve: boolean) => {
  const { signer } = await connectWallet();
  const contract = getContractDetail(signer);
  const tx = await contract.voteOnClaim(claimId, approve);
  await tx.wait();
  return tx;
};

export const decideClaim = async (claimId: number) => {
  const { signer } = await connectWallet();
  const contract = getContractDetail(signer);
  const tx = await contract.decideClaim(claimId);
  await tx.wait();
  return tx;
};

export const distribute = async () => {
  const { signer } = await connectWallet();
  const contract = getContractDetail(signer);
  const tx = await contract.distributeSurplus();
  await tx.wait();
  return tx;
};