let { QueryTypes } = require("sequelize");

// POST
const authenticate = async function (public_address, signature){
    try {
        let DBConn = require("../models/database.model")();
        let sqlQuery = `
            SELECT
                nonce
            FROM
                user
            WHERE
                user.address = $address
            LIMIT 1;
        `;

        return new Promise( function(resolve, reject) {
            DBConn.query(sqlQuery, {
                type: QueryTypes.SELECT,
                bind: {
                    address: public_address
                }
            })
            .then((nonce) => {
                resolve(nonce);
            })
            .catch((err) => {
                reject(err);
                throw Error("AuthService. Error while authenticating user. " + err);
            });
        });

    } catch (e) {
        // log errors
        throw Error("Error while authenticating user. " + e);
    }
}

module.exports = {
    authenticate
}