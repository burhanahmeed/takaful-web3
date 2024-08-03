'use client';

// TODO: 
// 1. Add distribute surplus function
// 2. Add decide claim
// 3. Add approve claim

import ContributeForm from "@/components/ContributionForm";
import ListClaims from "@/components/ListClaims";
import MakeAClaim from "@/components/MakeAClaim";
import {
  checkWalletConnection,
  connectWallet,
  getNetworkCurrency,
  getTotalContribution,
  getWalletBalance,
  isAdmin as checkIsAdmin,
  getTotalParticipants
} from "@/utils/wallet";
import { useEffect, useState } from "react";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState('0');
  const [totalContribution, setTotalContribution] = useState('0');
  const [totalParticipant, setTotalParticipant] = useState('0');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currency, setCurrency] = useState('');
  const [activeTab, setActiveTab] = useState('contribute');

  const handleConnectWallet = async () => {
    try {
      const { address } = await connectWallet();
      // Do something with the connected wallet address
      setWalletAddress(address);
    } catch (error) {
      // Handle any errors
      console.log('Failed to connect wallet:', error);
    }
  };

  const handleMint = async () => {
    try {
      // TODO: Add minting logic here
      const response = await fetch('/api/zksbt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'sign', address: walletAddress }),
      });
      response.json();
      console.log(response.json());
    } catch (error) {
      console.error('Failed to mint:', error);
    }
  };

  useEffect(() => {
    async function initWallet() {
      try {
        const walletData = await checkWalletConnection();
        if (walletData) {
          setWalletAddress(walletData.address);
        }
      } catch (error) {
        console.error('Failed to reconnect wallet:', error);
      }
    }
    initWallet();
  }, []);

  useEffect(() => {
    async function fetchBalance() {
      if (walletAddress) {
        const balanceInEther = await getWalletBalance(walletAddress);
        const networkCurrency = await getNetworkCurrency();
        setBalance(balanceInEther);
        setCurrency(networkCurrency);

        const totalContributionWallet = await getTotalContribution();
        setTotalContribution(totalContributionWallet);

        const role = await checkIsAdmin();
        setIsAdmin(role);

        const totalParticipantWallet = await getTotalParticipants();
        setTotalParticipant(totalParticipantWallet);
      }
    }
    fetchBalance();
  }, [walletAddress]);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        {walletAddress ? (
          <button className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Connected to a wallet
        </button>
        ) : (
          <button onClick={handleConnectWallet} className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Connect wallet to HAQQ
        </button>
        )}
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            TakafulNet
          </a>
        </div>
      </div>

      <section className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-2 text-gray-800">Wallet Information</h2>
        {walletAddress ? (
          <>
            <p className="text-gray-700">
              <span className="font-semibold">Wallet Address:</span>
              <span className="ml-2 bg-white px-3 py-1 rounded-md text-blue-600 font-mono">
                {walletAddress}
              </span>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Wallet Balance:</span>
              <span className="ml-2 bg-white px-3 py-1 rounded-md text-blue-600 font-mono">
                {balance} {currency}
              </span>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Role:</span>
              <span className="ml-2 px-3 py-1 rounded-md">
                {isAdmin? 'Admin' : 'User'}
              </span>
            </p>
          </>
        ) : (
          <p className="text-gray-700">Please connect to a wallet</p>
        )}
      </section>

      {walletAddress && (
        <section className="bg-gray-100 p-4 rounded-lg shadow-md mt-8">
          <h2 className="text-lg font-bold mb-2 text-gray-800">Current statics</h2>
          <p className="text-gray-700">
              <span className="font-semibold">Total Contribution:</span>
              <span className="ml-2 bg-white px-3 py-1 rounded-md text-blue-600 font-mono">
                {(totalContribution)} {currency}
              </span>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Total Participants:</span>
              <span className="ml-2 px-3 py-1 rounded-md">
                {totalParticipant} Participants
              </span>
            </p>
        </section>
      )}

      <section className="bg-gray-100 p-4 rounded-lg shadow-md mt-8 w-full max-w-2xl">
        <div className="flex mb-4">
          <button
            className={`flex-1 py-2 px-4 text-center ${
              activeTab === 'contribute'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700'
            } rounded-tl-lg rounded-tr-lg`}
            onClick={() => setActiveTab('contribute')}
          >
            Make a Contribution
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center ${
              activeTab === 'claim'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700'
            } rounded-tl-lg rounded-tr-lg`}
            onClick={() => setActiveTab('claim')}
          >
            Make a Claim
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center ${
              activeTab === 'listClaims'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700'
            } rounded-tl-lg rounded-tr-lg`}
            onClick={() => setActiveTab('listClaims')}
          >
            List Claims
          </button>
        </div>
        <div className="bg-white p-4 rounded-b-lg text-black">
          {activeTab === 'contribute' ? (
            <div>
              <ContributeForm />
            </div>
          ) : activeTab === 'claim' ? (
            <div>
              <MakeAClaim />
            </div>
          ) : (
            <div>
              <ListClaims />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
