let { QueryTypes } = require("sequelize");

// GET
const getAllOrgnanizations = async function (){
    try {
        let DBConn = require("../models/database.model")();
        let sqlQuery = `
            SELECT
                organization.id as id,
                organization.name as name,
                organization.description as description,
                organization.dateofcreation as dateofcreation
            FROM organization;
        `;

        return new Promise( function(resolve, reject) {
            DBConn.query(sqlQuery, {
                type: QueryTypes.SELECT,
            })
            .then((organizations) => {
                resolve(organizations && organizations.length > 0 ? organizations : []);
            })
            .catch((err) => {
                reject(err);
                throw Error("OrganizationService. Error while getting organizations data. " + err);
            });
        });

    } catch (e) {
        // log errors
        throw Error("Error while getting organizations data");
    }
}

// POST
const createOrganization = async (admin_public_address, league_name, league_description) => {
    try {
        let DBConn = require("../models/database.model")();
        let sqlQuery = `
            INSERT INTO organization (
                name,
                description
            ) VALUES (
                $name,
                $description
            );
        `;

        let transaction = DBConn.transaction();

        return new Promise( function(resolve, reject) {
            DBConn.query(sqlQuery, {
                type: QueryTypes.INSERT,
                bind: {
                    name: league_name,
                    description: league_description
                },
                transaction: transaction
            })
            .then((organization) => {
                console.log("ORGANIZATION CREATED: ", organization);
                sqlQuery = `
                    INSERT INTO organization_admin (
                        id_organization,
                        address_admin
                    ) VALUES (
                        $id,
                        $address
                    );
                `;
                transaction.rollback();

            })
            .catch((err) => {
                transaction.rollback();
                reject(err);
                throw Error("OrganizationService. Error while getting organizations data. " + err);
            });
        });

    } catch (e) {
        // log errors
        throw Error("Error while getting organizations data");
    }
}

module.exports = {
    getAllOrgnanizations,
    createOrganization
}