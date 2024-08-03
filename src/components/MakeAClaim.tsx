import { useState } from "react";
import { makeAClaim } from '@/utils/wallet'
import { groth16 } from "snarkjs";
import { ethers } from "ethers";

export default function MakeAClaim() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    amount: '',
    reason: '',
    reasonScore: 0,
  });

  const generateProof = async (inputs: any) => {
    const { proof, publicSignals } = await groth16.fullProve(
      inputs,
      'claimValidity.wasm',
      'claimValidity_final.zkey'
    );
    return { proof, publicSignals };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const reasonHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(form.reason));
      const inputs = {
          amount: ethers.utils.parseEther(form.amount),
          reason: reasonHash,
          reasonScore: form.reasonScore, // Example score, in practice should be calculated based on reason
          minAmount: 0.0001,
          maxAmount: 0.2
      };

      const { proof, publicSignals } = await generateProof(inputs);

      // Convert proof to the format required by the smart contract
      const proofData = {
          a: proof.pi_a,
          b: proof.pi_b,
          c: proof.pi_c,
          input: publicSignals
      };
      await makeAClaim(inputs.amount, reasonHash, proofData);

      setLoading(false);
      alert('Claim submitted successfully!');
    } catch (error) {
      setLoading(false);
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
        {loading ? '. . . ' : 'Submit Claim'}
      </button>
    </div>
</form>
  );
}