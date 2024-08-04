require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      chainId: 3441006,
      // accounts: [
      //   {
      //     privateKey: "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6",
      //     balance: "10000000000000000000000" // 10,000 ETH in wei
      //   },
      //   {
      //     privateKey: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      //     balance: "10000000000000000000000" // 10,000 ETH in wei
      //   },
      // ]
    }
  }
};
