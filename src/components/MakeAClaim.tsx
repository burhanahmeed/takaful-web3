import { useEffect, useState } from "react";
import { getNetworkCurrency, makeAClaim } from '@/utils/wallet'
import { ethers } from "ethers";

export default function MakeAClaim() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    amount: '',
    reason: '',
  });
  const [currency, setCurrency] = useState('ETH');

  const getCurrency = async () => {
    const currency = await getNetworkCurrency();
    setCurrency(currency);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const amountInEther = ethers.utils.parseEther(form.amount);
      await makeAClaim(amountInEther, form.reason);

      setLoading(false);
      alert('Claim submitted successfully!');
    } catch (error) {
      setLoading(false);
      console.error('Error submitting claim:', error);
      alert(`Failed to submit claim. ${error?.error?.message}`);
    }
  };

  useEffect(() => {
    getCurrency();
  }, []);

  return (
    <form id="claimForm" onSubmit={handleSubmit}>
    <div className="mb-4">
      <div className="mt-1 relative rounded-md shadow-sm">
          <input
            value={form.amount}
            onChange={
              (e) =>
                setForm({
                 ...form,
                  amount: e.target.value,
                })
            }
            type="number"
            name="ethAmount"
            id="ethAmount"
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md text-black py-2"
            placeholder="0.0"
            step="0.01"
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <span className="text-gray-500 sm:text-sm mr-2">
              {currency}
            </span>
          </div>
        </div>
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
    <div className="flex items-center justify-between">
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {loading ? '. . . ' : 'Submit Claim'}
      </button>
    </div>
</form>
  );
}