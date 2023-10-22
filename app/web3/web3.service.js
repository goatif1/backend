require('dotenv').config();
const fs = require("fs");
const path = require('node:path'); 


const { Web3 } = require('web3');
// var web3 = new Web3(process.env.HOST_IP);
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.HOST_IP));
web3.eth.Contract.handleRevert = true;

// My Contract
const mycontract_deployedAddressPath = path.join(__dirname + "/bin/", 'MyContractAddress.bin');
const mycontract_deployedAddress = fs.readFileSync(mycontract_deployedAddressPath, 'utf8');
const mycontract_abi = require('./abi/MyContractAbi.json');
const MyContract = new web3.eth.Contract(mycontract_abi, mycontract_deployedAddress);

// Roulettes Contract
const roulettes_contract_deployedAddressPath = path.join(__dirname + "/bin/", 'RoulettesContractAddress.bin');
const roulettes_contract_deployedAddress = fs.readFileSync(roulettes_contract_deployedAddressPath, 'utf8');
const roulettes_abi = require('./abi/RoulettesContractAbi.json');
const RoulettesContract = new web3.eth.Contract(roulettes_abi, roulettes_contract_deployedAddress);

// const RoulettesContract_Abi = require("./abi/RoulettesContract.json").abi;
// const RoulettesContract_Address = process.env.ROULETTES_CONTRACT__ADDRESS;

const init = () => {
    web3.eth
        .getBlockNumber()
        .then(result => {
            console.log('Current block number: ' + result);
        })
        .catch(error => {
            console.error(error);
        });

    interact();
}

const interact = async () => {
    const providersAccounts = await web3.eth.getAccounts();
    const defaultAccount = providersAccounts[0];

    try {
        // Get the current value of my number
        const myNumber = await MyContract.methods.myNumber().call();
        console.log('my number value: ' + myNumber);

        // Increment my number
        const receipt = await MyContract.methods.setMyNumber(myNumber + 1n).send({
            from: defaultAccount,
            gas: 1000000,
            gasPrice: 10000000000,
        });
        console.log('Transaction Hash: ' + receipt.transactionHash);

        // Get the updated value of my number
        const myNumberUpdated = await MyContract.methods.myNumber().call();
        console.log('my number updated value: ' + myNumberUpdated);


        const roulettesNumber = await RoulettesContract.methods.helloWorld().call();
        console.log("roulettes number is: ", roulettesNumber);

    } catch (error) {
        console.error(error);
    }
}

const getAdminAddress = () => {
    return process.env.ADMIN_ADDRESS;
}

const getContract__Roulettes = () => {
    return RoulettesContract;
}

module.exports = {
    init,
    getAdminAddress,
    // Rouletes
    getContract__Roulettes
}
