const crypto = require ("crypto");
const { Web3 } = require('web3'); //  web3.js has native ESM builds and (`import Web3 from 'web3'`)
const fs = require("fs");
const path = require('node:path');

const HOST_IP = "http://192.168.1.45:7545";

// Set up a connection to the Ethereum network
const web3 = new Web3(new Web3.providers.HttpProvider(HOST_IP));
web3.eth.Contract.handleRevert = true;

// const providersAccounts = await web3.eth.getAccounts();
const defaultAccount = "0xC434641a5db612cCC1Ad2dDE3d1Abd096D6788EB";
console.log('deployer account:', defaultAccount);

const contracts_info = [
    {
        fileName: "MyContract.sol",
        contractName: "MyContract",
        constructor: [1]
    },
    {
        fileName: "RoulettesContract.sol",
        contractName: "RoulettesContract",
        constructor: [defaultAccount]
    }
]

let contracts = [];

for (const contract_ of contracts_info){
    // Read the bytecode from the file system
    const bytecodePath = path.join(__dirname + "/bin/", `${contract_.contractName}Bytecode.bin`);
    const bytecode = fs.readFileSync(bytecodePath, 'utf8');

    // Create a new contract object using the ABI and bytecode
    const abi = require(`./abi/${contract_.contractName}Abi.json`);
    const NewContract = new web3.eth.Contract(abi);
    contracts.push({
        contract: NewContract,
        bytecode: bytecode,
        name: contract_.contractName,
        constructor: contract_.constructor
    });
}

async function deploy() {
    let i = 0;
    for (const contract of contracts){
        console.log("Going to deploy contract ", contract.name)
        const myContract = contract.contract.deploy({
            data: '0x' + contract.bytecode,
            arguments: contract.constructor,
        });

        // optionally, estimate the gas that will be used for development and log it
        const gas = await myContract.estimateGas({
            from: defaultAccount,
        });
        console.log('estimated gas:', gas);

        try {
            // Deploy the contract to the Ganache network
            const tx = await myContract.send({
                from: defaultAccount,
                gas,
                gasPrice: 10000000000,
            });
            console.log(`Contract [${contract.name}] deployed at address: ` + tx.options.address);
    
            // Write the Contract address to a new file
            const deployedAddressPath = path.join(__dirname + "/bin/", `${contract.name}Address.bin`);
            fs.writeFileSync(deployedAddressPath, tx.options.address);
        } catch (error) {
            console.error(error);
        }
        i++;
    }
}

deploy();