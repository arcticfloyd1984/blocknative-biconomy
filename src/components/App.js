import React, { Component } from 'react';
import Web3 from 'web3';
import Transaction from '../abis/Transaction.json';
import logo from '../logo.png';
import './App.css';
import Main from './Main';
import Onboard from 'bnc-onboard'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = window.web3;

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

    this.setState({ loading: false })

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
      dappId: process.env.BLOCKNATIVE_API_KEY,       // [String] The API key created by step one above
      networkId: 3,  // [Integer] The Ethereum network ID your Dapp uses.
      subscriptions: {
        wallet: wallet => {
           window.web3 = new Web3(wallet.provider)
        }
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
