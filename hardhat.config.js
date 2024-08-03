require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      chainId: 3441006,
      accounts: {
        count: 10,
        accountsBalance: "10000000000000000000000" // 10,000 ETH in wei
      }
    }
  }
};
