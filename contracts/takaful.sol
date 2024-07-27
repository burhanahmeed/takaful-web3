// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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
    uint256 public claimCount;
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
        contributions[msg.sender] += msg.value;
        totalContributions += msg.value;
    }

    function submitClaim(uint256 amount, string memory reason) public onlyParticipants {
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

    function voteOnClaim(uint256 claimId, bool approve) public onlyParticipants {
        Claim storage claim = claims[claimId];
        require(block.timestamp <= claim.votingDeadline, "Voting period has ended");
        require(!claim.decided, "Claim has already been decided");

        if (approve) {
            claim.votesFor++;
        } else {
            claim.votesAgainst++;
        }

        // Automatically decide the claim if all participants have voted
        if (claim.votesFor + claim.votesAgainst == getTotalParticipants()) {
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
        }
    }

    function distributeSurplus() public onlyAdmin {
        uint256 surplus = address(this).balance;
        for (uint256 i = 0; i < claimCount; i++) {
            Claim storage claim = claims[i];
            if (!claim.approved && !claim.decided) {
                uint256 share = (contributions[claim.claimant] * surplus) / totalContributions;
                payable(claim.claimant).transfer(share);
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
