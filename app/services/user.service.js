let { QueryTypes } = require("sequelize");

// GET
const getUser = async function (address){
    try {
        let DBConn = require("../models/database.model")();
        let sqlQuery = `
            SELECT
                user.address as address,
                user.nonce as nonce,
                user.nickname as nickname,
                user.dateofcreation as dateofcreation,
                user.invitation_code as invitation_code,
                user.url_image as url_image
            FROM user
            WHERE user.address = $address
            LIMIT 1;
        `;

        return new Promise( function(resolve, reject) {
            DBConn.query(sqlQuery, {
                type: QueryTypes.SELECT,
                bind: {
                    address: address
                }
            })
            .then((users) => {
                resolve(users && users.length > 0 ? users[0] : null);
            })
            .catch((err) => {
                reject(err);
                throw Error("UserService. Error while getting user data. " + err);
            });
        });

    } catch (e) {
        // log errors
        console.log("Get user exception: ", e);
        throw Error("Error while getting user data");
    }
}

const getNonce = async function (address){
    try {
        let DBConn = require("../models/database.model")();
        let sqlQuery = `
            SELECT
                user.nonce
            FROM user
            WHERE user.address = $address;
        `;

        return new Promise( function(resolve, reject) {
            DBConn.query(sqlQuery, {
                type: QueryTypes.SELECT,
                bind: {
                    address: address
                }
            })
            .then((users_nonces) => {
                resolve(users_nonces && users_nonces.length > 0 ? users_nonces[0].nonce : null);
            })
            .catch((err) => {
                reject(err);
                throw Error("UserService. Error while getting nonce. " + err);
            });
        });

    } catch (e) {
        // log errors
        throw Error("Error while getting nonce");
    }
}

// POST
const createUser = async function (address, nonce, nickname, invitation_code){
    try {
        let DBConn = require("../models/database.model")();
        let sqlQuery = `
            INSERT INTO user (address, nonce, nickname, invitation_code)
            VALUES ($address, $nonce, $nickname, $invitation_code);
        `;

        return new Promise( function(resolve, reject) {
            DBConn.query(sqlQuery, {
                type: QueryTypes.INSERT,
                bind: {
                    address: address,
                    nonce: nonce,
                    nickname: nickname,
                    invitation_code: invitation_code
                }
            })
            .then((user) => {
                resolve(user);
            })
            .catch((err) => {
                reject(err);
                throw Error("UserService. Error while creating user. " + err);
            });
        });

    } catch (e) {
        // log errors
        throw Error("Error while creating user. " + e);
    }
}

module.exports = {
    getUser,
    getNonce,

    createUser
}