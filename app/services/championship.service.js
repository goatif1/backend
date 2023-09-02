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

module.exports = {
    getAllChampionship,
    getOrganizationChampionships
}