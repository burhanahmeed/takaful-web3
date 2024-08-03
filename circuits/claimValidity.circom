pragma circom 2.0.0;

template ClaimValidity() {
    signal input claimant;
    signal input amount;
    signal input reason;
    signal input reasonScore;
    signal input minAmount;
    signal input maxAmount;
    
    signal output isValid;
    
    // Check if amount is within range
    signal amountLowerBound <== amount - minAmount;
    signal amountUpperBound <== maxAmount - amount;
    signal amountInRange <== amountLowerBound * amountUpperBound;
    
    // Check if reasonScore is more than 8
    signal scoreCheck <== reasonScore - 8;
    
    // Combine all checks
    isValid <== amountInRange * scoreCheck;
}

component main = ClaimValidity();
