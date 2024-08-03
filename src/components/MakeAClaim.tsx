import { useState } from "react";
import contactAbi from '../../contracts/contactABI.json'
import { contractAddress } from '@/utils/wallet'
import { ethers } from "ethers";

export default function MakeAClaim() {
  const [form, setForm] = useState({
    amount: '',
    reason: '',
    reasonScore: 0,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(form);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []); // Request account access
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contactAbi, signer);

      const amountInEther = ethers.utils.parseEther(form.amount); // Convert amount to Wei if needed

      const tx = await contract.submitClaim(amountInEther, form.reason);
      await tx.wait(); // Wait for transaction to be mined

      alert('Claim submitted successfully!');
    } catch (error) {
      console.error('Error submitting claim:', error);
      alert('Failed to submit claim.');
    }
  };

  return (
    <form id="claimForm" onSubmit={handleSubmit}>
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Claim Amount (in MANTA)
        </label>
        <input value={form.amount} onChange={
          (e) =>
            setForm({
             ...form,
              amount: e.target.value,
            })
        } type="number" id="amount" name="amount" step="0.01" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
    </div>
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Reason for Claim
        </label>
        <textarea value={form.reason} onChange={
          (e) =>
            setForm({
             ...form,
              reason: e.target.value,
            })
        } id="reason" name="reason" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required></textarea>
    </div>
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Reason Score (For ZK simulation only)
        </label>
        <input value={form.reasonScore} onChange={
          (e) =>
            setForm({
             ...form,
             reasonScore: Number(e.target.value),
            })
        } type="number" id="reasonScore" name="reasonScore" step="1" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
    </div>
    <div className="flex items-center justify-between">
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Submit Claim
      </button>
    </div>
</form>
  );
}