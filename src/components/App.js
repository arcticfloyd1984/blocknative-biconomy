import React, { Component } from 'react';
import Web3 from 'web3';
import Transaction from '../abis/Transaction.json';
import './App.css';
import Main from './Main';
import Biconomy from "@biconomy/mexa";

const keys = require('../keys.js');

let web3;

class App extends Component {

    async componentWillMount() {
        await this.loadBlockchainData();
    }

    async loadBlockchainData() {

        const biconomy = new Biconomy({
            options: { dappId: keys.BICONOMY_DAPP_ID, apiKey: keys.BICONOMY_API_KEY, debug: true },
            onboard: {
                onboardDappId: keys.ONBOARD_DAPP_ID,
                networkId: 3,
                subscriptions: {
                    wallet: wallet => {
                        console.log(wallet.provider);
                        web3 = new Web3(wallet.provider);
                    }
                },
                wallets: [
                    { walletName: "metamask", preferred: true },
                    { walletName: "dapper", preferred: true },
                    {
                        walletName: "fortmatic",
                        apiKey: keys.FORTMATIC_KEY,
                        preferred: true
                    },
                    {
                        walletName: "portis",
                        apiKey: keys.PORTIS_KEY,
                        preferred: true,
                        label: 'Portis'
                    },
                ]
            }
        });
        await biconomy.walletSelect();
        await biconomy.walletCheck();


        biconomy.onEvent(biconomy.READY, async() => {
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