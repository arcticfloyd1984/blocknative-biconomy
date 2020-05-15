import React, { Component } from 'react';
import Web3 from 'web3';
import Transaction from '../abis/Transaction.json';
import './App.css';
import Main from './Main';
import Biconomy from "@biconomy/mexa";

const keys = require('../keys.js');
let web3Provider;

class App extends Component {

    async componentWillMount() {
        await this.loadWeb3();
        await this.loadBlockchainData();
    }

    async loadBlockchainData() {

        const biconomy = new Biconomy(web3Provider, {
            options: {
                dappId: keys.BICONOMY_DAPP_ID,
                apiKey: keys.BICONOMY_API_KEY,
                debug: true
            },
            notifyOptions: {
                notifyParams: {
                    dappId: keys.BLOCKNATIVE_DAPP_ID,
                    networkId: 3,
                    desktopPosition: "bottomLeft",
                },
                notifyEventOptions: { // notifyEventType: notifyCallBackFunction
                    all: (transaction) => {
                        console.log(transaction);
                    }
                }
            },
        });

        // const biconomy = new Biconomy(web3Provider, { dappId: '5eb6ce6b02f28832e8db5707	', apiKey: 'c4jqSXD-2.1facdab2-fd80-43ed-8c09-5571dd4bcafb', debug: true });

        window.web3 = new Web3(biconomy);
        const web3 = window.web3;

        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];

        const notifyAddressEventOptions = {
            all: (transaction) => {
                console.log(transaction);
            }
        }

        biconomy.onEvent(biconomy.READY, async() => {
            biconomy.addListenerToAccount(address, notifyAddressEventOptions)
            console.log(biconomy);
            const accounts = await web3.eth.getAccounts();
            this.setState({ account: accounts[0] });

            const ethBalance = await web3.eth.getBalance(this.state.account);
            this.setState({ ethBalance });


            const networkId = await web3.eth.net.getId();

            const transactionContractData = Transaction.networks[networkId];
            if (transactionContractData) {
                const transactionContract = new web3.eth.Contract(Transaction.abi, transactionContractData.address);
                this.setState({ transactionContract });
            } else {
                window.alert('Transaction contract not deployed on this network');
            }
        }).onEvent(biconomy.ERROR, (error, message) => {
            console.log(error);
        });

        this.setState({ loading: false });

    }


    async loadWeb3() {
        if (window.ethereum) {
            web3Provider = window.ethereum;
            await window.ethereum.enable();
        } else if (window.web3) {
            web3Provider = window.web3.currentProvider;
        } else {
            window.alert('Non-Ethereum browser detected, please install MetaMask');
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            account: '',
            ethBalance: '0',
            transactionContract: {},
            loading: true
        }
    }

    changeName = (name) => {
        this.setState({ loading: true });
        this.state.transactionContract.methods.changeName(name).send({ from: this.state.account }).on('transactionHash', (hash) => {
            this.setState({ loading: false })
        })
    }

    render() {
        let content;

        if (this.state.loading) {
            content = < p id = "loader"
            className = "text-center" > Loading... < /p>
        } else {
            content = < Main
            ethBalance = { this.state.ethBalance }
            changeName = { this.changeName }
            />
        }
        return ( <
            div >
            <
            nav className = "navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow" >
            <
            /nav> <
            div className = "container-fluid mt-5" >
            <
            div className = "row" >
            <
            main role = "main"
            className = "col-lg-12 d-flex text-center" >
            <
            div className = "content mr-auto ml-auto" > { content } <
            /div> < /
            main > <
            /div> < /
            div > <
            /div>
        );
    }
}

export default App;