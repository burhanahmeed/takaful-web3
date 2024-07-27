import { useEffect, useState } from "react";

export default function ListClaims() {
  const [claims, setClaims] = useState([1,2,3,4,5]);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    loadClaims();
  }, []);

  const loadClaims = () => {

  }

  const voteOnClaim = async (claimId: any, approve: any) => {
    try {
     
    } catch (error) {
      console.error('Error voting on claim:', error);
      alert('Failed to submit vote.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <p>Loading claims...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {claims.map((claim, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <p><strong>Claimant:</strong> test</p>
              {/* <p><strong>Claimant:</strong> {claim.claimant}</p>
              <p><strong>Amount:</strong> {ethers.utils.formatEther(claim.amount)} MANTA</p>
              <p><strong>Reason:</strong> {claim.reason}</p>
              <p><strong>Votes For:</strong> {claim.votesFor}</p>
              <p><strong>Votes Against:</strong> {claim.votesAgainst}</p>
              <p><strong>Decided:</strong> {claim.decided ? 'Yes' : 'No'}</p>
              <p><strong>Approved:</strong> {claim.approved ? 'Yes' : 'No'}</p>
              <p><strong>Voting Deadline:</strong> {new Date(claim.votingDeadline * 1000).toLocaleString()}</p>
              {!claim.decided && (
                <div className="flex space-x-4 mt-4">
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => voteOnClaim(index, true)}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => voteOnClaim(index, false)}
                  >
                    Reject
                  </button>
                </div>
              )} */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}