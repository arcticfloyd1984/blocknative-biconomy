const Transaction = artifacts.require("Transaction");

module.exports = async function(deployer) {
	
	await deployer.deploy(Transaction);
	const transaction = await Transaction.deployed();	
}