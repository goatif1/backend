const { QueryTypes } = require("sequelize");
const { getContract__Roulettes, getAdminAddress } = require("../web3/web3.service");


const getRaceRoulette = async (id_race) => {
    try {
        let DBConn = require("../models/database.model")();
        let sqlQuery = `
            SELECT
                roulette.id as id
            FROM roulette
            WHERE roulette.id_race = $id_race;
        `;

        let roulette = await DBConn.query(sqlQuery, {
            type: QueryTypes.SELECT,
            bind: {
                id_race: id_race
            }
        });

        if (roulette && roulette.length > 0) return roulette[0].id;
        return null;

    } catch (e) {
        throw Error("Error while getting race roulette");
    }
}

const createRaceRoulette = async (id_race) => {
    try {
        // let DBConn = require("../models/database.model")();
        // let sqlQuery = `
        //     SELECT
        //         roulette.id as id
        //     FROM roulette
        //     WHERE roulette.id_race = $id_race;
        // `;

        // let roulette = await DBConn.query(sqlQuery, {
        //     type: QueryTypes.SELECT,
        //     bind: {
        //         id_race: id_race
        //     }
        // });

        // if (roulette && roulette.length > 0) return roulette[0].id;
        // return null;

        // Test to call a contract function
        const roulettes_contract = getContract__Roulettes();
        let result = await roulettes_contract.methods.helloWorld().call({from: getAdminAddress()});
        console.log("ROULETTES CONTRACT RETURN: ", result);

        return true;
        
    } catch (e) {
        console.log("EXCEPTION ROULETTE CREATION: ", e);
        throw Error("Error while getting race roulette");
    }
}

module.exports = {
    getRaceRoulette,
    createRaceRoulette
}