export default function MakeAClaim() {
  return (
    <form id="claimForm">
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Claim Amount (in MANTA)
        </label>
        <input type="number" id="amount" name="amount" min="0.01" step="0.01" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
    </div>
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Reason for Claim
        </label>
        <textarea id="reason" name="reason" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required></textarea>
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