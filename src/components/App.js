import React, { Component } from 'react';
import Web3 from 'web3';
import Transaction from '../abis/Transaction.json';
import logo from '../logo.png';
import './App.css';
import Main from './Main';
import Onboard from 'bnc-onboard';
import Biconomy from "@biconomy/mexa";

const FORTMATIC_KEY = 'pk_test_EBBC135C6497F848';
const PORTIS_KEY = '9e6ef3bb-ac3c-4563-87e8-59c316f30be6';
const BICONOMY_DAPP_ID = '5e99a3c6667350123f4de8f2';
const BICONOMY_API_KEY = 'c4jqSXD-2.1facdab2-fd80-43ed-8c09-5571dd4bcafb';
let web3Provider;

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {

    const biconomy = new Biconomy(web3Provider,{dappId: BICONOMY_DAPP_ID, apiKey: BICONOMY_API_KEY});
    const web3 = window.web3;
    biconomy.onEvent(biconomy.READY, async () => {
      // Initialize your dapp here like getting user accounts etc
        const accounts = await web3.eth.getAccounts();
        this.setState({ account: accounts[0]});

        const ethBalance = await web3.eth.getBalance(this.state.account);
        this.setState({ ethBalance });


        const networkId = await web3.eth.net.getId();

        const transactionContractData = Transaction.networks[networkId];
        if(transactionContractData) {
          const transactionContract = new web3.eth.Contract(Transaction.abi, transactionContractData.address);
          this.setState({ transactionContract });
        } else {
          window.alert('Transaction contract not deployed on this network');
        }
    }).onEvent(biconomy.ERROR, (error, message) => {
      // Handle error while initializing mexa
      console.log(error);
    });    

    this.setState({ loading: false });

  }

  async loadWeb3() {
    // if(window.ethereum) {
    //   window.web3 = new Web3(window.ethereum);
    //   await window.ethereum.enable();
    // } 
    // else if(window.web3) {
    //   window.web3 = new Web3(window.web3.currentProvider);
    // }
    // else {
    //   window.alert('Non-Ethereum browser detected, please install metamask');
    // }

    const onboard = Onboard({
      dappId: '5faf9ea3-b2d4-4123-84f8-1dc3014acf92',       // [String] The API key created by step one above
      networkId: 3,  // [Integer] The Ethereum network ID your Dapp uses.
      subscriptions: {
        wallet: wallet => {
           window.web3 = new Web3(wallet.provider); 
           web3Provider = wallet.provider;
        }
      },
      walletSelect: {
        wallets : [
          // { walletName: "coinbase", preferred: true }, // Will not work on desktop and only on mobile
          { walletName: "metamask", preferred: true },
          { walletName: "dapper", preferred: true },
          {
            walletName: "fortmatic",
            apiKey: FORTMATIC_KEY,
            preferred: true
          },
          {
            walletName: "portis",
            apiKey: PORTIS_KEY,
            preferred: true,
            label: 'Portis'
          },
          // { walletName: "opera" },
          // { walletName: "torus" },
        ]
      }
    });

    await onboard.walletSelect();
    await onboard.walletCheck();

  }

  constructor(props) {
    super(props) 
    this.state = {
      account: '',
      ethBalance: '0',
      transactionContract: {},
      nameValue: '',
      loading: true
    }
  }

  changeName = (name) => {
    this.setState({ loading: true });
    this.state.transactionContract.methods.changeName(name).send({from: this.state.account}).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  nameValue = () => {
    this.setState({ loading: true });
    this.state.transactionContract.methods.variableName().call((err, result) => {
      if(err) {
        window.alert('Error in retrieving counter value');
      } else {
        this.setState({ nameValue: result });
        this.setState({ loading: false });
      }
    })
  }

  render() {
    let content;

    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main 
        ethBalance = {this.state.ethBalance}
        changeName =  {this.changeName}
        nameValue = {this.state.nameValue}       
      />
    }
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
