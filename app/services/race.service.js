const { QueryTypes } = require("sequelize");
const { getContract__Roulettes, createRoulette } = require("../web3/web3.service");


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

const createRaceRoulette = async (id_race, roulette_options, creator) => {
    try {
        let DBConn = require("../models/database.model")();
        let transaction = await DBConn.transaction();

        let sqlQuery = `
            INSERT INTO roulette (
                id_race
            ) VALUES ($id_race);
        `;

        try {
            let roulette_res = await DBConn.query(sqlQuery, {
                type: QueryTypes.INSERT,
                transaction: transaction,
                bind: {
                    id_race: id_race
                }
            });

            let roulette_id = roulette_res[0];

            sqlQuery = `
                INSERT INTO roulette_option (
                    id_roulette,
                    name
                ) VALUES (
                    $id_roulette,
                    $name
                );
            `;
            for (let i = 0; i < roulette_options.length; i++){
                let roulette_option_res = await DBConn.query(sqlQuery, {
                    type: QueryTypes.INSERT,
                    transaction: transaction,
                    bind: {
                        id_roulette: roulette_id,
                        name: roulette_options[i].name
                    }
                });

                let option_internal_id = roulette_option_res[0];
                roulette_options[i].internal_id = option_internal_id;
            }


            // TODO: CREATE ROULETTE ON SMART CONTRACT
            console.log("CREATOR IS: ", creator);

            let options = [];
            for (const option of roulette_options){
                options.push({id: option.internal_id, weight: option.value})
            }

            let created = await createRoulette(roulette_id, options, creator);
            if (created){
                await transaction.commit();
            } else {
                throw Error("SC createRoulette error");
            }

            return true;

        } catch (e){
            await transaction.rollback();
            console.log("EXCEPTION IN TRANSACTION: ", e);
            throw Error("Error on create roulette. ");
        }

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