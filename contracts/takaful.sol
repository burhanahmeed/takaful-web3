// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Takaful {
    struct Claim {
        address claimant;
        uint256 amount;
        string reason;
        uint256 votesFor;
        uint256 votesAgainst;
        bool decided;
        bool approved;
        uint256 votingDeadline;
    }

    address public admin;
    uint256 public totalContributions;
    mapping(address => uint256) public contributions;
    mapping(uint256 => Claim) public claims;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    uint256 public claimCount;
    uint256 public contributionCount;
    uint256 public votingPeriod = 2 days;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    modifier onlyParticipants() {
        require(contributions[msg.sender] > 0, "Only participants can call this function");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function contribute() public payable {
        require(msg.value > 0, "Contribution must be greater than 0");
        require(msg.value <= msg.sender.balance, "Contribution exceeds wallet balance");
        contributions[msg.sender] += msg.value;
        totalContributions += msg.value;
        contributionCount++;
    }

    function submitClaim(
        uint256 amount, 
        string memory reason
    ) public onlyParticipants {
        require(amount > 0 && amount <= totalContributions, "Invalid claim amount");
        claims[claimCount] = Claim({
            claimant: msg.sender,
            amount: amount,
            reason: reason,
            votesFor: 0,
            votesAgainst: 0,
            decided: false,
            approved: false,
            votingDeadline: block.timestamp + votingPeriod
        });

        claimCount++;
    }

    function hasVotedFunction(uint256 claimId, address participant) public view returns (bool) {
        return hasVoted[claimId][participant];
    }

    function voteOnClaim(uint256 claimId, bool approve) public onlyParticipants {
        Claim storage claim = claims[claimId];
        require(block.timestamp <= claim.votingDeadline, "Voting period has ended");
        require(!claim.decided, "Claim has already been decided");
        require(!hasVoted[claimId][msg.sender], "Participant has already voted");

        if (approve) {
            claim.votesFor++;
        } else {
            claim.votesAgainst++;
        }

        hasVoted[claimId][msg.sender] = true;

        // Automatically decide the claim if all participants have voted
        if (claim.votesFor + claim.votesAgainst == getTotalParticipants() - 1) {
            decideClaim(claimId);
        }
    }

    function decideClaim(uint256 claimId) public onlyAdmin {
        Claim storage claim = claims[claimId];
        require(!claim.decided, "Claim has already been decided");
        require(block.timestamp > claim.votingDeadline, "Voting period is still ongoing");

        claim.decided = true;
        if (claim.votesFor > claim.votesAgainst) {
            claim.approved = true;
            payable(claim.claimant).transfer(claim.amount);
            totalContributions -= claim.amount;
        } else {
            revert("Claim not approved: insufficient votes");
        }
    }

    function getAllParticipants() internal view returns (address[] memory) {
        address[] memory participants = new address[](contributionCount);
        uint256 participantCount = 0;

        for (uint256 i = 0; i < contributionCount; i++) {
            address participant = participants[i];
            if (contributions[participant] > 0) {
                bool isDuplicate = false;
                for (uint256 j = 0; j < participantCount; j++) {
                    if (participants[j] == participant) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    participants[participantCount] = participant;
                    participantCount++;
                }
            }
        }

        address[] memory result = new address[](participantCount);
        for (uint256 i = 0; i < participantCount; i++) {
            result[i] = participants[i];
        }

        return result;
    }

    function distributeSurplus() public onlyAdmin {
        uint256 surplus = address(this).balance;
    
        address[] memory participants = getAllParticipants();
        for (uint256 i = 0; i < participants.length; i++) {
            address participant = participants[i];
            if (contributions[participant] > 0) {
                uint256 share = (contributions[participant] * surplus) / totalContributions;
                payable(participant).transfer(share);
            }
        }
    }

    function getTotalParticipants() public view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < claimCount; i++) {
            if (contributions[claims[i].claimant] > 0) {
                count++;
            }
        }
        return count;
    }

    function listClaims() public view returns (Claim[] memory) {
        Claim[] memory allClaims = new Claim[](claimCount);
        for (uint256 i = 0; i < claimCount; i++) {
            allClaims[i] = claims[i];
        }
        return allClaims;
    }

    function getTotalContributions() public view returns (uint256) {
        return totalContributions;
    }
}
