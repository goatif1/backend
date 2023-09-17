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

const getChampionship = async function (id_championship){
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
            LEFT JOIN organization ON championship.id_organization = organization.id
            WHERE championship.id = $id_championship;
        `;

        return new Promise( function(resolve, reject) {
            DBConn.query(sqlQuery, {
                type: QueryTypes.SELECT,
                bind: {
                    id_championship: id_championship
                }
            })
            .then((championships) => {
                resolve(championships && championships.length > 0 ? championships[0] : null);
            })
            .catch((err) => {
                reject(err);
                throw Error("ChampionshipService. Error while getting championship. " + err);
            });
        });

    } catch (e) {
        // log errors
        throw Error("Error while getting championship");
    }
}

const getChampionshipDriverStanding = async function (id_championship){
    try {
        let DBConn = require("../models/database.model")();
        let sqlQuery = `
            SELECT
                championship_driver.address_driver as address_driver,
                championship_driver.total_points as total_points,

                user.nickname as nickname,
                user.url_image as user_image
            
            FROM championship_driver
            LEFT JOIN user ON user.address = championship_driver.address_driver

            WHERE championship_driver.id_championship = $id_championship
            
            ORDER BY total_points DESC;
        `;

        return new Promise( function(resolve, reject) {
            DBConn.query(sqlQuery, {
                type: QueryTypes.SELECT,
                bind: {
                    id_championship: id_championship
                }
            })
            .then((drivers) => {
                resolve(drivers);
            })
            .catch((err) => {
                reject(err);
                throw Error("ChampionshipService. Error while getting championship driver standing. " + err);
            });
        });

    } catch (e) {
        // log errors
        throw Error("Error while getting championship driver standing");
    }
}

const getChampionshipTeamStanding = async function (id_championship){
    try {
        let DBConn = require("../models/database.model")();
        let sqlQuery = `
            SELECT
                team.id as team_id,
                team.total_points as total_points,
                team.name as name,
                team.description as description,
                team.address_driver_1 as address_driver_1,
                team.address_driver_2 as address_driver_2
            
            FROM team

            WHERE team.id_championship = $id_championship
            
            ORDER BY total_points DESC;
        `;

        return new Promise( function(resolve, reject) {
            DBConn.query(sqlQuery, {
                type: QueryTypes.SELECT,
                bind: {
                    id_championship: id_championship
                }
            })
            .then((teams) => {
                resolve(teams);
            })
            .catch((err) => {
                reject(err);
                throw Error("ChampionshipService. Error while getting championship team standings. " + err);
            });
        });

    } catch (e) {
        // log errors
        throw Error("Error while getting championship team standings");
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
                sqlQuery = `
                    INSERT INTO championship_driver (
                        id_championship,
                        address_driver,
                        total_points
                    ) VALUES (
                        $id_championship,
                        $address,
                        0
                    );
                `;
                await DBConn.query(sqlQuery, {
                    type: QueryTypes.INSERT,
                    transction: transction,
                    bind: {
                        id_championship: id_championship,
                        address: user
                    }
                });

                if (championship_data.adminIsDriver){
                    // Admin that is sending the request, will run as driver too
                    await DBConn.query(sqlQuery, {
                        type: QueryTypes.INSERT,
                        transction: transction,
                        bind: {
                            id_championship: id_championship,
                            address: admin_address
                        }
                    });
                }

                sqlQuery = `
                    INSERT INTO team (
                        id_championship,
                        name,
                        total_points
                    ) VALUES (
                        $id_championship,
                        $name,
                        0
                    );
                `;

                // Create the teams
                for (const team of championship_data.teams){
                    await DBConn.query(sqlQuery, {
                        type: QueryTypes.INSERT,
                        transaction: transction,
                        bind: {
                            id_championship: id_championship,
                            name: team
                        }
                    });
                }

            }

            await transction.commit();
            return true;

        } catch (e){
            await transction.rollback();
            DBConn.close();
        }

        return false;

    } catch (e){
        console.log("EXCEPTION SERVICE: ", e);
        throw Error("Error creating new championship.");
    }
}

module.exports = {
    getAllChampionship,
    getOrganizationChampionships,

    getChampionship,
    getChampionshipDriverStanding,
    getChampionshipTeamStanding,

    createChampionship
}