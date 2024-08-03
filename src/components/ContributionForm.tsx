import { useState } from "react";
import { ethers } from "ethers";
import contactAbi from '../../contracts/contactABI.json'
import { contractAddress } from '@/utils/wallet'

export default function ContributeForm() {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    console.log(amount);
    setLoading(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contactAbi, signer);

      const tx = await contract.contribute({ value: ethers.utils.parseEther(String(amount)) });
      await tx.wait();

      setAmount(0);
      setLoading(true);
      alert('Contribution submitted successfully!');
    } catch (error) {
      setLoading(true);
      alert(error.message);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="ethAmount" className="block text-sm font-medium text-gray-700">
          ETH Amount
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            onChange={(event) => setAmount(Number(event.target.value))}
            value={amount}
            type="number"
            name="ethAmount"
            id="ethAmount"
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md text-black py-2"
            placeholder="0.0"
            step="0.01"
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <span className="text-gray-500 sm:text-sm mr-2">
              ETH
            </span>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {loading ? '. . . .' : 'Contribute'}
      </button>
    </form>
  );
}