'use client';

import { checkWalletConnection, connectWallet, getNetworkCurrency, getWalletBalance } from "@/utils/wallet";
import { useEffect, useState } from "react";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState('0');
  const [currency, setCurrency] = useState('');

  const handleConnectWallet = async () => {
    try {
      const { address } = await connectWallet();
      // Do something with the connected wallet address
      setWalletAddress(address);
    } catch (error) {
      // Handle any errors
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
          Connect wallet
        </button>
        )}
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
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
                {currency} {balance}
              </span>
            </p>
          </>
        ) : (
          <p className="text-gray-700">Please connect to a wallet</p>
        )}
      </section>
    </main>
  );
}
