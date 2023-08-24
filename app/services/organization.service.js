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

        let transaction = await DBConn.transaction();

        let insert_organization_result = await DBConn.query(sqlQuery, {
            type: QueryTypes.INSERT,
            bind: {
                name: league_name,
                description: league_description
            },
            transaction: transaction
        });

        if (insert_organization_result && insert_organization_result.length > 0){
            console.log("INSERT ORGANIZATION result: ", insert_organization_result);
            let organization_id = insert_organization_result[0];

            sqlQuery = `
                INSERT INTO organization_admin (
                    id_organization,
                    address_admin
                ) VALUES (
                    $id,
                    $address
                );
            `;
            let insert_organization_admin = await DBConn.query(sqlQuery, {
                type: QueryTypes.INSERT,
                bind: {
                    id: organization_id,
                    address: admin_public_address
                },
                transaction: transaction
            });
            console.log("INSERT ADMIN result: ", insert_organization_admin);

            if (insert_organization_admin && insert_organization_admin.length > 0){
                await transaction.commit();
                return true;
            } else {
                await transaction.rollback();
                throw Error("OrganizationService. Error while getting creating league");
            }


        } else {
            await transaction.rollback();
            throw Error("OrganizationService. Error while getting creating league");
        }

    } catch (e) {
        // log errors
        throw Error("OrganizationService. Error while getting creating league");
    }
}

module.exports = {
    getAllOrgnanizations,
    createOrganization
}