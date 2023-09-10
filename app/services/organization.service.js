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

const getUserOrgnanizations = async function (public_address){
    try {
        let DBConn = require("../models/database.model")();
        let sqlQuery = `
            SELECT
                organization.id as id,
                organization.name as name,
                organization.description as description,
                organization.dateofcreation as dateofcreation
            FROM organization
            LEFT JOIN organization_admin ON organization_admin.id_organization = organization.id
            WHERE organization_admin.address_admin = $address;
        `;

        return new Promise( function(resolve, reject) {
            DBConn.query(sqlQuery, {
                type: QueryTypes.SELECT,
                bind: {
                    address: public_address
                }
            })
            .then((organizations) => {
                resolve(organizations && organizations.length > 0 ? organizations : []);
            })
            .catch((err) => {
                reject(err);
                throw Error("OrganizationService. Error while getting user organizations data. " + err);
            });
        });

    } catch (e) {
        // log errors
        throw Error("Error while getting user organizations data");
    }
}

const getOrganization = async function (id_organization){
    try {
        let DBConn = require("../models/database.model")();
        let sqlQuery = `
            SELECT
                organization.id as id,
                organization.name as name,
                organization.description as description,
                organization.dateofcreation as dateofcreation,
                organization_admin.address_admin as admin
            FROM organization
            LEFT JOIN organization_admin ON organization_admin.id_organization = organization.id
            WHERE organization.id = $id_organization
            ;
        `;

        return new Promise( function(resolve, reject) {
            DBConn.query(sqlQuery, {
                type: QueryTypes.SELECT,
                bind: {
                    id_organization: id_organization
                }
            })
            .then((organization) => {
                resolve(organization && organization.length > 0 ? organization[0] : null);
            })
            .catch((err) => {
                reject(err);
                throw Error("OrganizationService. Error while getting organization data. " + err);
            });
        });

    } catch (e) {
        // log errors
        throw Error("Error while getting organization data");
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

            if (insert_organization_admin && insert_organization_admin.length > 0){
                await transaction.commit();
                return true;
            } else {
                await transaction.rollback();
                throw Error("OrganizationService. Error while creating league");
            }


        } else {
            await transaction.rollback();
            throw Error("OrganizationService. Error while creating league");
        }

    } catch (e) {
        // log errors
        throw Error("OrganizationService. Error while creating league");
    }
}

// Checks
const isOrganizationAdmin = async (user_address, organization_id) => {
    try {
        let DBConn = require("../models/database.model")();
        let sqlQuery = `
            SELECT
                id_organization
            FROM organization_admin
            WHERE 
                id_organization = $organization_id 
                AND address_admin = $user_address;
        `;

        const admin = await DBConn.query(sqlQuery, {
            type: QueryTypes.SELECT,
            bind: {
                organization_id: organization_id,
                user_address: user_address
            }
        });

        return admin.length > 0;

    } catch(e) {
        throw Error("Error checking if user is admin of the organization")
    }
}

module.exports = {
    getAllOrgnanizations,
    getUserOrgnanizations,
    getOrganization,

    createOrganization,

    isOrganizationAdmin
}