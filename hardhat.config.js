require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.18",
  paths: {
    contracts: "./contracts",
  },
  networks: {
    hardhat: {
      chainId: 1337
    }
  }
};
