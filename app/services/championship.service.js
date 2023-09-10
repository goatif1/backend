let { QueryTypes } = require("sequelize");

// GET
const getAllChampionship = async function (){
    try {
        let DBConn = require("../models/database.model")();
        let sqlQuery = `
            SELECT
                championship.id as id,
                championship.name as name,
                championship.description as description,
                championship.dateofcreation as dateofcreation,
                championship.status as championship_status,
                championship.id_organization as id_organization,
                organization.name as organization_name
            FROM championship
            LEFT JOIN organization ON championship.id_organization = organization.id;
        `;

        return new Promise( function(resolve, reject) {
            DBConn.query(sqlQuery, {
                type: QueryTypes.SELECT,
            })
            .then((championships) => {
                resolve(championships && championships.length > 0 ? championships : []);
            })
            .catch((err) => {
                reject(err);
                throw Error("ChampionshipService. Error while getting championships data. " + err);
            });
        });

    } catch (e) {
        // log errors
        throw Error("Error while getting championships data");
    }
}

const getOrganizationChampionships = async function (id_organization){
    try {
        let DBConn = require("../models/database.model")();
        let sqlQuery = `
            SELECT
                championship.id as id,
                championship.name as name,
                championship.description as description,
                championship.dateofcreation as dateofcreation,
                championship.status as championship_status,
                championship.id_organization as id_organization,
                organization.name as organization_name,
                COUNT(championship_driver.address_driver) as num_players,
                COUNT(team.id) as num_teams
            FROM championship
            LEFT JOIN organization ON championship.id_organization = organization.id
            LEFT JOIN championship_driver ON championship_driver.id_championship = championship.id
            LEFT JOIN team ON team.id_championship = championship.id
            WHERE organization.id = $id_organization
            GROUP BY championship.id;
        `;

        return new Promise( function(resolve, reject) {
            DBConn.query(sqlQuery, {
                type: QueryTypes.SELECT,
                bind: {
                    id_organization: id_organization
                }
            })
            .then((championships) => {
                resolve(championships && championships.length > 0 ? championships : []);
            })
            .catch((err) => {
                reject(err);
                throw Error("ChampionshipService. Error while getting championships data. " + err);
            });
        });

    } catch (e) {
        // log errors
        throw Error("Error while getting championships data");
    }
}

const createChampionship = async (admin_address, organization_id, championship_data) => {
    try {
        console.log("CREATE CHAMPIONSHIP IN SERVICE");
        let DBConn = require("../models/database.model")();
        let transction = await DBConn.transaction();
        
        try {
            // ------- Create the championship -------
            let sqlQuery = `
                INSERT INTO championship (
                    id_organization,
                    name,
                    description
                ) VALUES (
                    $organization_id,
                    $name,
                    $description
                );
            `;
            let createChampionship_res = await DBConn.query(sqlQuery, {
                type: QueryTypes.INSERT,
                bind: {
                    organization_id: organization_id,
                    name: championship_data.name,
                    description: championship_data.description
                },
                transction: transction
            });

            console.log("RESULT: ", createChampionship_res);
            let id_championship = createChampionship_res[0];

            for (const invitation_code of championship_data.invitationCodes){
                // find the user
                sqlQuery = `
                    SELECT address
                    FROM user
                    WHERE invitation_code = $code;
                `;
                let user = null;
                const user_res = await DBConn.query(sqlQuery, {
                    type: QueryTypes.SELECT,
                    bind: {
                        code: invitation_code
                    }
                });

                if (user_res && user_res.length > 0){
                    user = user_res[0].address;
                } else{
                    throw Error("Invitation code does not refer to any user");
                }

                // add the user to the championship
                sqlQuery = ``;

            }

            await transction.commit();
            return true;

        } catch (e){
            await transction.rollback();
            DBConn.close();
        }

        return true;

    } catch (e){
        console.log("EXCEPTION SERVICE: ", e);
        throw Error("Error creating new championship.");
    }
}

module.exports = {
    getAllChampionship,
    getOrganizationChampionships,

    createChampionship
}