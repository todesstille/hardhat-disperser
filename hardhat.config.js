require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 999999,
      },
      evmVersion: "paris",
    },
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/47bcfcab54cd4104a97fb13f84ae431e`,
      accounts: [process.env.PRIVATE_KEY]
    },
  },
  etherscan: {
    apiKey: {
      sepolia: "R12EHHV3BF9ZYT8CBMZMXU9HZMYCG5D1AD",
    }
  }
}
