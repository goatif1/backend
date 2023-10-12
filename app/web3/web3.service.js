require('dotenv').config();
const fs = require("fs");
const path = require('node:path'); 


const { Web3 } = require('web3');
// var web3 = new Web3('http://localhost:8545');
var web3 = new Web3('http://127.0.0.1:8545');

// const RoulettesContract_Abi = require("./contracts/RoulettesContract.json")["abi"];
const RoulettesContract_Abi = JSON.parse(fs.readFileSync(path.resolve("app/web3/contracts/RoulettesContract.json"))).abi;
const RoulettesContract_Address = process.env.ROULETTES_CONTRACT__ADDRESS;

const init = () => {
    console.log("CONTRACT ADDRESS: ", RoulettesContract_Address);
    console.log("CONTRACT ABI: ", RoulettesContract_Abi);
}

const getAdminAddress = () => {
    return process.env.ADMIN_ADDRESS;
}

const getContract__Roulettes = () => {
    return new web3.eth.Contract(RoulettesContract_Abi, RoulettesContract_Address);
}

module.exports = {
    init,
    getAdminAddress,
    // Rouletes
    getContract__Roulettes
}

