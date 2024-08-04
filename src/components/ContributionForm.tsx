import { useEffect, useState } from "react";
import { contribute, getNetworkCurrency } from '@/utils/wallet'

export default function ContributeForm() {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState('ETH');

  const getCurrency = async () => {
    const currency = await getNetworkCurrency();
    setCurrency(currency);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    console.log(amount);
    setLoading(true);

    try {
      await contribute(String(amount));

      setAmount(0);
      setLoading(false);
      alert('Contribution submitted successfully!');
    } catch (error) {
      setLoading(false);
      alert(error.message);
    }
  };

  useEffect(() => {
    getCurrency();
  }, []);

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="ethAmount" className="block text-sm font-medium text-gray-700">
          {currency} Amount
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
              {currency}
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