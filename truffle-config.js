const HDWalletProvider = require("@truffle/hdwallet-provider");
require('babel-register');
require('babel-polyfill');

// const privateKey1 = process.env.PRIVATE_KEY_1;

const privateKeys = [
  'A8ABBC36F840EB0CE7AB725B0DEB0C231D6B77C306354FBE4E38C59CA937550F',
  '66A1140A9DFA0047A24BE488528427EB1BF9F9EC707B092CBD5D183F3560B4F2',
  'EEA269CECCDE87319C88078CF559E4E4E36A47ADF088EDF4031E9AC18CC1D015'
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
