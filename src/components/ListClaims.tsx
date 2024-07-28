import { useEffect, useState } from "react";
import { listClaims } from "@/utils/wallet";
import { ethers } from "ethers";
import { formatAddress } from "@/utils/string";

export default function ListClaims() {
  const [claims, setClaims] = useState([1,2,3,4,5]);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    loadClaims();
  }, []);

  const loadClaims = async () => {
    try {
      setLoading(true);
      const claimsList = await listClaims();
      console.log(claimsList);
      
      setClaims(claimsList);
    } catch (error) {
      console.error('Error loading claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const voteOnClaim = async (claimId: any, approve: any) => {
    try {
     
    } catch (error) {
      console.error('Error voting on claim:', error);
      alert('Failed to submit vote.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">List claims</h1>
      {loading ? (
        <p>Loading claims...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {claims.map((claim: any, index) => (
          <div key={index} className="bg-white shadow-md rounded-md p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-bold">Claimant:</p>
                <div className="relative group">
                  <p className="text-blue-500">{formatAddress(claim.claimant)}</p>
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {claim.claimant}
                  </span>
                </div>
              </div>
              <div>
                <p className="font-bold">Amount:</p>
                <p>{claim.amount} ETH</p>
              </div>
              <div>
                <p className="font-bold">Reason:</p>
                <p>{claim.reason}</p>
              </div>
              <div>
                <p className="font-bold">Votes For:</p>
                <p>{claim.votesFor}</p>
              </div>
              <div>
                <p className="font-bold">Votes Against:</p>
                <p>{claim.votesAgainst}</p>
              </div>
              <div>
                <p className="font-bold">Decided:</p>
                <p>{claim.decided ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="font-bold">Approved:</p>
                <p>{claim.approved ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="font-bold">Voting Deadline:</p>
                <p>{new Date(claim.votingDeadline * 1000).toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4">
              <button onClick={() => voteOnClaim(index, true)} className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Approve</button>
              <button onClick={() => voteOnClaim(index, false)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4">Reject</button>
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
}