const HDWalletProvider = require("@truffle/hdwallet-provider");
require('babel-register');
require('babel-polyfill');

const privateKey1 = process.env.PRIVATE_KEY_1;
const privateKey2 = process.env.PRIVATE_KEY_2;
const privateKey3 = process.env.PRIVATE_KEY_3;

const privateKeys = [
  privateKey1,
  privateKey2,
  privateKey3
]

module.exports = {
  networks: {
    ropsten: {
      provider: new HDWalletProvider(privateKeys, "https://ropsten.infura.io/v3/7b2d1f57984d4d2d85ece869d1853465", 0),
      network_id: 3
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
