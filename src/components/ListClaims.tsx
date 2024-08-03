import { useEffect, useState } from "react";
import { decideClaim, isAdmin as isAdminFunc, listClaims, voteOnClaim } from "@/utils/wallet";
import { formatAddress } from "@/utils/string";

export default function ListClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const isAdminVar = await isAdminFunc();
      setIsAdmin(isAdminVar);
    };

    checkAdmin();
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

  const handleVote = async (claimId: any, approve: any) => {
    try {
      setLoading(true);
      await voteOnClaim(claimId, approve);
      await loadClaims(); // Reload claims to reflect the new vote
      alert('Vote submitted successfully.');
    } catch (error) {
      console.error('Error voting on claim:', error);
      if (error.code === 'UNPREDICTABLE_GAS_LIMIT' && error.error && error.error.message) {
        alert(`Failed to submit vote: ${error.error.message}`);
      } else {
        alert(`Failed to submit vote: ${error?.error?.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const deceideClaimFn = async (claimId: any) => {
    try {
      setLoading(true);
      await decideClaim(claimId);
      await loadClaims(); // Reload claims to reflect the decision
      alert('Claim decided successfully.');
    } catch (error) {
      console.error('Error deciding claim:', error);
      if (error.code === 'UNPREDICTABLE_GAS_LIMIT' && error.error && error.error.message) {
        alert(`Failed to submit vote: ${error.error.message}`);
      } else {
        alert(`Failed to submit vote: ${error?.error?.message}`);
      }
    } finally {
      setLoading(false);
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
                {claim.claimant && (
                  <div className="relative group">
                    <p className="text-blue-500">{formatAddress(claim.claimant)}</p>
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {claim.claimant}
                    </span>
                  </div>
                )}
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
                <p>{new Date(claim.votingDeadline).toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4">
              {!claim.decided && (
                <>
                  <button onClick={() => handleVote(index, true)} className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Approve</button>
                  <button onClick={() => handleVote(index, false)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4">Reject</button>
                </>
              )}
              {isAdmin && !claim.decided && (
                <button onClick={() => deceideClaimFn(index)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4">Deciede Claim</button>
              )}
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
}